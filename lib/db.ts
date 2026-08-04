import { DatabaseSync } from "node:sqlite"
import path from "node:path"
import fs from "node:fs"

/**
 * Local SQLite store (Node >= 22.5 built-in `node:sqlite`).
 * Persists the Instagram session handshake: username, email and the FULL
 * cookie jar (JSON), not just the sessionid. Storing the whole jar lets the
 * backend reuse the session via instagrapi so we rarely need to re-login.
 * The session cookie is NOT retained by Memora's own runtime after this dump.
 */

const DB_PATH = path.join(process.cwd(), "data", "memora.db")

let _db: DatabaseSync | null = null

function getDb(): DatabaseSync {
  if (_db) return _db
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })
  const db = new DatabaseSync(DB_PATH)
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL,
      session_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `)
  _db = db
  return db
}

export interface SavedSession {
  id: number
  username: string
  email: string
  sessionJson: string
  createdAt: string
}

export function saveSession(
  username: string,
  email: string,
  sessionJson: string,
): SavedSession {
  const db = getDb()
  const stmt = db.prepare(
    `INSERT INTO sessions (username, email, session_json) VALUES (?, ?, ?)`,
  )
  const info = stmt.run(username, email, sessionJson)
  const row = db
    .prepare(`SELECT * FROM sessions WHERE id = ?`)
    .get(info.lastInsertRowid as number) as any
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    sessionJson: row.session_json,
    createdAt: row.created_at,
  }
}

export function listSessions(): SavedSession[] {
  const db = getDb()
  const rows = db.prepare(`SELECT * FROM sessions ORDER BY id DESC`).all() as any[]
  return rows.map((r) => ({
    id: r.id,
    username: r.username,
    email: r.email,
    sessionJson: r.session_json,
    createdAt: r.created_at,
  }))
}
