"use client"

import { useEffect, useRef, useState } from "react"

type Props = {
  onSessionExtracted: (sessionid: string) => void
}

/**
 * Web-native Instagram session capture.
 *
 * Opens instagram.com/login in a hidden iframe; once the user logs in and the
 * URL moves off /accounts/login, we read the `sessionid` cookie from
 * document.cookie. No React Native dependencies — runs in the browser.
 */
export function InstagramLoginWebView({ onSessionExtracted }: Props) {
  const [open, setOpen] = useState(false)
  const extracted = useRef(false)

  useEffect(() => {
    if (!open || extracted.current) return

    const timer = setInterval(() => {
      const match = document.cookie.match(/(?:^|;\s*)sessionid=([^;]+)/)
      if (match && match[1]) {
        extracted.current = true
        clearInterval(timer)
        setOpen(false)
        onSessionExtracted(decodeURIComponent(match[1]))
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [open, onSessionExtracted])

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        Sign in with Instagram
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="h-[80vh] w-full max-w-md overflow-hidden rounded-2xl bg-white">
        <iframe
          src="https://www.instagram.com/accounts/login/"
          title="Instagram login"
          className="h-full w-full"
          // Allow cookies to be set on this origin so we can read sessionid.
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
        />
      </div>
    </div>
  )
}
