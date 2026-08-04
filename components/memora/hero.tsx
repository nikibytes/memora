import Image from "next/image"
import { Search, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PhoneMockup } from "@/components/memora/phone-mockup"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:py-24 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 font-mono text-xs uppercase tracking-wider text-secondary-foreground">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            AI-powered memory
          </span>

          <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-balance md:text-6xl">
            Every post you saved, finally searchable.
          </h1>

          <p className="max-w-md text-lg leading-relaxed text-muted-foreground text-pretty">
            Memora turns your Instagram collections into a personal knowledge base. Search saved posts in plain
            language, and let AI plan trips, meals, and ideas from what you already loved.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="gap-2">
              Get the app
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2 bg-transparent">
              <Search className="h-4 w-4" aria-hidden="true" />
              See how it works
            </Button>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Image src="/memora-logo.svg" alt="" width={20} height={20} className="h-5 w-5" />
            <p className="text-sm text-muted-foreground">
              Connects to your Instagram saved collections in seconds.
            </p>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <PhoneMockup />
        </div>
      </div>
    </section>
  )
}
