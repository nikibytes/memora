const swatches: { name: string; className: string; textClassName: string }[] = [
  { name: "background", className: "bg-background", textClassName: "text-foreground" },
  { name: "foreground", className: "bg-foreground", textClassName: "text-background" },
  { name: "card", className: "bg-card", textClassName: "text-card-foreground" },
  { name: "primary", className: "bg-primary", textClassName: "text-primary-foreground" },
  { name: "secondary", className: "bg-secondary", textClassName: "text-secondary-foreground" },
  { name: "muted", className: "bg-muted", textClassName: "text-muted-foreground" },
  { name: "accent", className: "bg-accent", textClassName: "text-accent-foreground" },
  { name: "destructive", className: "bg-destructive", textClassName: "text-destructive-foreground" },
]

const charts = ["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-chart-5"]

export function ColorPalette() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">Colors</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Semantic color tokens with their paired foreground colors.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {swatches.map((s) => (
          <div
            key={s.name}
            className={`flex h-28 flex-col justify-between rounded-xl border border-border p-4 shadow-sm ${s.className} ${s.textClassName}`}
          >
            <span className="font-mono text-xs opacity-70">--{s.name}</span>
            <span className="text-sm font-medium">{s.name}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-muted-foreground">chart palette</span>
        <div className="flex overflow-hidden rounded-xl border border-border shadow-sm">
          {charts.map((c) => (
            <div key={c} className={`h-14 flex-1 ${c}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
