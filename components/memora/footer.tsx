import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <div className="flex items-center gap-2">
          <Image src="/memora-logo.svg" alt="" width={24} height={24} className="h-6 w-6" />
          <span className="font-serif text-lg font-semibold">Memora</span>
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Memora. Search what you saved.
        </p>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#" className="transition-colors hover:text-foreground">
            Privacy
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            Terms
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  )
}
