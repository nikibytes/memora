const steps = [
  {
    step: "01",
    title: "Connect Instagram",
    description: "Securely link your account and let Memora index your saved collections.",
  },
  {
    step: "02",
    title: "Ask anything",
    description: "Search in plain language or ask for ideas, plans, and recommendations.",
  },
  {
    step: "03",
    title: "Get a real answer",
    description: "Memora pulls the right saved posts and turns them into something you can use.",
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="border-y border-border/60 bg-card/40">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            From saved to sorted in three steps
          </h2>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((item) => (
            <div key={item.step} className="flex flex-col gap-3">
              <span className="font-mono text-sm font-medium text-primary">{item.step}</span>
              <div className="h-px w-full bg-border" />
              <h3 className="font-serif text-xl font-semibold">{item.title}</h3>
              <p className="leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
