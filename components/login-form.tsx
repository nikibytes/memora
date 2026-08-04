"use client"

import type React from "react"

import { useState } from "react"
// import { MotionButton } from "@/components/motion/motion-button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

type Status = "idle" | "loading" | "verifying" | "done" | "error"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState("")

  // 2FA modal state
  const [challengeId, setChallengeId] = useState<string | null>(null)
  const [code, setCode] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("loading")
    setMessage("")
    try {
      const res = await fetch("/api/auth/instagram/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        setMessage("Instagram paired with Memora. You're signed in.")
        setStatus("done")
        return
      }
      if (res.status === 428 && data.code === "2FA_REQUIRED") {
        setChallengeId(data.challengeId ?? null)
        setMessage(data.error || "Enter the 6-digit code from your authenticator app.")
        setStatus("idle")
        return
      }
      setMessage(data.error || "Sign-in failed. Please try again.")
      setStatus("error")
    } catch (err: any) {
      setMessage(err?.message || "Network error. Is the dev server running?")
      setStatus("error")
    }
  }

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!challengeId) return
    setStatus("verifying")
    setMessage("")
    try {
      const res = await fetch("/api/auth/instagram/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, challengeId, code }),
      })
      const data = await res.json()
      if (res.ok) {
        setChallengeId(null)
        setCode("")
        setMessage("Instagram paired with Memora. You're signed in.")
        setStatus("done")
        return
      }
      if (res.status === 401 && data.code === "2FA_INVALID") {
        setMessage(data.error || "That code was not accepted. Try again.")
        setStatus("idle")
        return
      }
      if (res.status === 410 && data.code === "CHALLENGE_EXPIRED") {
        setChallengeId(null)
        setMessage(data.error || "Session expired. Please sign in again.")
        setStatus("error")
        return
      }
      setMessage(data.error || "Verification failed. Please sign in again.")
      setChallengeId(null)
      setStatus("error")
    } catch (err: any) {
      setMessage(err?.message || "Network error during verification.")
      setStatus("error")
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-2 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <HeartIcon className="h-6 w-6" aria-hidden="true" />
        </div>
        <CardTitle className="font-serif text-2xl text-balance">Welcome back</CardTitle>
        <CardDescription className="text-pretty">Sign in to your account to continue where you left off.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="username">Instagram username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="your_instagram_handle"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Your Instagram password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <p className="text-center text-xs text-muted-foreground" role="note">
            Memora never stores your Instagram password. Login is a one-time, automated browser step using your session cookie — which Memora also does not retain.
          </p>

          <Button type="submit" className="mt-1 w-full"  disabled={status === "loading"}>
            {status === "loading" ? "Pairing…" : "Sign in"}
          </Button>

          {status === "done" && (
            <p className="text-center text-sm text-green-600" role="status">{message}</p>
          )}
          {status === "error" && (
            <p className="text-center text-sm text-red-600" role="alert">{message}</p>
          )}

          {challengeId && (
            <form onSubmit={handleVerify} className="mt-4 flex flex-col gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4">
              <Label htmlFor="tfa" className="text-sm font-medium text-amber-900">
                Two-factor authentication
              </Label>
              <p className="text-xs text-amber-800">{message}</p>
              <Input
                id="tfa"
                name="code"
                inputMode="numeric"
                maxLength={8}
                placeholder="123456"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                className="tracking-[0.3em] text-center"
                required
              />
              <Button type="submit" variant="default" className="w-full"  disabled={status === "verifying"}>
                {status === "verifying" ? "Verifying…" : "Verify"}
              </Button>
            </form>
          )}
        </form>

        <div className="my-6 flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>

        <Button variant="outline" className="w-full bg-transparent" type="button">
          <GoogleIcon className="mr-2 h-4 w-4" aria-hidden="true" />
          Continue with Google
        </Button>
      </CardContent>

      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          {"Don't have an account? "}
          <a href="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
            Sign up
          </a>
        </p>
      </CardFooter>
    </Card>
  )
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21s-6.716-4.297-9.428-8.02C.86 10.42 1.29 7.06 3.76 5.64a5.1 5.1 0 0 1 6.24.98L12 8.62l1.999-2A5.1 5.1 0 0 1 20.24 5.64c2.47 1.42 2.9 4.78 1.188 7.34C18.716 16.703 12 21 12 21z" />
    </svg>
  )
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  )
}
