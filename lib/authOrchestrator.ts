import type { CookieShape, StartResult } from "@/lib/sessionHelper"
import { saveSession } from "@/lib/db"

/**
 * Shared step 3+4 of the login handshake, used by both the initial success
 * and the post-2FA success: dump the full cookie jar to SQLite, then forward
 * the sessionid to the FastAPI backend at :8000 (which uses instagrapi).
 *
 * The backend flow is intentionally UNCHANGED: it still only receives
 * { sessionid, user_id } and runs login_by_sessionid. We just pass it the
 * sessionid we extracted; the full jar stays local for future reuse.
 */
export async function finalizeSession(
  username: string,
  email: string,
  result: StartResult,
) {
  const sessionid = result.sessionid as string
  const cookies = result.cookies as CookieShape[] | undefined

  const sessionJson = JSON.stringify({
    sessionid,
    cookies,
    savedAt: new Date().toISOString(),
  })
  const saved = saveSession(username, email, sessionJson)

  let backend: any = null
  let backendStatus: number | null = null
  try {
    const r = await fetch("http://localhost:8000/api/auth/instagram/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionid, user_id: username }),
    })
    backendStatus = r.status
    backend = await r.json().catch(() => null)
    if (!r.ok) {
      return {
        ok: false as const,
        error: "Session saved locally, but backend pairing failed",
        backendStatus,
        backend,
        localSessionId: saved.id,
      }
    }
  } catch (err: any) {
    return {
      ok: false as const,
      error: "Session saved locally, but backend is unreachable",
      detail: err?.message,
      localSessionId: saved.id,
    }
  }

  return {
    ok: true as const,
    message: "Instagram account paired with Memora",
    localSessionId: saved.id,
    backend,
  }
}
