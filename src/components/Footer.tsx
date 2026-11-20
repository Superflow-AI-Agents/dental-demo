import type { SiteConfig } from "@/lib/content";
import { telHref } from "@/lib/phone";

export function Footer({ site }: { site: SiteConfig }) {
  const f = site.footer;
  return (
    <footer className="site-footer">
      <div className="wrap grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <a href="/" className="inline-block">
            <img src="/media/logo-light.svg" alt={site.name} width={220} height={44} className="h-10 w-auto" />
          </a>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/70">{f.blurb}</p>
          <p className="mt-5 text-[15px]">
            <a href={`mailto:${site.email}`} className="text-white hover:text-mint">
              {site.email}
            </a>
          </p>
        </div>
        <div className="md:col-span-3">
          <p className="footer-heading">Our offices</p>
          <ul className="mt-4 space-y-3">
            {f.offices.map((o) => (
              <li key={o.href}>
                <a href={o.href} className="block font-medium text-white hover:text-mint">
                  {o.name}
                </a>
                <a href={telHref(o.phone)} className="text-[15px] text-white/70 hover:text-mint">
                  {o.phone}
                </a>
              </li>
            ))}
          </ul>
        </div>
        {f.columns.map((col) => (
          <div key={col.heading} className="md:col-span-2">
            <p className="footer-heading">{col.heading}</p>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              {col.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-white/70 hover:text-mint">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-col gap-3 py-6 text-[13px] text-white/60 md:flex-row md:items-center md:justify-between">
          <p>{f.disclaimer}</p>
          <ul className="flex gap-5">
            {f.legal.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-white">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
