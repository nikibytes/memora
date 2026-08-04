"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
// import { MotionButton } from "@/components/motion/motion-button"

const links = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Use cases", href: "#use-cases" },
]

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2" aria-label="Memora home">
          <Image src="/memora-logo.svg" alt="" width={32} height={32} className="h-8 w-8" />
          <span className="font-serif text-xl font-semibold tracking-tight">Memora</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="hidden sm:inline-flex"
            onClick={() => {
              window.location.href = "/login"
            }}
          >
            Log in
          </Button>
          <Button
            onClick={() => {
              window.location.href = "/signup"
            }}
          >
            Get the app
          </Button>
        </div>
      </nav>
    </header>
  )
}
