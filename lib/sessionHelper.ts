import puppeteer, { type Browser, type Page } from "puppeteer"
import path from "node:path"
import fs from "node:fs"

/**
 * Automated Instagram login via Puppeteer — resilient variant.
 *
 * Improvements over the naive version:
 *  - PERSISTENT profile: a fixed Chromium userDataDir so Instagram sees one
 *    consistent "device" instead of a fresh headless ghost every login. This
 *    is the single biggest reducer of "suspicious login" triggers.
 *  - FULL cookie jar captured (not just `sessionid`) so the backend can reuse
 *    the whole session via instagrapi, meaning we rarely need to re-login.
 *  - 2FA handled IN-FLOW: when Instagram asks for a code we DO NOT ask the user
 *    to disable 2FA. We park the live browser in a challenge store and hand the
 *    client a `challengeId`; the client shows a 6-digit code modal, then calls
 *    submit2fa() to resume that exact browser session.
 *
 * Two-step handshake (driven by the API routes):
 *   1) startLogin(u, p)  -> { status: "ok", cookies }  |  { status: "2fa_required", challengeId }
 *   2) submit2fa(id, code) -> { status: "ok", cookies } | throws 2FA_INVALID (retryable)
 *
 * IMPORTANT: must run on the SERVER (Node), never in the browser.
 */

export interface CookieShape {
  name: string
  value: string
  domain: string
  path: string
  expires: number
  httpOnly: boolean
  secure: boolean
  sameSite?: "Strict" | "Lax" | "None"
}

export interface StartResult {
  status: "ok" | "2fa_required"
  sessionid?: string
  cookies?: CookieShape[]
  challengeId?: string
  message?: string
}

export interface ChallengeState {
  browser: Browser
  page: Page
  username: string
  createdAt: number
  lastActivity: number
  error?: string
}

const PROFILE_DIR = path.join(process.cwd(), "data", "ig-profile")

function launchOptions() {
  fs.mkdirSync(PROFILE_DIR, { recursive: true })
  return {
    headless: false as const,
    userDataDir: PROFILE_DIR,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      // Reduce automation fingerprinting.
      "--disable-blink-features=AutomationControlled",
      "--lang=en-US",
    ],
  }
}

// In-memory store of in-flight 2FA challenges (browser kept alive between calls).
const challenges = new Map<string, ChallengeState>()
const CHALLENGE_TTL_MS = 5 * 60 * 1000

function challengeId() {
  return `ch_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function getChallenge(id: string): ChallengeState | undefined {
  const c = challenges.get(id)
  if (!c) return undefined
  if (Date.now() - c.lastActivity > CHALLENGE_TTL_MS) {
    void cleanupChallenge(id)
    return undefined
  }
  return c
}

async function cleanupChallenge(id: string) {
  const c = challenges.get(id)
  if (c) {
    try {
      await c.browser.close()
    } catch {
      /* ignore */
    }
    challenges.delete(id)
  }
}

// Periodically reap stale challenges so we don't leak Chromium processes.
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    for (const [id, c] of challenges) {
      if (Date.now() - c.lastActivity > CHALLENGE_TTL_MS) void cleanupChallenge(id)
    }
  }, 60_000).unref?.()
}

async function humanType(page: Page, selector: string, text: string) {
  await page.click(selector)
  // Per-character delay simulates human typing cadence.
  await page.keyboard.type(text, { delay: 55 })
}

function sessionFromCookies(cookies: CookieShape[]): string | undefined {
  return cookies.find((c) => c.name === "sessionid" && c.value)?.value
}

function looksLike2fa(page: Page): Promise<boolean> {
  return page.evaluate(() =>
    /two-factor|2-step|two step|authentication required|enter the code|security code/i.test(
      document.body.innerText,
    ),
  )
}

/**
 * Step 1 — begin login. Resolves with cookies on success, or parks the browser
 * and returns a challengeId when 2FA is requested.
 */
export async function startLogin(username: string, password: string): Promise<StartResult> {
  const browser = await puppeteer.launch(launchOptions())
  const page = await browser.newPage()
  // Hide the `navigator.webdriver` flag.
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined })
  })
  await page.setViewport({ width: 1280, height: 800 })

  try {
    await page.goto("https://www.instagram.com/accounts/login/", {
      waitUntil: "networkidle2",
      timeout: 60000,
    })

    await page.waitForSelector('input:not([type="hidden"])', { timeout: 20000 })
    await humanType(page, 'input:not([type="hidden"]', username)
    await humanType(page, 'input[type="password"]', password)

    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button[aria-label="Log In"]')).find((b) =>
        /sign in|log in/i.test(b.textContent || ""),
      )
      if (btn) (btn as HTMLButtonElement).click()
    })

    const deadline = Date.now() + 60000
    while (Date.now() < deadline) {
      const cookies = (await page.cookies()) as CookieShape[]
      if (sessionFromCookies(cookies)) {
        await browser.close()
        return { status: "ok", sessionid: sessionFromCookies(cookies), cookies }
      }
      if (await looksLike2fa(page)) {
        const id = challengeId()
        challenges.set(id, {
          browser,
          page,
          username,
          createdAt: Date.now(),
          lastActivity: Date.now(),
        })
        // NOTE: browser intentionally left OPEN here.
        return {
          status: "2fa_required",
          challengeId: id,
          message: "Instagram is asking for your two-factor code.",
        }
      }
      await new Promise((r) => setTimeout(r, 1500))
    }

    await browser.close()
    return {
      status: "2fa_required",
      challengeId: undefined,
      message: "Login timed out before a session was established.",
    }
  } catch (err) {
    await browser.close().catch(() => { })
    throw err
  }
}

/**
 * Step 2 — resume a parked 2FA challenge with the user's 6-digit code.
 * Throws an Error whose message starts with "2FA_INVALID" if the code was
 * wrong and the caller should retry (browser stays parked).
 */
export async function submit2fa(challengeId: string, code: string): Promise<StartResult> {
  const c = getChallenge(challengeId)
  if (!c) {
    throw new Error("CHALLENGE_EXPIRED: The login session expired. Please sign in again.")
  }
  c.lastActivity = Date.now()

  const page = c.page
  // Find the OTP input (IG uses a few different selectors / shapes).
  const selector = await page.evaluate(() => {
    const candidates = Array.from(document.querySelectorAll("input"))
    const byName = candidates.find((i) =>
      /verification|otp|code|security/i.test(i.name || i.id || ""),
    )
    const byLen = candidates.find(
      (i) => (i as HTMLInputElement).maxLength >= 6 && (i as HTMLInputElement).maxLength <= 8,
    )
    const first = candidates[0]
    const el = (byName || byLen || first) as HTMLInputElement | undefined
    return el ? (el.getAttribute("name") || el.id || "input") : null
  })

  if (!selector) {
    await c.browser.close().catch(() => { })
    challenges.delete(challengeId)
    throw new Error("2FA_INVALID: Could not find the code input. Please sign in again.")
  }

  await humanType(page, `input[name="${selector}"], #${selector}, input`, code.trim())

  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find((b) =>
      /verify|confirm|continue|next/i.test(b.textContent || ""),
    )
    if (btn) (btn as HTMLButtonElement).click()
  })

  const deadline = Date.now() + 45000
  while (Date.now() < deadline) {
    const cookies = (await page.cookies()) as CookieShape[]
    if (sessionFromCookies(cookies)) {
      await c.browser.close()
      challenges.delete(challengeId)
      return { status: "ok", sessionid: sessionFromCookies(cookies), cookies }
    }
    if (await looksLike2fa(page)) {
      // Still on the 2FA screen — wrong code. Park again for retry.
      throw new Error("2FA_INVALID: That code was not accepted. Try again.")
    }
    await new Promise((r) => setTimeout(r, 1500))
  }

  await c.browser.close().catch(() => { })
  challenges.delete(challengeId)
  throw new Error("CHALLENGE_EXPIRED: Timed out waiting for verification. Please sign in again.")
}
