import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPages, getChildren, getPage, getSite } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import { blogPostingJsonLd, dentistJsonLd, locationJsonLd } from "@/lib/jsonld";
import { CardGrid } from "@/components/CardGrid";
import { LocationView } from "@/components/LocationView";

export const dynamicParams = false;

type Params = { slug?: string[] };

function urlFrom(slug?: string[]): string {
  return slug && slug.length ? "/" + slug.join("/") : "/";
}

export function generateStaticParams(): Params[] {
  return getAllPages().map((p) => ({ slug: p.url === "/" ? [] : p.url.slice(1).split("/") }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(urlFrom(slug));
  if (!page) return {};
  const site = getSite();
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.url },
    openGraph: {
      title: page.title,
      description: page.description,
      url: page.url,
      siteName: site.name,
      type: page.kind === "markdown" && page.jsonLd === "blogPosting" ? "article" : "website",
      images: [{ url: "/media/og.png", width: 1200, height: 630, alt: site.name }],
    },
  };
}

function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const page = getPage(urlFrom(slug));
  if (!page) notFound();
  const site = getSite();
  const html = renderMarkdown(page.body);

  if (page.kind === "location") {
    return (
      <>
        <JsonLd data={locationJsonLd(site, page)} />
        <LocationView loc={page} bodyHtml={html} />
      </>
    );
  }

  return (
    <>
      {page.jsonLd === "dentist" && <JsonLd data={dentistJsonLd(site)} />}
      {page.jsonLd === "blogPosting" && <JsonLd data={blogPostingJsonLd(site, page)} />}
      <article className={`content-body${page.url === "/" ? " is-home" : ""}`} dangerouslySetInnerHTML={{ __html: html }} />
      {page.hub && <CardGrid kind={page.hub} items={getChildren(page.hub)} />}
    </>
  );
}
