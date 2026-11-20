# Demo site: Larkmoor Family Dentistry

**Superflow · November 19, 2026 · Owner: Rakesh**
**Last updated:** Thursday, November 19, 2026 at 4:21 PM Pacific
**Spec page:** https://claude.ai/artifact/8xfTpBgvSBq1gkRPncU3NQ
**Visual canvas:** https://claude.ai/artifact/FZyjv5MfeDTPh1Mxr7nheT

A fake dental practice website that changes a little every weekday. It gives Superflow's existing features real data to show: Site care, version history, the agent report and comments.

Think of a TV set. The house looks lived in, but every prop was placed. This site looks like a real practice with a real agency behind it. Every change and every break is scripted.

Names, statuses and tool names follow `00-decisions.md`. This spec adds nothing to it.

---

# Part 1: Product context

## What it is

- A website for a made-up dental practice. 42 pages at launch, 50 pages after 8 weeks.
- One git repo, deployed on Vercel, tracked as one site in Superflow.
- A daily routine pushes one scripted change each weekday. Each push is a Vercel deploy. Each deploy reaches Superflow through the Vercel integration that already exists.
- The result: What changed, What broke and version history always hold fresh data from real runs.

## What it is not

- Not a new Superflow feature, agent, tool or endpoint. Nothing in Superflow changes.
- Not mocked data. Every version and every agent comment comes from a real run on a real site.
- Not a CMS demo. No Sanity. Content is files in the repo.
- Not the WordPress workflow. That is a later spec that can reuse this content.
- Not a lead audit target. Lead audits run on the prospect's own site.
- Not a real business. No real people, patients, phone numbers or bookings.

## Who it's for

| Person | What they need from it |
|---|---|
| Presenter | A site that always has recent changes and a known set of breaks. One command for a live change. One command to reset. |
| Prospect | A site that looks like their clients' sites, with the mistakes their team makes every week. |
| Engineering | A stable site to test the deploy trigger, the diff path and version history against known answers. |
| Agent quality loop | Seeded breaks with known answers. Each one is a golden case. |

## The experience in phases

| Phase | What happens | Who |
|---|---|---|
| 0. Build | Claude Code builds the site, the change queue and the scripts. | Claude Code |
| 1. Connect | Vercel project, Superflow site, Vercel integration, Site care on, toolbar installed, human comments seeded. | Rakesh, Claude Code |
| 2. Baseline | First full scan. The 6 pinned breaks should appear. Anything else the agents flag gets reviewed. | Rakesh |
| 3. Daily | Each weekday at about 7 am Pacific, one change is pushed. Vercel deploys. Superflow checks the changed pages. A new version appears. | Routine |
| 4. On a call | Show the history. Push a live change. Watch it land. Fix it with Claude Code through the Superflow MCP. | Presenter |
| 5. After a call | Reset the site to where the routine left it. | Presenter |
| 6. Refill | At change 35 a GitHub issue opens. Write the next 40 changes. | Rakesh, Claude Code |

## Features

| # | Feature | What it does | Why |
|---|---|---|---|
| F1 | The site | 42 pages growing to 50. Looks agency built. | The prospect must believe it. |
| F2 | Content as files | Every page's words, links and images are files under `content/`. | Every change is a commit. Every commit is a deploy. |
| F3 | Steady builds | The same content always builds the same HTML. | Superflow's diff compares page HTML. Noise would make What changed lie. |
| F4 | Break registry | One list of every seeded break with a machine check. | Tests know which breaks exist at any point, without Superflow. |
| F5 | Pinned breaks | 6 breaks the routine never fixes, one per default agent. | The report is never empty and every agent has something to show. |
| F6 | Change queue | 40 scripted changes: new pages, edits, breaks, fixes. | History reads like a real team's work. |
| F7 | `materialize(n)` | Builds the exact content for any point in the queue. | One function serves the routine, reset and tests. No merge conflicts. |
| F8 | Daily routine | A GitHub Action that pushes the next change each weekday. | Fresh timestamps with no one touching it. |
| F9 | Live scenarios | 5 staged changes for the live moment on a call. | A new version with breaks, on demand. |
| F10 | Reset | Puts the site back where the routine left it. | The next call starts from a known state. |
| F11 | Verify scripts | Tests for steady builds, breaks and live scenarios. | Catch a bad queue before it runs for 8 weeks. |
| F12 | Seeded human comments | 4 client comments pinned on the site. | Human feedback sits next to agent comments. |
| F13 | Runbook | One page for the presenter. | Anyone can run the demo. |

## Feature detail

### F1. The site

**Brand**
- Larkmoor Family Dentistry. A made-up practice in a made-up city: Larkmoor, Oregon.
- Three offices at launch: Northgate, Riverside, Old Mill. A fourth, Cedar Hollow, opens in week 5.
- Six staff at launch: four dentists, two hygienists. A fifth dentist joins in week 2.
- The presenter plays the agency that built and maintains the site.

**The 42 pages at launch**

| Section | Count | URLs |
|---|---|---|
| Core | 8 | `/`, `/about`, `/new-patients`, `/insurance-and-financing`, `/book`, `/contact`, `/reviews`, `/careers` |
| Services | 13 | `/services` plus `cleanings-and-exams`, `fillings`, `crowns-and-bridges`, `root-canals`, `extractions`, `dental-implants`, `dentures`, `teeth-whitening`, `veneers`, `clear-aligners`, `kids-dentistry`, `emergency-dentistry` |
| Locations | 4 | `/locations` plus `northgate`, `riverside`, `old-mill` |
| Team | 7 | `/team` plus `dr-helen-whitfield`, `dr-marcus-oyelaran`, `dr-priya-natarajan`, `dr-samuel-brandt`, `jenna-kowalski`, `luis-ortega` |
| Blog | 8 | `/blog` plus 7 posts |
| Legal | 2 | `/privacy`, `/accessibility` |
| **Total** | **42** | |

**The 8 pages the queue adds**
- 5 blog posts
- `/locations/cedar-hollow`
- `/team/dr-anika-rao`
- `/specials/new-year-whitening`

**Look and build**
- A current stable Next.js with the App Router, TypeScript and Tailwind. Every page is statically generated.
- Clean, modern, one accent color, real spacing. It should pass for a $15k agency build.
- Works at 390 px wide with no sideways scroll, except where a break says otherwise.
- Photos of offices and equipment come from Unsplash under its standard license, not Unsplash+. No people, no visible brand names. Sources are logged in `docs/media-credits.md`.
- Staff portraits are AI-made, not stock photos of real people.
- `sitemap.xml` lists every page. Every new page is also linked from its hub. That is how Superflow finds new pages.
- A real 404 page that returns status 404.
- The header, the navigation and the home page do not list single posts, staff or offices. A new post changes only the post and `/blog`.
- The footer lists each office's name and phone. No address, no hours.
- The `/locations` hub shows each office's name, address and phone. No hours. Hours live on the office's own page and on `/contact`.
- Child pages carry no lists of their siblings: no recent posts, no previous and next links, no "other offices", no "rest of the team". Otherwise one new page changes many.
- `/book` and `/contact` have working forms. They post to a stub that returns success and stores nothing.

**The clean baseline**

Apart from the pinned breaks, the site should give the default agents nothing to flag. So it ships with:
- One H1 per page, headings in order, a title and description on every page.
- `robots.txt` open to all crawlers, an `llms.txt`, and JSON-LD on the home page, location pages and blog posts. Blog posts name an author.
- Alt text on every image. Phone numbers as `tel:` links, emails as `mailto:` links. The logo links home.
- The same phone, address, hours and prices everywhere they appear.
- A small footer line: "Larkmoor Family Dentistry is a fictional practice used for product demos."
- `scripts/check-baseline.ts` checks all of this on the built HTML. It also checks every phone, address, hour and price against one reference list that only the test reads, so a typo never becomes a break nobody seeded.

### F2. Content as files

- `content/site.json`: practice name, navigation, footer.
- `content/pages/`, `content/services/`, `content/team/`, `content/blog/`: one Markdown file per page with front matter.
- `content/locations/`: one JSON file per office.
- `public/media/`: every image.
- Front matter holds the title, description and structured data switches.
- Page bodies are Markdown with inline HTML allowed. A change can then express a bad link, a plain-text phone number or an oversized banner without touching code.
- Headings, buttons, images and tables in a page come from its content file. Components only supply the frame: header, footer and layout.
- **Each page file carries its own copy of the phone numbers, hours and prices it shows.** This is on purpose. Real sites repeat facts by copy and paste, and that is how they drift. A single source of truth would make a consistency break impossible to stage.
- Queue changes and live scenarios touch only `content/` and `public/media/`. Never `src/`.

### F3. Steady builds

Superflow decides what changed by comparing page HTML. If every deploy reshuffles every page's HTML, every page looks changed on every deploy.

- All pages are static.
- `generateBuildId` returns a constant.
- Content is read on the server at build time. It never ships inside shared client bundles.
- No build timestamps, random ids or "last updated" stamps in the HTML.
- Vercel Skew Protection stays off. It can add a deployment id to asset URLs.
- Tailwind does not scan `content/`. Content uses a fixed set of classes plus inline styles, so a content change can never change the CSS.
- `pnpm verify:determinism` builds twice from the same commit and compares every HTML file byte for byte. Then it edits one page's content, builds again, and expects only that page and the pages that list it to differ.
- If Next.js cannot pass this after the guards above, switch to Astro and record why in the README.

### F4. Break registry

- `demo/breaks.json` holds one row per seeded break: id, agent, page, what is wrong, the change that adds it, the change that fixes it, and an assertion.
- The assertion is a machine check on the content or the built HTML: a string that must be present, a link target, an attribute value.
- Ids: `P1` to `P6` are pinned. `B01` to `B13` come from the queue. `L1a` to `L5c` come from live scenarios.
- After the baseline scan, record the real `rule_key` Superflow reports for each break in the registry.

### F5. Pinned breaks

Six breaks present from day one. The queue never fixes them. Each sits on a page a busy team could miss. The home page is clean at rest.

| Id | Agent | Page | The break |
|---|---|---|---|
| P1 | Link Checker | `/services/emergency-dentistry` | "Book an emergency visit" button goes to `/book-now`, a 404. |
| P2 | Proofreader | `/services/dentures` | One FAQ answer is leftover lorem ipsum. |
| P3 | Consistency Checker | `/locations/northgate`, `/new-patients` | Northgate's phone is (503) 555-0142 on its own page and (503) 555-0124 on New Patients. |
| P4 | Image Inspector | `/team/jenna-kowalski` | Headshot is cropped with the top of the head cut off. |
| P5 | Mobile Inspector | `/services/crowns-and-bridges` | The crown comparison table is wider than a phone screen and scrolls sideways. |
| P6 | AI Visibility | `/services/clear-aligners` | No meta description, and the title is just "Services". |

Rules:
- A change that edits a file holding a pinned break keeps that break byte for byte. `verify:breaks` enforces it.
- No queue change edits the six pages in the "Page" column except `/locations/northgate`, where the phone line stays untouched.

### F6. Change queue

**Shape**
- `demo/queue/NN-slug/change.json`: commit message, kind, pages touched, breaks added, breaks fixed.
- `demo/queue/NN-slug/files/`: full replacement files, laid out like the repo.
- `demo/queue/NN-slug/delete.txt`: files to remove, if any.
- Commit messages read like a small agency's: short, plain, no ticket numbers.

**The numbers**
- 40 changes.
- 8 add a page. 13 add a break. 10 fix a break. 14 are clean edits.
- 5 of the 8 new pages also carry a break, so 13 + 10 + 3 + 14 = 40.
- Open breaks start at 6, stay between 6 and 10, and end at 9: 6 pinned, plus 13 added, minus 10 fixed.
- Pages go from 42 to 50.

**Queue breaks**

| Id | Agent | The break | Added | Fixed |
|---|---|---|---|---|
| B01 | Consistency Checker | Saturday hours changed on the three location pages. `/contact` still shows the old hours. | 3 | 9 |
| B02 | Image Inspector | New home hero photo is stretched. | 4 | 6 |
| B03 | Proofreader | Dr. Rao's bio page ships with "Insert bio here". | 7 | 12 |
| B04 | Consistency Checker | Whitening drops from $349 to $299 on the whitening page. The home banner still says $349. | 8 | 14 |
| B05 | Link Checker | A blog post links to the emergency page on a staging URL. | 10 | 17 |
| B06 | Proofreader | Typo in the `/reviews` heading: "pateints". | 13 | 19 |
| B07 | Link Checker | "Apply now" on `/careers` does nothing when clicked. | 15 | 23 |
| B08 | Mobile Inspector | The promo page's coupon banner causes sideways scroll on phones. | 18 | 26 |
| B09 | Consistency Checker | Cedar Hollow is Suite 210 on its own page and Suite 120 on `/locations`. | 21 | 28 |
| B10 | Proofreader | Doubled word ("the the") on `/services/kids-dentistry`. | 24 | stays |
| B11 | Image Inspector | A photo in the Cedar Hollow post does not load. | 25 | 30 |
| B12 | Link Checker | Emergency numbers on the location pages are plain text, not tap-to-call. | 29 | stays |
| B13 | AI Visibility | New section on `/insurance-and-financing` uses bold text for headings and skips levels. | 34 | stays |

**The 40 changes**

| # | Commit message | Kind | Pages touched | Break | Open | Pages |
|---|---|---|---|---|---|---|
| 1 | Add holiday hours banner to home page | edit | `/` | | 6 | 42 |
| 2 | New post: use your dental benefits before year end | new page | post, `/blog` | | 6 | 43 |
| 3 | Update December hours at all three offices | edit | 3 location pages | adds B01 | 7 | 43 |
| 4 | Swap hero photo on home page | edit | `/` | adds B02 | 8 | 43 |
| 5 | Add two plans to accepted insurance list | edit | `/insurance-and-financing` | | 8 | 43 |
| 6 | Fix stretched hero photo | fix | `/` | fixes B02 | 7 | 43 |
| 7 | Add Dr. Anika Rao to the team | new page | `/team/dr-anika-rao`, `/team` | adds B03 | 8 | 44 |
| 8 | Whitening special: $299 through January | edit | `/services/teeth-whitening`, `/` | adds B04 | 9 | 44 |
| 9 | Match Saturday hours on contact page | fix | `/contact` | fixes B01 | 8 | 44 |
| 10 | New post: what to do when a tooth gets knocked out | new page | post, `/blog` | adds B05 | 9 | 45 |
| 11 | Christmas and New Year closures | edit | `/`, 3 location pages | | 9 | 45 |
| 12 | Finish Dr. Rao's bio | fix | `/team/dr-anika-rao` | fixes B03 | 8 | 45 |
| 13 | Add November patient reviews | edit | `/reviews` | adds B06 | 9 | 45 |
| 14 | Correct whitening price on home banner | fix | `/` | fixes B04 | 8 | 45 |
| 15 | Post front desk opening on careers page | edit | `/careers` | adds B07 | 9 | 45 |
| 16 | New post: are clear aligners right for you | new page | post, `/blog` | | 9 | 46 |
| 17 | Point knocked-out tooth post at the live emergency page | fix | post | fixes B05 | 8 | 46 |
| 18 | Launch New Year whitening promo page | new page | `/specials/new-year-whitening`, `/` | adds B08 | 9 | 47 |
| 19 | Fix typo in reviews heading | fix | `/reviews` | fixes B06 | 8 | 47 |
| 20 | Refresh services grid copy on home page | edit | `/` | | 8 | 47 |
| 21 | Announce fourth office: Cedar Hollow | new page | `/locations/cedar-hollow`, `/locations` | adds B09 | 9 | 48 |
| 22 | Add Cedar Hollow to footer and contact page | edit | every page, `/contact` | | 9 | 48 |
| 23 | Fix Apply button on careers page | fix | `/careers` | fixes B07 | 8 | 48 |
| 24 | Update age guidance on kids dentistry page | edit | `/services/kids-dentistry` | adds B10 | 9 | 48 |
| 25 | New post: meet the Cedar Hollow team | new page | post, `/blog` | adds B11 | 10 | 49 |
| 26 | Fix promo banner on phones | fix | `/specials/new-year-whitening` | fixes B08 | 9 | 49 |
| 27 | Update insurance FAQ for 2027 plans | edit | `/insurance-and-financing` | | 9 | 49 |
| 28 | Correct Cedar Hollow suite number | fix | `/locations` | fixes B09 | 8 | 49 |
| 29 | Add emergency line to every location page | edit | 4 location pages | adds B12 | 9 | 49 |
| 30 | Restore missing photo on Cedar Hollow post | fix | post | fixes B11 | 8 | 49 |
| 31 | New post: Children's Dental Health Month checklist | new page | post, `/blog` | | 8 | 50 |
| 32 | Rewrite intro on implants page | edit | `/services/dental-implants` | | 8 | 50 |
| 33 | Update benefits list on careers page | edit | `/careers` | | 8 | 50 |
| 34 | Add financing partner section | edit | `/insurance-and-financing` | adds B13 | 9 | 50 |
| 35 | Add a note from Dr. Whitfield to the about page | edit | `/about` | | 9 | 50 |
| 36 | Add January patient reviews | edit | `/reviews` | | 9 | 50 |
| 37 | Add before and after section to veneers page | edit | `/services/veneers` | | 9 | 50 |
| 38 | Add sedation options to root canal page | edit | `/services/root-canals` | | 9 | 50 |
| 39 | Extend whitening special through February | edit | `/services/teeth-whitening`, `/specials/new-year-whitening`, `/` | | 9 | 50 |
| 40 | Update Cedar Hollow opening hours | edit | `/locations/cedar-hollow`, `/contact` | | 9 | 50 |

**Dates**
- The queue is written for a first run on Monday, December 7, 2026.
- With December 25 and January 1 skipped, change 40 lands on Tuesday, February 2, 2027.
- Ten changes name a month or a holiday: 2, 3, 8, 11, 13, 18, 27, 31, 36, 39. If the start slips by more than a week, rewrite those ten.
- Change 22 edits the footer, so all 48 pages change that day. That is expected and worth showing.

### F7. `materialize(n)`

- One function writes the exact content for any point in the queue: the baseline plus changes 1 to n.
- The baseline lives in `demo/baseline/` as a copy of `content/` and `public/media/` at launch.
- `materialize(n)` clears `content/` and `public/media/`, copies the baseline, then lays changes 1 to n on top in order.
- `demo/state.json` holds `cursor` (0 to 40), `live` (a scenario id or null), `liveIndex` (which scenario is next) and `lastRunDate`.
- `demo/config.json` holds `startDate` and `skipDates`.
- It works like a save point in a game. Any day of the season can be loaded exactly.
- Because it writes whole files, there is never a merge conflict.

### F8. Daily routine

- `.github/workflows/daily-change.yml`, with `schedule` and `workflow_dispatch`.
- Cron `17 15 * * 1-5` in UTC. That is 7:17 am Pacific in winter and 8:17 am in summer. GitHub can start scheduled jobs late. That is fine.
- Steps:
  1. Read `demo/state.json`.
  2. Stop if today is in `skipDates`, if `lastRunDate` is today, or if `cursor` is 40.
  3. Run `materialize(cursor + 1)`. Set `cursor`, clear `live`, set `lastRunDate`.
  4. Commit with the change's message. Push to `main`.
  5. If `cursor` is now 35, open a GitHub issue: "Demo queue has 5 changes left."
- A manual run through `workflow_dispatch` ignores `lastRunDate`.
- If a call left the site changed, the routine does not care. It writes the expected content for the next change. It heals itself.
- A `concurrency` group stops two runs from overlapping. If the push is rejected, pull, run `materialize` again and retry once. Then fail loudly.

**Commit author**
- Every routine commit is authored by one real GitHub account that is a member of the Vercel team.
- Vercel can block a deploy from a private repo when it cannot match the commit author to a team member. So no made-up authors.
- The story lives in the commit message, not the author name.
- Source: [Vercel: Troubleshoot project collaboration](https://vercel.com/docs/deployments/troubleshoot-project-collaboration).

**Vercel settings**
- Production branch is `main`. Other branches do not deploy.
- `ignoreCommand` in `vercel.json` skips the build when a commit changes nothing under `content/`, `public/`, `src/` or the build config. A commit that only touches scripts makes no deploy and no empty version.
- Skew Protection off.

### F9. Live scenarios

Five staged changes for the live moment on a call. Each one edits only the home page's content file, never `site.json`, and carries three breaks.

| Id | Commit message | Break a | Break b | Break c |
|---|---|---|---|---|
| L1 | Friday promo update | Link Checker: hero button goes to `/schedule`, a 404 | Consistency Checker: whitening is $249 on home, a different price on its own page | Proofreader: "Limted time" in the banner |
| L2 | New patient special | Image Inspector: banner image does not load | Mobile Inspector: banner causes sideways scroll on phones | Proofreader: "Insert offer details here" |
| L3 | Update phone numbers | Consistency Checker: a new Riverside line on home does not match the Riverside page | Link Checker: the hero phone is no longer tap-to-call | Proofreader: doubled word in the hero |
| L4 | Tidy up the home page | AI Visibility: the headline is no longer a heading | Image Inspector: hero photo stretched | Mobile Inspector: hero button label cut off on phones |
| L5 | Add Saturday hours | Consistency Checker: new Saturday hours on home differ from the office pages | Link Checker: "Book Saturday" goes to a 404 | Proofreader: typo in the new line |

- A scenario is a short list of exact-text replacements plus any new files. Not whole-file overlays. The home page changes during the queue, so an overlay would wipe queue changes.
- `pnpm demo:break` applies the next scenario in rotation, sets `live`, commits and pushes.
- If any replacement text is missing, it stops and changes nothing.
- If `live` is already set, or the content does not match the expected state, it refuses and says to reset first.
- The text each scenario replaces must exist in all 41 queue states. The home page changes 9 times in the queue, so pick anchors that survive.
- `pnpm verify:live` applies each of the 5 scenarios to each of the 41 queue states. All 205 must apply cleanly.

### F10. Reset and status

- `pnpm demo:reset`: runs `materialize(cursor)`, clears `live`, commits "Restore content from backup", pushes. Does nothing if the content already matches.
- `pnpm demo:status`: prints the cursor, the page count, the breaks that should be open, and whether the content matches.
- `pnpm demo:next`: pushes the next queued change now. Same code as the routine.
- No command ever force pushes. History only grows, so git, Vercel and Superflow stay lined up.

### F11. Verify scripts

| Script | What it proves | Worked number |
|---|---|---|
| `verify:determinism` | Same content gives the same HTML. One edit changes one page. | 3 builds |
| `verify:breaks` | At every queue state, the breaks present match the registry and the page count is right. | 41 states, content checks only, under a minute |
| `verify:live` | Every live scenario applies at every queue state. | 5 × 41 = 205 |
| `verify:build` | The current state builds, and its HTML passes the registry's HTML checks. | 1 build |

- CI runs all four on any pull request that touches `content/`, `demo/` or `src/`.

### F12. Seeded human comments

Four comments from a made-up client, Dana Reyes, practice manager. They are created once in Superflow, after the baseline scan.

| Page | Pinned on | Comment |
|---|---|---|
| `/` | Hero subtitle | "Can we say 'same-week appointments' instead of 'fast scheduling'? It's more concrete." |
| `/team` | Dr. Brandt's card | "Dr. Brandt's title should be DMD, not DDS." |
| `/services/kids-dentistry` | Main photo | "Can we swap this for a photo with a parent in the room?" |
| `/locations/riverside` | Parking note | "The parking note is out of date. The lot entrance moved to Alder Street." |

- No queue change or live scenario removes the element a comment is pinned to.
- The presenter adds a fifth comment live on each call.

### F13. Runbook

`docs/demo-runbook.md`, one page:
- Before a call: `pnpm demo:status`. If it says the content does not match, `pnpm demo:reset`.
- On a call: the order of what to show, when to run `pnpm demo:break`, and the measured wait.
- The fix prompt for Claude Code, scoped to what broke in the latest version.
- After a call: `pnpm demo:reset` if the fix was not run.
- What to do when Vercel fails, when a version does not appear, and when the queue is empty.

## How it connects

| Direction | System | How |
|---|---|---|
| Out | Vercel | A push to `main` makes a production deploy. |
| Vercel to Superflow | Vercel integration (exists) | The deploy starts a run with trigger `deploy`. |
| In Superflow | Site care (02) | The site is in `care` mode, daily, time zone `America/Los_Angeles`. What changed and What broke fill from real runs. |
| In Superflow | Toolbar | The script from `superflow_get_install_snippet` (platform `nextjs`) goes in the root layout. |
| On calls | Superflow MCP (04) | `superflow_use_playbook` with `fix`, `superflow_list_failing_checks`, `superflow_get_finding_source`, `superflow_mark_check_fixed`. All exist today. |
| Setup | Superflow MCP (04) | `superflow_create_project`, `superflow_verify_install`, `superflow_set_site_mode`, `superflow_set_site_timezone`, `superflow_create_comment`. All exist today. |
| Feeds | Agents (03) | Seeded breaks the agents miss are logged for the quality loop. |
| None | Lead audits | Run on the prospect's site. Nothing to build here. |
| Later | WordPress workflow | Separate spec. Same content and queue. |

## Design principles

1. **Real data only.** If Superflow shows it, a real run produced it.
2. **Boring on the day.** Every change is written ahead of time. Nothing is generated at run time.
3. **History only grows.** No force push. No reset that erases.
4. **One function for every state.** The routine, reset and tests all call `materialize`.
5. **Plausible breaks.** Each one is a mistake a busy team makes on a Friday.
6. **Clean everywhere else.** If the agents flag 80 things, the demo teaches nothing.

## Guardrails

- No real people, patients or practices. Phone numbers use 555-0100 to 555-0199. The footer says the practice is fictional.
- No real company names or logos, including insurers and product brands.
- No stock photos of real people as named staff.
- Forms store nothing and send nothing.
- No analytics, ad pixels or third-party trackers.
- No secrets in the repo. The push token is a GitHub secret. No Superflow API key in the code.
- Never force push to `main`. Never delete a Vercel deployment.
- Queue changes and live scenarios touch only `content/` and `public/media/`.
- The site is never tuned to hide an agent mistake, and the agents are never tuned for this site.
- On calls, the fix prompt covers only what broke in the latest version, so pinned breaks survive.

## Ship criteria

1. 42 pages live. `sitemap.xml` lists exactly 42.
2. `verify:determinism`, `verify:breaks`, `verify:live` and `verify:build` pass.
3. No page scrolls sideways at 390 px except `/services/crowns-and-bridges`.
4. The baseline scan shows all 6 pinned breaks, each from the expected agent.
5. Every other agent comment from the baseline scan is either fixed in the site or ignored with a reason.
6. Five routine pushes in a row each make one production deploy and one new version. What changed lists only the pages in that change's "Pages touched".
7. A commit that only touches `demo/` or `scripts/` makes no deploy.
8. `pnpm demo:break` produces a new version with three breaks in What broke. The time from push to visible is measured and written in the runbook.
9. After a fix or `pnpm demo:reset`, a scan marks the three live breaks resolved.
10. The four seeded comments show as pins on the live site.

## Open questions

Each has a default. The build goes ahead on the default unless Rakesh says otherwise.

| # | Question | Default |
|---|---|---|
| 1 | What are the exact steps to connect the Vercel project to the Superflow site? Does the integration fire on preview deploys too? | Production only. Other branches do not deploy. |
| 2 | Does a version in Superflow show the commit message? | Write good messages either way. |
| 3 | Which domain? The site's history is tied to its URL, so decide before the first scan. | `larkmoor-dental.vercel.app`. A custom domain looks more real. |
| 4 | Which account pushes? | The repo is `superflow-ai-agents/dental-demo`. Pushes come from a machine account on the Vercel team. |
| 5 | Who supplies the 7 staff portraits? | AI-made. Placeholders until Prompt 3, which needs the real ones for P4. |
| 6 | Start date? | Monday, December 7, 2026. |
| 7 | The Workspace Agent is in the default run set and may add comments nobody seeded. Keep it on for this site? | Keep it on. Review what it flags at baseline. |
| 8 | Which Superflow workspace and site name? | The main workspace. New site "Larkmoor Family Dentistry". The existing "Superflow Demo" site is left alone. |
| 9 | Seeded comments need a guest. Invites send real email. Which address plays Dana? | An alias Rakesh controls. |
| 10 | Should search engines index a fake practice? The AI Visibility agent needs the site crawlable. | Crawlable, with the footer disclaimer. |

---

# Part 2: Engineering spec generation prompts for Claude Code

Run these in order, one session each. Each prompt asks for a short engineering plan first. Approve the plan, then let it build.

**Prompt 0. Paste at the start of every session**

```
Read demo-site.md in full before doing anything.
Rules for this repo:
- Build only what the spec says. Do not add features, pages or tools.
- Queue changes and live scenarios touch only content/ and public/media/.
- Never force push. Never use made-up commit authors.
- No em dashes in any copy or doc.
- When the spec and your judgment disagree, stop and ask.
```

**Prompt 1. The site**

```
Using demo-site.md sections F1 and F2, write an engineering plan for the site:
file tree, content schema for each content type, components, and how pages
are generated from content/. Keep it under 2 pages. Wait for my OK.
Then build the 42 launch pages with real, specific dental copy. Meet every
point under "The clean baseline". Do not add any break yet.
Finish by listing the 42 URLs and confirming sitemap.xml matches.
```

**Prompt 2. Steady builds**

```
Using section F3, plan how you will make builds deterministic and how
verify:determinism will prove it. Wait for my OK. Then implement the guards
and the script. Show me the script passing. If Next.js cannot pass, stop and
tell me what differs between two builds before proposing Astro.
```

**Prompt 3. Registry and pinned breaks**

```
Using sections F4 and F5, plan the breaks.json schema and the assertion
types. Wait for my OK. Then add the 6 pinned breaks to the content, write
their registry rows, snapshot demo/baseline/, and build verify:build.
Show each pinned break in the built HTML.
```

**Prompt 4. Queue and materialize**

```
Using sections F6, F7 and F11, plan the change.json schema, materialize(n),
state.json and verify:breaks. Wait for my OK. Then write all 40 changes
exactly as the table lists them: same order, same messages, same pages, same
breaks. Write real content for every new page and edit.
Finish with verify:breaks output showing, for n = 0 to 40, the open break
count and the page count. They must match the table.
```

**Prompt 5. Routine and Vercel**

```
Using section F8, plan the GitHub Action, the git author setup, vercel.json
and the secrets needed. Wait for my OK. Then implement. List every manual
step I must do in GitHub and Vercel, in order. Do not push to main yourself.
```

**Prompt 6. Live scenarios, reset, runbook**

```
Using sections F9, F10 and F13, plan the scenario format and the commands.
Wait for my OK. Then write the 5 scenarios, demo:break, demo:reset,
demo:status, demo:next, verify:live and docs/demo-runbook.md.
Show verify:live passing all 205 cases.
```

**Prompt 7. Connect Superflow and check the baseline**

```
Using "How it connects", F12 and Appendix B, do this with the Superflow MCP.
Ask me before every write.
1. Create the site, install the toolbar snippet, verify the install.
2. Set the site to care mode, daily, America/Los_Angeles.
3. After I confirm the Vercel integration is connected, wait for the
   baseline scan to be done.
4. Compare what Superflow reports with demo/breaks.json. Give me three
   lists: seeded and caught, seeded and missed, flagged but not seeded.
5. Record each caught break's rule_key in breaks.json.
6. After I approve, create the four seeded comments from F12.
```

---

# Appendix A: Scenarios and edge cases

## States

| State | Event | Next state | Commit made |
|---|---|---|---|
| At rest (n) | Daily routine | At rest (n+1) | Change n+1's message |
| At rest (n) | `demo:break` | Live (n) | The scenario's message |
| At rest (n) | `demo:reset` | At rest (n) | None |
| Live (n) | Fix pushed on a call | Drift (n) | The coding agent's commit |
| Live (n) | `demo:reset` | At rest (n) | "Restore content from backup" |
| Live (n) | `demo:break` | Live (n), refused | None |
| Live (n) or Drift (n) | Daily routine | At rest (n+1) | Change n+1's message |
| Drift (n) | `demo:reset` | At rest (n) | "Restore content from backup" |
| Drift (n) | `demo:break` | Refused. Reset first. | None |
| At rest (40) | Daily routine | At rest (40) | None |

## Edge cases

| Scenario | What should happen |
|---|---|
| The routine runs while a live scenario is still on the site | It writes the content for the next change. The live breaks vanish in the same version. |
| The fix on a call also fixes a pinned break | `demo:status` reports a mismatch. `demo:reset` brings the pinned break back. |
| The presenter runs `demo:break` twice | The second run refuses. |
| The queue reaches 40 | The routine exits with a warning. The site stays at state 40. The issue opened at 35 is the reminder. |
| GitHub starts the job late or skips a day | The next run carries on. It never pushes two changes to catch up. |
| The cron and a manual run land on the same day | The cron run stops on `lastRunDate`. A manual run always goes through. |
| Someone pushes at the same moment | Pull, `materialize` again, retry once, then fail loudly. |
| The Vercel build fails | No new version. The Action cannot see this. The runbook says to check Vercel first when a version is missing. |
| Vercel blocks the deploy because of the commit author | Caught by ship criterion 6. Fix the author account. |
| A holiday | Add the date to `skipDates`. |
| The start date slips more than a week | Rewrite the ten dated changes. |
| A seeded break is not caught by its agent | See Appendix B. |
| An agent flags something nobody seeded | See Appendix B. |
| Superflow does not find a new page | The page is in `sitemap.xml` and linked from its hub. If it is still missed, add it with `superflow_add_page` and log a product bug. |
| A footer change touches every page | Expected. What changed lists all 48 pages for change 22. |
| Clocks change in March | The cron is in UTC, so the local time moves by an hour. No action. |

## Worked numbers

- **Versions.** 40 routine versions in 8 weeks. Each live demo adds 2: the break, then the fix or the reset. At 3 live demos a week that is 6 a week next to 5 routine ones, or 40 + 48 = 88 versions in 8 weeks.
- **Repeats.** With 5 scenarios and 3 live demos a week, the same scenario comes back about every 12 days.
- **Size.** 50 pages at most. That is far below any page cap for a care site.
- **Changed pages per run.** Usually 1 to 4. Change 22 is the one outlier at 48.
- **Open breaks.** Between 6 and 10 from the routine. Up to 13 while a live scenario is on the site.
- **Tests.** 41 states for `verify:breaks`. 205 cases for `verify:live`.

---

# Appendix B: AI testing framework

## Golden dataset

- The break registry is the dataset: 6 pinned + 13 queue + 15 live = 34 seeded breaks.
- Each has a known agent, page, element and the version it should first appear in.
- The 41 queue states are the fixtures.

## Evals

| Eval | Question | Pass |
|---|---|---|
| Caught | Did the expected agent flag the seeded break in the run that followed its deploy? | Yes, in that run |
| Clean | Is every agent comment on the site in the registry? | Extras are reviewed, one by one |
| What changed | Does the version list exactly the pages in the change's "Pages touched"? | Exact match |
| Verified | After a fix, did a scan mark the break resolved? | `verifiedAt` set by a scan |

**When an agent misses a seeded break**
- Log it for the quality loop. It is a real miss on a real page.
- If it is missed on two runs, reword the break so it matches the agent's own description of what it checks.
- Never change the agent to pass the demo. That is teaching to the test.

**When an agent flags something nobody seeded**
- If it is a real problem, fix the site. Add the fix to the baseline.
- If it is wrong, ignore it with reason `wrong` and log it for the quality loop.

## Production monitoring

- GitHub emails whoever last edited the workflow's schedule when the routine fails.
- The issue at change 35 warns that the queue is running out.
- Vercel notifies on a failed deploy.
- Once a week, run this in Claude Code with the Superflow MCP connected:

```
Run pnpm demo:status in the dental-demo repo. Then, for the site
"Larkmoor Family Dentistry", call superflow_list_failing_checks and
superflow_list_findings. Compare with demo/breaks.json at the current cursor.
Report: seeded breaks Superflow is missing, comments Superflow has that are
not seeded, and any weekday in the last 7 with no new version. Read only.
Change nothing.
```
