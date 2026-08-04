import { NextRequest, NextResponse } from "next/server"
import { submit2fa, getChallenge } from "@/lib/sessionHelper"
import { finalizeSession } from "@/lib/authOrchestrator"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * POST /api/auth/instagram/verify-2fa
 * Body: { username, email, challengeId, code }
 *
 * Step 2 of the handshake. Resumes the parked Chromium browser from the
 * challenge store, enters the 6-digit code, and on success forwards to the
 * backend. A wrong code returns 401 with code 2FA_INVALID (client retries).
 */
export async function POST(req: NextRequest) {
  let body: { username?: string; email?: string; challengeId?: string; code?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 })
  }

  const { username, email, challengeId, code } = body
  if (!username || !email || !challengeId || !code) {
    return NextResponse.json(
      { ok: false, error: "username, email, challengeId and code are required" },
      { status: 400 },
    )
  }

  if (!getChallenge(challengeId)) {
    return NextResponse.json(
      { ok: false, code: "CHALLENGE_EXPIRED", error: "Login session expired. Please sign in again." },
      { status: 410 },
    )
  }

  try {
    const res = await submit2fa(challengeId, code)
    if (res.status !== "ok") {
      return NextResponse.json(
        { ok: false, code: "2FA_REQUIRED", challengeId, error: "Two-factor still required." },
        { status: 428 },
      )
    }
    const final = await finalizeSession(username, email, res)
    if (!final.ok) return NextResponse.json(final, { status: 502 })
    return NextResponse.json(final)
  } catch (err: any) {
    const message = err?.message || "Verification failed"
    if (message.startsWith("2FA_INVALID")) {
      return NextResponse.json(
        { ok: false, code: "2FA_INVALID", challengeId, error: "That code was not accepted. Try again." },
        { status: 401 },
      )
    }
    if (message.startsWith("CHALLENGE_EXPIRED")) {
      return NextResponse.json(
        { ok: false, code: "CHALLENGE_EXPIRED", error: message },
        { status: 410 },
      )
    }
    return NextResponse.json({ ok: false, code: "LOGIN_FAILED", error: message }, { status: 502 })
  }
}
