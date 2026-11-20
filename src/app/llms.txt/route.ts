import { getAllPages, getSite } from "@/lib/content";

export const dynamic = "force-static";

export function GET() {
  const site = getSite();
  const pages = getAllPages();
  const section = (label: string, prefix: string | null) => {
    const list = pages.filter((p) =>
      prefix === null ? !["/services/", "/team/", "/blog/", "/locations/"].some((s) => p.url.startsWith(s)) : p.url.startsWith(prefix),
    );
    return [`## ${label}`, "", ...list.map((p) => `- [${p.title}](${site.url}${p.url})${p.description ? `: ${p.description}` : ""}`), ""].join("\n");
  };
  const body = [
    `# ${site.name}`,
    "",
    `> A family dental practice in Larkmoor, Oregon. Main line ${site.mainPhone}. This is a fictional practice used for product demos.`,
    "",
    section("Practice", null),
    section("Services", "/services/"),
    section("Locations", "/locations/"),
    section("Team", "/team/"),
    section("Blog", "/blog/"),
  ].join("\n");
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
