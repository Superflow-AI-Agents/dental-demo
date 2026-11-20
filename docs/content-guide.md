# Content guide

How to write and edit files under `content/`. Queue changes and live scenarios follow the same rules.

## Where things live

| Folder | URL | Format |
|---|---|---|
| `content/pages/index.md` | `/` | Markdown |
| `content/pages/<path>.md` | `/<path>` (folders become URL segments) | Markdown |
| `content/services/<slug>.md` | `/services/<slug>` | Markdown |
| `content/team/<slug>.md` | `/team/<slug>` | Markdown |
| `content/blog/<slug>.md` | `/blog/<slug>` | Markdown |
| `content/locations/<slug>.json` | `/locations/<slug>` | JSON |
| `content/site.json` | header, nav, footer on every page | JSON |
| `public/media/` | `/media/...` | images |

A new file in one of these folders is a new page. It appears in `sitemap.xml` on its own.

## Front matter (Markdown files)

```yaml
title: "Full page title | Larkmoor Family Dentistry"   # used as-is for <title>, no template is added
description: "One or two sentences, under 160 characters."
jsonLd: none            # dentist (home only) | blogPosting (blog posts) | none
hub: services           # only on /services, /team and /blog: renders child cards after the body
card:                   # only on children of a hub: drives the card on the hub page
  heading: "Dental implants"
  summary: "One or two sentences."
  image: /media/services/dental-implants.jpg
  imageAlt: "Describe the photo."
  order: 6              # services and team only
role: "Dental hygienist"        # team only, shown on the card
credentials: "RDH"              # team only
date: "2026-09-14"              # blog only, ISO date, fixed string
author: dr-helen-whitfield      # blog only, a team slug
image: /media/blog/<slug>.jpg   # blog only, used for JSON-LD
imageAlt: "..."
```

Editing a `card` block changes the hub page too. A queue change may edit a `card` block only if the hub is in its "Pages touched".

## Body rules

- The body starts with the page's only H1 (`# ...`, or `<h1>` inside a hero block). Headings then go in order: H2, then H3. Never skip a level.
- Every image has real alt text, plus `width` and `height` attributes matching the file.
- Phone numbers are always links: `<a href="tel:+15035550142">(503) 555-0142</a>`. In Markdown: `[(503) 555-0142](tel:+15035550142)`.
- Emails are always `mailto:` links.
- Internal links are root-relative (`/services/fillings`), never a full URL.
- Each file carries its own copy of any phone, address, hour or price it shows. Copy them exactly from `tests/reference-facts.json`. That file is read only by the baseline check, never by the site.
- Child pages never list their siblings: no recent posts, no "other offices", no "rest of the team", no previous and next links. Linking to another page inside a sentence is fine.
- Hub pages (`/services`, `/team`, `/blog`) get their card grid from the children. Do not hand-write a list of children there. `/locations` is the exception: it is hand-written, with name, address and phone for each office and no hours.
- The header, nav and home page never list single posts, staff or offices.
- No em dashes. No real people, practices, insurers or product brands. Phones stay in 555-0100 to 555-0199.

## Class vocabulary

Tailwind does not scan `content/`, so utility classes in content do nothing. Use only these classes, plus inline `style` if you need a one-off.

| Class | Use |
|---|---|
| `hero`, `hero-copy`, `hero-media`, `hero-sub`, `hero-phone` | Two-column hero block at the top of a page |
| `eyebrow` | Small uppercase label above a heading |
| `lede` | Larger intro paragraph |
| `note` | Small grey print |
| `band`, `band-mint`, `band-dark` | Full-width tinted section (white, mint, deep teal) |
| `grid-2`, `grid-3` | Two or three equal columns |
| `card`, `card-link` | White rounded box, and its "learn more" link |
| `split` | Image and text side by side (two `<div>` children) |
| `stat-row`, `stat` | Row of figures (`<strong>` for the number, `<span>` for the label) |
| `check-list` | A `<ul>` with check bullets |
| `callout` | Highlighted note with a coral edge |
| `faq` | A `<details>` with a `<summary>` question |
| `compare` | Wrapper for a comparison table |
| `price` | Large price figure |
| `quote`, `quote-by`, `stars` | Patient review |
| `byline` | Author and date line under a blog post H1 |
| `portrait` | Staff headshot on a team page |
| `banner`, `banner-tag` | Promo strip |
| `btn`, `btn-secondary`, `btn-row` | Buttons, and a row of them |
| `form`, `field`, `field-wide` | Form layout (forms post to `/api/form`) |

Inside a block of raw HTML, leave a blank line before and after any Markdown you want parsed, or write the inner part as HTML.
