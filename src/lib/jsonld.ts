import type { LocationPage, MarkdownPage, SiteConfig, Hours } from "./content";
import { getPage } from "./content";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function to24(t: string): string | null {
  const m = t.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i);
  if (!m) return null;
  let h = Number(m[1]) % 12;
  if (m[3].toLowerCase() === "pm") h += 12;
  return `${String(h).padStart(2, "0")}:${m[2] ?? "00"}`;
}

function expandDays(days: string): string[] {
  const range = days.match(/^(\w+) to (\w+)$/);
  if (range) {
    const a = DAYS.indexOf(range[1]);
    const b = DAYS.indexOf(range[2]);
    if (a >= 0 && b >= a) return DAYS.slice(a, b + 1);
  }
  return days.split(/,\s*|\s+and\s+/).filter((d) => DAYS.includes(d));
}

function hoursSpec(hours: Hours[]) {
  const out: object[] = [];
  for (const h of hours) {
    const parts = h.time.split(/\s+to\s+/);
    if (parts.length !== 2) continue;
    const opens = to24(parts[0]);
    const closes = to24(parts[1]);
    if (!opens || !closes) continue;
    out.push({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: expandDays(h.days),
      opens,
      closes,
    });
  }
  return out;
}

function tel(phone: string): string {
  return "+1-" + phone.replace(/[^\d]/g, "").replace(/^(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3");
}

export function dentistJsonLd(site: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: site.name,
    url: site.url,
    logo: `${site.url}/media/logo.svg`,
    telephone: tel(site.mainPhone),
    email: site.email,
    areaServed: "Larkmoor, Oregon",
  };
}

export function locationJsonLd(site: SiteConfig, loc: LocationPage) {
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: `${site.name}, ${loc.name}`,
    url: `${site.url}${loc.url}`,
    image: `${site.url}${loc.image}`,
    telephone: tel(loc.phone),
    address: {
      "@type": "PostalAddress",
      streetAddress: [loc.address.street, loc.address.suite].filter(Boolean).join(", "),
      addressLocality: loc.address.city,
      addressRegion: loc.address.state,
      postalCode: loc.address.zip,
      addressCountry: "US",
    },
    openingHoursSpecification: hoursSpec(loc.hours),
    parentOrganization: { "@type": "Dentist", name: site.name, url: site.url },
  };
}

export function blogPostingJsonLd(site: SiteConfig, post: MarkdownPage) {
  const author = post.author ? getPage(`/team/${post.author}`) : undefined;
  const authorName = author && author.kind === "markdown" ? author.card?.heading ?? author.title : site.name;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.card?.heading ?? post.title,
    description: post.description,
    datePublished: post.date,
    image: post.image ? `${site.url}${post.image}` : undefined,
    url: `${site.url}${post.url}`,
    author: {
      "@type": "Person",
      name: authorName,
      url: author ? `${site.url}${author.url}` : undefined,
    },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };
}
