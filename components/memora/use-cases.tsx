import Image from "next/image"
import { Sparkles } from "lucide-react"

const useCases = [
  {
    prompt: "Plan my travel itinerary to Goa",
    result: "A 3-day plan built from saved beaches, cafes, and stays.",
    image: "/posts/goa-beach.png",
  },
  {
    prompt: "Where did I save that seafood spot?",
    result: "Finds the exact restaurant post from six months ago.",
    image: "/posts/food.png",
  },
  {
    prompt: "Suggest a weekend of cozy cafes",
    result: "Curates a route from every cafe you bookmarked.",
    image: "/posts/cafe.png",
  },
]

export function UseCases() {
  return (
    <section id="use-cases" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-serif text-3xl font-semibold tracking-tight text-balance md:text-4xl">
          Ask the way you think
        </h2>
        <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
          No folders to dig through. Just ask, and Memora does the remembering for you.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {useCases.map((item) => (
          <div
            key={item.prompt}
            className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.prompt}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 33vw, 100vw"
              />
            </div>
            <div className="flex flex-col gap-3 p-5">
              <div className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <p className="font-medium leading-snug">{item.prompt}</p>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.result}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
