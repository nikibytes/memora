# Memora — Design System

Brand and UI reference for **Memora**, an AI-powered PWA that lets users search their
Instagram saved collections in natural language and turns saved posts into plans and
ideas ("plan my travel itinerary to Goa").

This document is the single source of truth for the brand theme. It is based on the
tweakcn **"cute one"** theme and is implemented with Tailwind CSS v4 + shadcn/ui.
All tokens live in `app/globals.css`; fonts are wired in `app/layout.tsx`.

---

## 1. Brand Personality

| Trait | Expression in UI |
| --- | --- |
| Soft & friendly | Pastel lavender palette, generous `1.5rem` corner radius |
| Intelligent | Elegant serif display type paired with a clean sans body |
| Calm & focused | Low-contrast neutrals, subtle diffused shadows, lots of whitespace |
| Memorable | Violet petal logo mark, consistent single accent hue |

Keep the interface airy and unintimidating. Violet is the signature — use it with
intent (primary actions, highlights), never as wallpaper.

---

## 2. Logo

- **Asset:** `public/memora-logo.svg` — a violet multi-petal "bloom" mark.
- Also used as the favicon and Apple touch icon (see `app/layout.tsx` metadata).
- **Clear space:** keep padding of at least the height of one petal around the mark.
- **On light backgrounds:** use as-is on `--background` / `--card`.
- **On dark backgrounds:** the mark's violet reads well on the dark `--background`.
- **Don't:** recolor the mark outside the violet family, add drop shadows, or stretch it.

---

## 3. Color Palette

Colors are defined in **OKLCH** and exposed as CSS variables + Tailwind tokens.
Always reference the **semantic token** (`bg-primary`, `text-muted-foreground`, …).
**Never** hardcode `bg-white`, `text-black`, or raw hex/oklch in components.

### Signature hue
The brand accent is **violet** (`--primary`). Charts step through a violet ramp
(`--chart-1` → `--chart-5`) from light to deep.

### Light mode (`:root`)

| Token | Value (OKLCH) | Role |
| --- | --- | --- |
| `--background` | `0.9689 0.009 314.78` | App background (soft lilac white) |
| `--foreground` | `0.3729 0.0306 259.73` | Primary text (slate) |
| `--card` / `--card-foreground` | `0.969 0.016 293.76` / `0.3729 0.0306 259.73` | Card surface / text |
| `--popover` / `--popover-foreground` | `1 0 0` / `0.3729 0.0306 259.73` | Popover surface / text |
| `--primary` / `--primary-foreground` | `0.709 0.1592 293.54` / `1 0 0` | Violet actions / on-violet text |
| `--secondary` / `--secondary-foreground` | `0.9073 0.053 306.09` / `0.4461 0.0263 256.80` | Soft violet fill / text |
| `--muted` / `--muted-foreground` | `0.9464 0.0327 307.17` / `0.551 0.0234 264.36` | Muted surface / subtle text |
| `--accent` / `--accent-foreground` | `0.9376 0.026 321.94` / `0.3729 0.0306 259.73` | Accent surface / text |
| `--destructive` / `--destructive-foreground` | `0.8077 0.1035 19.57` / `1 0 0` | Errors / on-error text |
| `--border` | `0.9073 0.053 306.09` | Borders / dividers |
| `--input` | `0.9073 0.053 306.09` | Input borders |
| `--ring` | `0.709 0.1592 293.54` | Focus ring (violet) |

### Dark mode (`.dark`)

| Token | Value (OKLCH) | Role |
| --- | --- | --- |
| `--background` | `0.2161 0.0061 56.04` | App background (warm near-black) |
| `--foreground` | `0.9299 0.0334 272.79` | Primary text (soft lavender white) |
| `--card` / `--card-foreground` | `0.2805 0.0309 307.23` / `0.9299 0.0334 272.79` | Card surface / text |
| `--popover` / `--popover-foreground` | `0.2805 0.0309 307.23` / `0.9299 0.0334 272.79` | Popover surface / text |
| `--primary` / `--primary-foreground` | `0.7874 0.1179 295.75` / `0.2161 0.0061 56.04` | Violet actions / on-violet text |
| `--secondary` / `--secondary-foreground` | `0.3416 0.0444 308.85` / `0.8717 0.0093 258.34` | Soft violet fill / text |
| `--muted` / `--muted-foreground` | `0.2283 0.0375 302.90` / `0.7137 0.0192 261.32` | Muted surface / subtle text |
| `--accent` / `--accent-foreground` | `0.3858 0.0509 304.64` / `0.8717 0.0093 258.34` | Accent surface / text |
| `--destructive` / `--destructive-foreground` | `0.8077 0.1035 19.57` / `0.2161 0.0061 56.04` | Errors / on-error text |
| `--border` / `--input` | `0.3416 0.0444 308.85` | Borders / input borders |
| `--ring` | `0.7874 0.1179 295.75` | Focus ring (violet) |

### Chart ramp (violet scale)

| Token | Light | Dark |
| --- | --- | --- |
| `--chart-1` | `0.709 0.1592 293.54` | `0.7874 0.1179 295.75` |
| `--chart-2` | `0.6056 0.2189 292.72` | `0.709 0.1592 293.54` |
| `--chart-3` | `0.5413 0.2466 293.01` | `0.6056 0.2189 292.72` |
| `--chart-4` | `0.4907 0.2412 292.58` | `0.5413 0.2466 293.01` |
| `--chart-5` | `0.432 0.2106 292.76` | `0.4907 0.2412 292.58` |

> Sidebar tokens (`--sidebar*`) mirror the same violet system for any nav/sidebar UI.

### Usage rules
- Total palette on any screen: **violet accent + neutrals + at most one extra accent**.
- Every background override **must** ship a matching foreground override for contrast.
- No gradients unless explicitly requested; if used, stay within the violet family.
- Never use purple/violet as a full-bleed background — it's an accent, not a base.

---

## 4. Typography

Three families, wired via `next/font/google` in `app/layout.tsx` and mapped to Tailwind
utilities in `app/globals.css` (`@theme`).

| Role | Family | Tailwind class | CSS var |
| --- | --- | --- | --- |
| Body / UI (default) | **Open Sans** | `font-sans` | `--font-sans` |
| Display / headings | **Source Serif 4** | `font-serif` | `--font-serif` |
| Code / mono | **IBM Plex Mono** | `font-mono` | `--font-mono` |

### Guidelines
- **Headings** use `font-serif` for an editorial, memorable feel (hero, section titles).
- **Body, labels, buttons, inputs** use `font-sans` (the default on `<body>`).
- **Mono** is reserved for code snippets, example prompts, or metadata.
- Body line-height: `leading-relaxed` / `leading-6` (1.4–1.6). Never below 14px.
- Balance long headings with `text-balance`; balance paragraphs with `text-pretty`.
- Letter-spacing is driven by `--tracking-normal` (`0em`) with the `tracking-*` scale
  available (`tracking-tight` … `tracking-widest`).

### Type scale (suggested, mobile-first)

| Element | Classes |
| --- | --- |
| Hero title | `font-serif text-4xl md:text-6xl font-semibold text-balance` |
| Section title | `font-serif text-2xl md:text-4xl font-semibold text-balance` |
| Card title | `font-serif text-xl font-medium` |
| Body | `font-sans text-base leading-relaxed text-muted-foreground` |
| Label / meta | `font-sans text-sm` |
| Code / prompt | `font-mono text-sm` |

---

## 5. Radius, Shadows & Spacing

### Corner radius
Base radius is **`--radius: 1.5rem`** (soft, rounded — core to the brand).

| Tailwind | Value |
| --- | --- |
| `rounded-sm` | `radius - 4px` |
| `rounded-md` | `radius - 2px` |
| `rounded-lg` | `radius` (1.5rem) |
| `rounded-xl` | `radius + 4px` |

Cards, buttons, inputs, and modals should feel pill-soft. Prefer `rounded-lg`/`rounded-xl`
for surfaces; `rounded-full` for avatars and icon buttons.

### Shadows
Soft, diffused, low-opacity (subtle depth, never harsh). Offset `0 8px`, blur `16px`.

| Token | Use |
| --- | --- |
| `shadow-2xs` / `shadow-xs` | Hairline lift (subtle inputs) |
| `shadow-sm` / `shadow` | Cards, default surfaces |
| `shadow-md` / `shadow-lg` | Raised cards, popovers |
| `shadow-xl` / `shadow-2xl` | Modals, floating CTAs, phone mockup |

### Spacing
- Base spacing unit `--spacing: 0.25rem` (Tailwind default scale).
- Use the spacing scale (`p-4`, `gap-6`, `py-8`), **not** arbitrary values.
- Use **gap** utilities for spacing between flex/grid children — never `space-*`,
  and never mix `margin`/`padding` with `gap` on the same element.

---

## 6. Layout Principles

- **Mobile-first**, then enhance with `md:` / `lg:` prefixes. The PWA's primary surface
  is a phone — verify every screen at mobile portrait first.
- **Flexbox** for the vast majority of layouts; **CSS Grid** only for true 2D layouts.
- Avoid floats and absolute positioning unless genuinely necessary.
- Generous whitespace and clear vertical rhythm between sections (e.g. `py-16 md:py-24`).
- Sticky, blurred header (`backdrop-blur`) over `--background`.

---

## 7. Components (shadcn/ui)

All primitives come from shadcn/ui and inherit the tokens above automatically.

| Component | Notes |
| --- | --- |
| **Button** | `default` = violet primary; `secondary`/`ghost`/`outline` for lower emphasis. Rounded, soft shadow. |
| **Card** | Primary surface: `bg-card` + `text-card-foreground`, `rounded-xl`, `shadow-sm`. |
| **Input / Label** | `bg-input` border, violet focus `--ring`. Always pair inputs with a `<Label>`. |
| **Badge** | Use for tags/collections; secondary/accent fills. |
| **Tabs / Switch / Avatar / Separator** | Themed via tokens; avatars `rounded-full`. |

When a new primitive is needed, add it via the shadcn CLI so it picks up the theme.

---

## 8. Iconography & Imagery

- **Icons:** use `lucide-react` at 16 / 20 / 24px. Never use emojis as icons.
- **No decorative blobs or hand-drawn SVG illustrations** as filler.
- **Photography:** warm, aesthetic, Instagram-style imagery (travel, food, places) to
  reflect the product's source content. Generated post images live in `public/posts/`.
- Always provide meaningful `alt` text (or mark decorative images appropriately).

---

## 9. Accessibility

- Maintain WCAG AA contrast — always override foreground when overriding background.
- Use semantic HTML (`<header>`, `<main>`, `<nav>`, `<section>`) and correct ARIA roles.
- Visible focus states everywhere via the violet `--ring`.
- Screen-reader-only text with the `sr-only` utility where visual context is implicit.
- Respect `prefers-color-scheme`; both light and dark are first-class.

---

## 10. PWA & Metadata

- `app/layout.tsx` sets title, description, `manifest`, and `appleWebApp` metadata.
- `public/manifest.webmanifest` defines name, icons, and theme colors.
- Theme color: light `#f5eff9`, dark `#191818` (matches `--background` per scheme).
- Logo (`/memora-logo.svg`) serves as icon, favicon, and apple-touch-icon.

---

## 11. Quick Reference — Do / Don't

**Do**
- Use semantic tokens (`bg-primary`, `text-muted-foreground`, `border-border`).
- Lead with `font-serif` headings + `font-sans` body.
- Keep corners soft (`rounded-lg`/`xl`) and shadows subtle.
- Design mobile-first and verify on a phone viewport.

**Don't**
- Hardcode colors (`bg-white`, `#7c3aed`) or add unapproved hues.
- Use violet as a full background or introduce gradients unprompted.
- Use emojis as icons or hand-draw decorative SVGs.
- Mix `gap` with `margin`/`padding` on the same element, or use `space-*`.
