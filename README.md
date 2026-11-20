# Larkmoor Family Dentistry (demo site)

A fictional dental practice website for Superflow demos. The full spec is in [`demo-site.md`](demo-site.md).

Larkmoor Family Dentistry is a fictional practice used for product demos. No real people, patients, phone numbers or bookings.

## Run it

```bash
pnpm install
pnpm build
pnpm start
```

## Check it

```bash
pnpm build && pnpm check:baseline
```

`check:baseline` reads the built HTML and checks the clean baseline from the spec: one H1 and ordered headings, titles and descriptions, alt text, `tel:` and `mailto:` links, JSON-LD, sitemap, robots and `llms.txt`. It also checks every phone, address, hour and price against `tests/reference-facts.json`. Only the check reads that file. The site never does.

## Where things are

| Path | What |
|---|---|
| `content/` | Every page's words, links and images. See `docs/content-guide.md`. |
| `public/media/` | Every image. Sources in `docs/media-credits.md`. |
| `src/` | The frame: layout, header, footer, and the one route that renders content. |
| `scripts/` | Checks and tools. |
| `tests/reference-facts.json` | The facts the baseline check compares against. |

## Rules

- Content uses only the class list in `docs/content-guide.md`. Tailwind does not scan `content/`, so a content edit never changes the CSS.
- Each content file keeps its own copy of the phones, hours and prices it shows. That is on purpose (spec F2).
- Never force push. Queue changes and live scenarios touch only `content/` and `public/media/`.
