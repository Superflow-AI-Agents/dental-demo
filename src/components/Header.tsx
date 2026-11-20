import type { SiteConfig } from "@/lib/content";
import { telHref } from "@/lib/phone";

export function Header({ site }: { site: SiteConfig }) {
  return (
    <header className="site-header">
      <div className="wrap flex items-center justify-between gap-6 py-4">
        <a href="/" className="flex items-center gap-3 shrink-0">
          <img src="/media/logo.svg" alt={site.name} width={220} height={44} className="h-10 w-auto" />
        </a>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[15px] font-medium text-ink-2">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover:text-accent transition-colors">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden lg:flex items-center gap-5">
          <a href={telHref(site.mainPhone)} className="text-[15px] font-semibold text-ink hover:text-accent">
            {site.mainPhone}
          </a>
          <a href={site.cta.href} className="btn">
            {site.cta.label}
          </a>
        </div>
        <details className="mobile-nav lg:hidden">
          <summary aria-label="Open menu">
            <span className="burger" aria-hidden="true" />
            <span className="text-sm font-semibold">Menu</span>
          </summary>
          <div className="mobile-panel">
            <ul>
              {site.nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
            <a href={telHref(site.mainPhone)} className="mobile-phone">
              Call {site.mainPhone}
            </a>
            <a href={site.cta.href} className="btn w-full justify-center">
              {site.cta.label}
            </a>
          </div>
        </details>
      </div>
    </header>
  );
}
