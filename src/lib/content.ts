import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// All content is read on the server at build time. Nothing here ships to the client.

const CONTENT = path.join(process.cwd(), "content");

export type JsonLdKind = "dentist" | "blogPosting" | "none";

export type Card = {
  heading: string;
  summary: string;
  image?: string;
  imageAlt?: string;
  order?: number;
};

export type HubKind = "services" | "team" | "blog";

export type MarkdownPage = {
  kind: "markdown";
  url: string;
  file: string;
  title: string;
  description?: string;
  jsonLd: JsonLdKind;
  hub?: HubKind;
  card?: Card;
  role?: string;
  credentials?: string;
  date?: string;
  author?: string;
  image?: string;
  imageAlt?: string;
  body: string;
};

export type Hours = { days: string; time: string };

export type LocationPage = {
  kind: "location";
  url: string;
  file: string;
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  name: string;
  factsHeading: string;
  cta: { label: string; href: string };
  address: { street: string; suite?: string; city: string; state: string; zip: string };
  phone: string;
  hours: Hours[];
  parking: string;
  image: string;
  imageAlt: string;
  body: string;
};

export type Page = MarkdownPage | LocationPage;

export type SiteConfig = {
  name: string;
  shortName: string;
  url: string;
  mainPhone: string;
  email: string;
  nav: { label: string; href: string }[];
  cta: { label: string; href: string };
  footer: {
    blurb: string;
    offices: { name: string; href: string; phone: string }[];
    columns: { heading: string; links: { label: string; href: string }[] }[];
    legal: { label: string; href: string }[];
    disclaimer: string;
  };
};

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function readMarkdown(file: string, url: string): MarkdownPage {
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return {
    kind: "markdown",
    url,
    file: path.relative(process.cwd(), file),
    title: String(data.title ?? ""),
    description: data.description ? String(data.description) : undefined,
    jsonLd: (data.jsonLd as JsonLdKind) ?? "none",
    hub: data.hub as HubKind | undefined,
    card: data.card as Card | undefined,
    role: data.role,
    credentials: data.credentials,
    date: data.date ? String(data.date) : undefined,
    author: data.author,
    image: data.image,
    imageAlt: data.imageAlt,
    body: content,
  };
}

function urlFromPagesFile(rel: string): string {
  const noExt = rel.replace(/\.md$/, "");
  if (noExt === "index") return "/";
  return "/" + noExt.split(path.sep).join("/");
}

let cache: Page[] | null = null;

export function getAllPages(): Page[] {
  if (cache) return cache;
  const pages: Page[] = [];

  const pagesDir = path.join(CONTENT, "pages");
  for (const file of walk(pagesDir).filter((f) => f.endsWith(".md"))) {
    pages.push(readMarkdown(file, urlFromPagesFile(path.relative(pagesDir, file))));
  }

  for (const section of ["services", "team", "blog"] as const) {
    const dir = path.join(CONTENT, section);
    for (const file of walk(dir).filter((f) => f.endsWith(".md"))) {
      const slug = path.basename(file, ".md");
      pages.push(readMarkdown(file, `/${section}/${slug}`));
    }
  }

  const locDir = path.join(CONTENT, "locations");
  for (const file of walk(locDir).filter((f) => f.endsWith(".json"))) {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    const slug = path.basename(file, ".json");
    pages.push({
      kind: "location",
      url: `/locations/${slug}`,
      file: path.relative(process.cwd(), file),
      slug,
      ...data,
    });
  }

  pages.sort((a, b) => a.url.localeCompare(b.url));
  cache = pages;
  return pages;
}

export function getPage(url: string): Page | undefined {
  return getAllPages().find((p) => p.url === url);
}

export function getChildren(section: HubKind): MarkdownPage[] {
  return getAllPages()
    .filter((p): p is MarkdownPage => p.kind === "markdown" && p.url.startsWith(`/${section}/`))
    .sort((a, b) => {
      if (section === "blog") return (b.date ?? "").localeCompare(a.date ?? "") || a.url.localeCompare(b.url);
      return (a.card?.order ?? 999) - (b.card?.order ?? 999) || a.url.localeCompare(b.url);
    });
}

let siteCache: SiteConfig | null = null;
export function getSite(): SiteConfig {
  if (siteCache) return siteCache;
  siteCache = JSON.parse(fs.readFileSync(path.join(CONTENT, "site.json"), "utf8")) as SiteConfig;
  return siteCache;
}
