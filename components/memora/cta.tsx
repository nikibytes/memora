import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-primary px-8 py-16 text-center text-primary-foreground md:py-20">
        <Image
          src="/memora-logo.svg"
          alt=""
          width={72}
          height={72}
          className="mx-auto h-16 w-16 opacity-90"
        />
        <h2 className="mx-auto mt-6 max-w-2xl font-serif text-3xl font-semibold tracking-tight text-balance md:text-4xl">
          Remember everything you saved. Effortlessly.
        </h2>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-primary-foreground/80 text-pretty">
          Install Memora and turn your Instagram collections into your smartest personal assistant.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" variant="secondary" className="gap-2">
            Get the app
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            Learn more
          </Button>
        </div>
      </div>
    </section>
  )
}
