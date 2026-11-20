import type { HubKind, MarkdownPage } from "@/lib/content";

export function CardGrid({ kind, items }: { kind: HubKind; items: MarkdownPage[] }) {
  return (
    <section className="wrap pb-24" aria-label={kind === "blog" ? "Articles" : kind === "team" ? "Our team" : "Services"}>
      <ul className={`hub-grid hub-${kind}`}>
        {items.map((p) => (
          <li key={p.url} className="hub-card">
            <a href={p.url} className="hub-link">
              {p.card?.image && (
                <img
                  src={p.card.image}
                  alt={p.card.imageAlt ?? ""}
                  width={kind === "team" ? 480 : 800}
                  height={kind === "team" ? 600 : 500}
                  className="hub-img"
                />
              )}
              <div className="hub-body">
                {kind === "blog" && p.date && <p className="hub-meta">{formatDate(p.date)}</p>}
                <h2 className="hub-heading">{p.card?.heading ?? p.title}</h2>
                {kind === "team" && p.role && <p className="hub-role">{p.role}</p>}
                {p.card?.summary && <p className="hub-summary">{p.card.summary}</p>}
                <span className="hub-more">{kind === "blog" ? "Read article" : kind === "team" ? "Meet " + firstName(p) : "Learn more"}</span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function firstName(p: MarkdownPage): string {
  const h = p.card?.heading ?? p.title;
  const name = h.split(",")[0];
  return name.startsWith("Dr. ") ? name : name.split(" ")[0];
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Fixed formatting with no locale or time zone involved, so builds stay byte for byte the same.
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}
