import { Search, Sparkles, FolderHeart, Wand2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Search,
    title: "Natural language search",
    description:
      "Ask “that rooftop bar in Bandra” or “minimalist desk setups” and Memora finds the exact saved posts instantly.",
  },
  {
    icon: Sparkles,
    title: "AI idea suggestions",
    description:
      "Ask Memora to plan a Goa itinerary or a dinner menu, and it builds one from the posts you already saved.",
  },
  {
    icon: FolderHeart,
    title: "Understands your collections",
    description:
      "Memora reads captions, places, and visuals across every Instagram collection so nothing gets lost.",
  },
  {
    icon: Wand2,
    title: "Turns saves into action",
    description:
      "Go from a folder of inspiration to a real plan, list, or route in a single question.",
  },
]

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-serif text-3xl font-semibold tracking-tight text-balance md:text-4xl">
          Your saved posts, actually useful
        </h2>
        <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
          You save hundreds of posts and never find them again. Memora makes every save instantly searchable and
          genuinely helpful.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <Card key={feature.title} className="border-border/60 shadow-sm">
            <CardHeader>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary">
                <feature.icon className="h-5 w-5 text-secondary-foreground" aria-hidden="true" />
              </div>
              <CardTitle className="mt-3 text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
