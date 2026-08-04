import { NextResponse } from "next/server"
import { getChallenge } from "@/lib/sessionHelper"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * GET /api/auth/instagram/status?challengeId=...
 * Lets the client confirm a 2FA challenge is still alive before prompting for
 * the code. 200 = alive, 410 = expired/unknown.
 */
export async function GET(req: NextRequest) {
  const challengeId = req.nextUrl.searchParams.get("challengeId")
  if (!challengeId) {
    return NextResponse.json({ ok: false, error: "challengeId required" }, { status: 400 })
  }
  const alive = !!getChallenge(challengeId)
  return NextResponse.json(
    { ok: true, alive },
    { status: alive ? 200 : 410 },
  )
}
