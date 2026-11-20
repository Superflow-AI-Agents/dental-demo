import type { MetadataRoute } from "next";
import { getAllPages, getSite } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSite();
  return getAllPages().map((p) => ({ url: `${site.url}${p.url === "/" ? "" : p.url}` }));
}
