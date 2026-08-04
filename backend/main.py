"""
Memora — Instagram session auth API (FastAPI)

Endpoint:
    POST /api/auth/instagram/session
        body: { "sessionid": "<ig sessionid cookie>", "user_id": "optional" }
        -> logs in via instagrapi using the sessionid cookie and dumps the
           authenticated client settings to a session JSON file.

Run:
    uvicorn main:app --reload --port 8000
"""

# from PIL import ImageColor
# from PIL import ImageColor
# from PIL import ImageColor
# from __future__ import annotations

from click import echo
# import json
# import os
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from instagrapi import Client
from instagrapi.exceptions import ClientError, ClientLoginRequired
from pydantic import BaseModel, Field
# import debugpy
import webbrowser

# Where authenticated session settings are persisted.
SESSIONS_DIR = Path(__file__).resolve().parent / "sessions"
SESSIONS_DIR.mkdir(exist_ok=True)

app = FastAPI(title="Memora Auth API", version="0.1.0")

# if os.getenv("ANTIGRAVITY_DEBUG") == "true":
#     debugpy.listen(("0.0.0.0", 5678))
#     print("⏳ Waiting for debugger to attach on port 5678...")
#     debugpy.wait_for_client()  # Pauses startup until you attach

# Allow the Next.js frontend (different port/origin) to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten to your Vercel/localhost origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class InstagramSessionRequest(BaseModel):
    sessionid: str = Field(..., min_length=1, description="Instagram 'sessionid' cookie value")
    user_id: Optional[str] = Field(
        None,
        description="Optional caller id. Session is saved as <user_id>.json; "
        "falls back to session.json when omitted.",
    )


class InstagramSessionResponse(BaseModel):
    ok: bool
    username: Optional[str] = None
    user_id: Optional[str] = None
    session_file: str
    message: str


@app.get("/")
def health() -> dict:
    return {"status": "ok", "service": "memora-auth-api"}


@app.post("/api/auth/instagram/session", response_model=InstagramSessionResponse)
def login_by_sessionid(payload: InstagramSessionRequest) -> InstagramSessionResponse:
    """Authenticate with Instagram via the sessionid cookie and persist the session."""
    #open instagram.com/login in a new browser window
    
    webbrowser.open("https://instagram.com/login")
    #when user logs in , retrieve the sessionid cookie from it
    import http.cookies
    cookie = http.cookies.SimpleCookie()
    cookie["sessionid"].value = payload.sessionid
    cl = Client()

    try:
        cl.login_by_sessionid(payload.sessionid)
    except (ClientLoginRequired, ClientError) as exc:
        # Bad / expired / revoked sessionid.
        raise HTTPException(status_code=401, detail=f"Instagram login failed: {exc}") from exc
    except Exception as exc:  # network / rate-limit / unexpected
        raise HTTPException(status_code=502, detail=f"Could not reach Instagram: {exc}") from exc

    # Persist authenticated client settings to a JSON file.
    filename = f"{payload.user_id}.json" if payload.user_id else "session.json"
    session_path = SESSIONS_DIR / filename
    cl.dump_settings(str(session_path))

    try:
        username = cl.user_short_info(cl.user_id).username
    except Exception:
        username = None

    return InstagramSessionResponse(
        ok=True,
        username=username,
        user_id=payload.user_id,
        session_file=str(session_path),
        message="Instagram session established and saved.",
    )


__all__ = ["app", "login_by_sessionid"]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
