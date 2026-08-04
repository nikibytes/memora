import { NextRequest, NextResponse } from "next/server"
import { startLogin } from "@/lib/sessionHelper"
import { finalizeSession } from "@/lib/authOrchestrator"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * POST /api/auth/instagram/session
 * Body: { username, email, password }
 *
 * Step 1 of the handshake. Runs automated Puppeteer login with a PERSISTENT
 * Chromium profile. On success it forwards to backend. If Instagram requests
 * 2FA it returns 428 with a `challengeId` (browser kept alive) — the client
 * then calls /verify-2fa with the 6-digit code.
 */
export async function POST(req: NextRequest) {
  let body: { username?: string; email?: string; password?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 })
  }

  const { username, email, password } = body
  if (!username || !email || !password) {
    return NextResponse.json(
      { ok: false, error: "username, email and password are required" },
      { status: 400 },
    )
  }

  try {
    const res = await startLogin(username, password)

    if (res.status === "ok") {
      const final = await finalizeSession(username, email, res)
      if (!final.ok) return NextResponse.json(final, { status: 502 })
      return NextResponse.json(final)
    }

    // 2FA requested — park and ask the client for the code.
    return NextResponse.json(
      {
        ok: false,
        code: "2FA_REQUIRED",
        challengeId: res.challengeId,
        error: res.message || "Two-factor authentication required.",
      },
      { status: 428 },
    )
  } catch (err: any) {
    const message = err?.message || "Instagram login failed"
    return NextResponse.json(
      { ok: false, error: message, code: "LOGIN_FAILED" },
      { status: 502 },
    )
  }
}
