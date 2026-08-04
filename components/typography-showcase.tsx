const fonts = [
  { label: "Serif — Source Serif 4", className: "font-serif", sample: "Cute headings that feel warm" },
  { label: "Sans — Open Sans", className: "font-sans", sample: "Readable body copy for interfaces" },
  { label: "Mono — IBM Plex Mono", className: "font-mono", sample: "const theme = 'cute one'" },
]

export function TypographyShowcase() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">Typography</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Three font families make up the type system.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {fonts.map((f) => (
          <div
            key={f.label}
            className="flex flex-col gap-2 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm"
          >
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {f.label}
            </span>
            <p className={`text-2xl ${f.className}`}>{f.sample}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
