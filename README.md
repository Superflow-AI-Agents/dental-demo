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

## Demo changes

To make Site Care react on a call, run the **Demo change** workflow. On GitHub open **Actions**, pick **Demo change**, click **Run workflow**, choose a type and run it. It commits one known change to `main`. Vercel deploys it to production, and Site Care checks the changed page a few minutes later. The run's summary says what changed, on which page, and which check should flag it.

| Type | What it does | Check that should flag it |
|---|---|---|
| `broken-link` | The "Book your first visit" button on `/new-patients` goes to `/book-online-now`, which does not exist. | Link Checker |
| `missing-alt-text` | The top photo on `/about` loses its alt text. | Accessibility Checker, Image Inspector |
| `low-contrast` | The intro sentence on `/insurance-and-financing` turns pale grey. | Accessibility Checker |
| `typo` | Three spelling mistakes in the intro paragraph on `/services`. | Proofreader |
| `content-update` | Adds a numbered "Practice update" line on the home page. The number goes up on every run. No issue in it, so the check finds nothing new. | None |
| `all-issues` | All four issues above in one commit. | All of the above |
| `reset` | Removes every demo change, so the site is clean again. | Earlier findings go away |

Run `reset` when the demo is over. Running a type that is already in place changes nothing and makes no commit. The same script runs locally with `pnpm demo:change <type>` (see `scripts/demo-change.ts`).

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
