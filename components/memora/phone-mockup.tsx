import Image from "next/image"
import { Sparkles } from "lucide-react"

import { MockSearchBar } from "@/components/memora/mock-search-bar"

const results = [
  { src: "/posts/goa-beach.png", label: "Palolem Beach" },
  { src: "/posts/resort.png", label: "Cliffside villa" },
  { src: "/posts/cafe.png", label: "Beach cafe" },
  { src: "/posts/food.png", label: "Seafood spot" },
]

export function PhoneMockup() {
  return (
    <div className="relative w-[300px] rounded-[2.5rem] border border-border bg-card p-3 shadow-2xl">
      <div className="overflow-hidden rounded-[2rem] bg-background">
        {/* App header */}
        <div className="flex items-center gap-2 border-b border-border/60 px-5 py-4">
          <Image src="/memora-logo.svg" alt="" width={22} height={22} className="h-[22px] w-[22px]" />
          <span className="font-serif text-base font-semibold">Memora</span>
        </div>

        {/* Chat prompt */}
        <div className="space-y-4 px-4 py-5">
          <div className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-tr-md bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground">
            Plan my travel itinerary to Goa
          </div>

          <div className="flex items-start gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary">
              <Sparkles className="h-3.5 w-3.5 text-secondary-foreground" aria-hidden="true" />
            </div>
            <div className="w-fit max-w-[85%] rounded-2xl rounded-tl-md bg-muted px-4 py-2.5 text-sm leading-relaxed text-foreground">
              Here&apos;s a 3-day plan from posts you saved:
            </div>
          </div>

          {/* Result grid */}
          <div className="grid grid-cols-2 gap-2">
            {results.map((r) => (
              <div key={r.src} className="overflow-hidden rounded-xl border border-border/60">
                <div className="relative aspect-square">
                  <Image src={r.src || "/placeholder.svg"} alt={r.label} fill className="object-cover" sizes="140px" />
                </div>
                <p className="truncate bg-card px-2 py-1.5 text-[11px] text-muted-foreground">{r.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search bar */}
        <div className="border-t border-border/60 px-4 py-3">
          <MockSearchBar />
        </div>
      </div>
    </div>
  )
}
