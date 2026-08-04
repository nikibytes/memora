import { Nav } from "@/components/memora/nav"
import { Hero } from "@/components/memora/hero"
import { Features } from "@/components/memora/features"
import { HowItWorks } from "@/components/memora/how-it-works"
import { UseCases } from "@/components/memora/use-cases"
import { CTA } from "@/components/memora/cta"
import { Footer } from "@/components/memora/footer"

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Features />
      <HowItWorks />
      <UseCases />
      <CTA />
      <Footer />
    </main>
  )
}
