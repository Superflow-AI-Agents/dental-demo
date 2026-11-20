// Checks "The clean baseline" (demo-site.md, F1) on the built HTML in .next/server/app.
// Run after `pnpm build`:  pnpm check:baseline
//
// It is the only reader of tests/reference-facts.json. The site never imports that file, so a
// typo in content shows up here instead of becoming a break nobody seeded.

import fs from "node:fs";
import path from "node:path";
import { parse, HTMLElement } from "node-html-parser";
import { getAllPages } from "../src/lib/content";

type Office = { name: string; street: string; suite: string | null; city: string; state: string; zip: string; phone: string };
type Facts = {
  practice: { name: string; mainPhone: string; email: string };
  offices: Record<string, Office>;
  hours: { days: string; time: string }[];
  prices: Record<string, string>;
};

const ROOT = process.cwd();
const APP = path.join(ROOT, ".next", "server", "app");
const facts: Facts = JSON.parse(fs.readFileSync(path.join(ROOT, "tests", "reference-facts.json"), "utf8"));
const offices = Object.entries(facts.offices);
const officeNames = offices.map(([, o]) => o.name);
const allowedPhones = new Set([facts.practice.mainPhone, ...offices.map(([, o]) => o.phone)]);
const allowedEmails = new Set([facts.practice.email]);

// Words that must appear near each price, so a price cannot drift onto the wrong thing.
const PRICE_CONTEXT: Record<string, RegExp> = {
  "$349": /whiten/i,
  "$199": /tray|take-home/i,
  "$149": /new patient|exam|without insurance/i,
  "$29": /month/i,
  "$19": /month/i,
  "$89": /emergency/i,
};

const PHONE_RE = /\(\d{3}\) \d{3}-\d{4}/g;
const TIME_RANGE_RE = /\d{1,2}:\d{2} [ap]m to \d{1,2}:\d{2} [ap]m/g;
const DAY_HOURS_RE = /(Monday to Thursday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday):?\s*(\d{1,2}:\d{2} [ap]m to \d{1,2}:\d{2} [ap]m|Closed)/g;
const PRICE_RE = /\$\d+(?:,\d{3})*(?:\.\d{2})?/g;

const pages = getAllPages();
const urls = new Set(pages.map((p) => p.url));
const problems: string[] = [];
const add = (url: string, msg: string) => problems.push(`${url}: ${msg}`);

function htmlFile(url: string): string {
  return path.join(APP, url === "/" ? "index.html" : url.slice(1) + ".html");
}

function digits(s: string): string {
  return s.replace(/\D/g, "");
}

function text(el: HTMLElement): string {
  return el.textContent.replace(/\s+/g, " ").trim();
}

function publicFileExists(href: string): boolean {
  return fs.existsSync(path.join(ROOT, "public", decodeURIComponent(href.split(/[?#]/)[0])));
}

function checkInternalHref(url: string, href: string, what: string) {
  const clean = href.split(/[?#]/)[0];
  if (clean === "" ) return;
  if (urls.has(clean)) return;
  if (["/sitemap.xml", "/robots.txt", "/llms.txt", "/api/form"].includes(clean)) return;
  if (publicFileExists(clean)) return;
  add(url, `${what} points to ${href}, which is not a page or file`);
}

function officeMentioned(t: string): string[] {
  return officeNames.filter((n) => t.includes(n));
}

for (const page of pages) {
  const url = page.url;
  const file = htmlFile(url);
  if (!fs.existsSync(file)) {
    add(url, `no built HTML at ${path.relative(ROOT, file)}`);
    continue;
  }
  const doc = parse(fs.readFileSync(file, "utf8"), { comment: false });
  const main = doc.querySelector("main");
  if (!main) {
    add(url, "no <main>");
    continue;
  }

  // Title and description
  const title = doc.querySelector("title")?.textContent.trim();
  if (!title) add(url, "missing <title>");
  const desc = doc.querySelector('meta[name="description"]')?.getAttribute("content")?.trim();
  if (!desc) add(url, "missing meta description");
  else if (desc.length > 170) add(url, `meta description is ${desc.length} characters`);

  // Headings: one H1, levels in order
  const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");
  const h1s = headings.filter((h) => h.tagName === "H1");
  if (h1s.length !== 1) add(url, `expected 1 H1, found ${h1s.length}`);
  let prev = 0;
  for (const h of headings) {
    const level = Number(h.tagName[1]);
    if (prev === 0 && level !== 1) add(url, `first heading is ${h.tagName}, not H1`);
    if (prev > 0 && level > prev + 1) add(url, `heading jumps from H${prev} to ${h.tagName} ("${text(h).slice(0, 40)}")`);
    if (!text(h)) add(url, `empty ${h.tagName}`);
    prev = level;
  }

  // Images
  for (const img of doc.querySelectorAll("img")) {
    const src = img.getAttribute("src") ?? "";
    const alt = img.getAttribute("alt");
    if (!alt || !alt.trim()) add(url, `image ${src} has no alt text`);
    if (!img.getAttribute("width") || !img.getAttribute("height")) add(url, `image ${src} has no width/height`);
    if (src.startsWith("/") && !publicFileExists(src)) add(url, `image ${src} does not exist`);
    if (!src.startsWith("/")) add(url, `image ${src} is not a local file`);
  }

  // Logo links home
  const logoLink = doc.querySelector("header a");
  if (!logoLink || logoLink.getAttribute("href") !== "/" || !logoLink.querySelector("img")) add(url, "header logo does not link home");

  // Links
  for (const a of doc.querySelectorAll("a")) {
    const href = a.getAttribute("href");
    const label = text(a) || a.querySelector("img")?.getAttribute("alt") || "";
    if (href === null || href === undefined) {
      add(url, `link "${label}" has no href`);
      continue;
    }
    if (href === "" || href === "#") add(url, `link "${label}" goes nowhere`);
    else if (href.startsWith("#")) {
      if (!doc.getElementById(href.slice(1))) add(url, `link "${label}" points to missing anchor ${href}`);
    }
    else if (href.startsWith("tel:")) {
      if (!/^tel:\+1\d{10}$/.test(href)) add(url, `bad tel link ${href}`);
      const shown = (label.match(PHONE_RE) ?? [])[0];
      if (shown && digits("1" + shown) !== digits(href)) add(url, `tel link ${href} does not match its text ${shown}`);
    } else if (href.startsWith("mailto:")) {
      const addr = href.slice(7).split("?")[0];
      if (!allowedEmails.has(addr)) add(url, `unknown email ${addr}`);
    } else if (href.startsWith("/")) checkInternalHref(url, href, `link "${label}"`);
    else add(url, `link "${label}" goes off site: ${href}`);
  }
  for (const form of doc.querySelectorAll("form")) {
    checkInternalHref(url, form.getAttribute("action") ?? "", "form");
  }

  // Emails shown as text must be mailto links
  const emailRe = /[\w.+-]+@[\w-]+\.[\w.]+/g;
  {
    const clone = parse(main.toString());
    clone.querySelectorAll('a[href^="mailto:"]').forEach((a) => a.remove());
    clone.querySelectorAll("script").forEach((sc) => sc.remove());
    for (const m of text(clone).match(emailRe) ?? []) add(url, `email ${m} is plain text, not a mailto link`);
  }

  // Phones: every phone is a tel link, is a known number, and matches the office it sits next to
  const body = doc.querySelector("body")!;
  {
    const clone = parse(body.toString());
    clone.querySelectorAll('a[href^="tel:"]').forEach((a) => a.remove());
    clone.querySelectorAll("script").forEach((s) => s.remove());
    for (const m of text(clone).match(PHONE_RE) ?? []) add(url, `phone ${m} is plain text, not a tel link`);
  }
  for (const m of text(body).match(PHONE_RE) ?? []) {
    if (!allowedPhones.has(m)) add(url, `phone ${m} is not in the reference list`);
  }
  const scoped = [...main.querySelectorAll("p, li, dd, .card, .facts"), ...doc.querySelectorAll("footer li")];
  for (const el of scoped) {
    const t = text(el);
    const phones = t.match(PHONE_RE) ?? [];
    if (!phones.length) continue;
    const named = officeMentioned(t);
    if (named.length !== 1) continue;
    const office = offices.find(([, o]) => o.name === named[0])![1];
    for (const ph of phones) {
      if (ph !== office.phone && ph !== facts.practice.mainPhone) add(url, `${office.name} is next to ${ph}, expected ${office.phone}`);
    }
  }
  if (page.kind === "location") {
    const ref = facts.offices[page.slug];
    if (!ref) add(url, `office ${page.slug} is not in the reference list`);
    else {
      for (const ph of text(main).match(PHONE_RE) ?? []) {
        if (ph !== ref.phone && ph !== facts.practice.mainPhone) add(url, `phone ${ph} on the ${ref.name} page, expected ${ref.phone}`);
      }
    }
  }

  // Addresses
  const mainText = text(main);
  for (const [, o] of offices) {
    const streetName = o.street.replace(/^\d+\s+/, "");
    const re = new RegExp(`(\\d+)\\s+${streetName}`, "g");
    for (const m of mainText.matchAll(re)) {
      if (`${m[1]} ${streetName}` !== o.street) add(url, `address "${m[0]}" should be "${o.street}"`);
    }
    if (o.suite === null && new RegExp(`${o.street},? Suite`).test(mainText)) add(url, `${o.name} shows a suite number it does not have`);
  }
  for (const m of mainText.matchAll(/Larkmoor, OR (\d{5})/g)) {
    if (!offices.some(([, o]) => o.zip === m[1])) add(url, `zip ${m[1]} is not in the reference list`);
  }

  // Hours
  const allowedTimes = new Set(facts.hours.map((h) => h.time));
  for (const m of mainText.match(TIME_RANGE_RE) ?? []) {
    if (!allowedTimes.has(m)) add(url, `hours "${m}" are not in the reference list`);
  }
  for (const m of mainText.matchAll(DAY_HOURS_RE)) {
    const ref = facts.hours.find((h) => h.days === m[1]);
    if (!ref) add(url, `hours for "${m[1]}" are not in the reference list`);
    else if (ref.time !== m[2]) add(url, `${m[1]} hours are "${m[2]}", expected "${ref.time}"`);
  }
  for (const row of main.querySelectorAll("table.hours tr")) {
    const days = text(row.querySelector("th")!);
    const time = text(row.querySelector("td")!);
    const ref = facts.hours.find((h) => h.days === days);
    if (!ref || ref.time !== time) add(url, `hours row "${days}: ${time}" does not match the reference list`);
  }

  // Prices
  for (const el of main.querySelectorAll("p, li, td, .card, .banner")) {
    const t = text(el);
    for (const m of t.match(PRICE_RE) ?? []) {
      if (!(m in facts.prices)) add(url, `price ${m} is not in the reference list`);
      else {
        // Look at the element and up to three ancestors (a price figure often sits in a card).
        let ctx: HTMLElement | null = el;
        let ok = false;
        for (let i = 0; i < 4 && ctx; i++, ctx = ctx.parentNode as HTMLElement | null) {
          if (PRICE_CONTEXT[m].test(text(ctx))) ok = true;
          if (ok) break;
        }
        if (!ok) add(url, `price ${m} appears without its context ("${t.slice(0, 60)}")`);
      }
    }
  }

  // Copy rules
  if (/[—–]/.test(text(body))) add(url, "contains an em dash or en dash");

  // JSON-LD where the spec asks for it
  const ld = doc.querySelectorAll('script[type="application/ld+json"]').map((s) => JSON.parse(s.textContent));
  const needsLd = url === "/" || page.kind === "location" || (page.kind === "markdown" && page.jsonLd === "blogPosting");
  if (needsLd && ld.length === 0) add(url, "missing JSON-LD");
  if (url.startsWith("/blog/")) {
    const post = ld.find((d) => d["@type"] === "BlogPosting");
    if (!post?.author?.name || post.author.name === facts.practice.name) add(url, "blog post JSON-LD names no author");
    if (!post?.datePublished) add(url, "blog post JSON-LD has no date");
  }

  // Footer disclaimer
  if (!text(doc.querySelector("footer") ?? doc).includes("Larkmoor Family Dentistry is a fictional practice used for product demos.")) {
    add(url, "footer disclaimer missing");
  }
}

// Site-wide files
const sitemapFile = path.join(APP, "sitemap.xml.body");
if (!fs.existsSync(sitemapFile)) problems.push("sitemap.xml: not built");
else {
  const locs = [...fs.readFileSync(sitemapFile, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname.replace(/^$/, "/"));
  const inMap = new Set(locs);
  if (locs.length !== pages.length) problems.push(`sitemap.xml: lists ${locs.length} pages, content has ${pages.length}`);
  for (const u of urls) if (!inMap.has(u)) problems.push(`sitemap.xml: missing ${u}`);
}
const robotsFile = path.join(APP, "robots.txt.body");
if (!fs.existsSync(robotsFile) || !/User-Agent: \*\nAllow: \//i.test(fs.readFileSync(robotsFile, "utf8"))) problems.push("robots.txt: not open to all crawlers");
if (!fs.existsSync(path.join(APP, "llms.txt.body"))) problems.push("llms.txt: not built");
if (!fs.existsSync(path.join(APP, "_not-found.html"))) problems.push("404 page: not built");

console.log(`Checked ${pages.length} pages.`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const p of problems) console.log("  " + p);
  process.exit(1);
}
console.log("Clean baseline: no problems.");
