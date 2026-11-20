import type { LocationPage } from "@/lib/content";
import { telHref } from "@/lib/phone";

export function LocationView({ loc, bodyHtml }: { loc: LocationPage; bodyHtml: string }) {
  const a = loc.address;
  return (
    <article>
      <section className="wrap pt-14 pb-10 md:pt-20">
        <p className="eyebrow">{loc.eyebrow}</p>
        <h1 className="page-title">{loc.heading}</h1>
      </section>
      <section className="wrap grid gap-10 pb-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <img src={loc.image} alt={loc.imageAlt} width={1200} height={800} className="rounded-2xl w-full h-auto" />
        </div>
        <div className="lg:col-span-5">
          <div className="facts">
            <h2 className="facts-heading">{loc.factsHeading}</h2>
            <dl>
              <div className="fact">
                <dt>Address</dt>
                <dd className="fact-address">
                  {a.street}
                  {a.suite ? `, ${a.suite}` : ""}
                  <br />
                  {a.city}, {a.state} {a.zip}
                </dd>
              </div>
              <div className="fact">
                <dt>Phone</dt>
                <dd className="fact-phone">
                  <a href={telHref(loc.phone)}>{loc.phone}</a>
                </dd>
              </div>
              <div className="fact">
                <dt>Hours</dt>
                <dd>
                  <table className="hours">
                    <tbody>
                      {loc.hours.map((h) => (
                        <tr key={h.days}>
                          <th scope="row">{h.days}</th>
                          <td>{h.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </dd>
              </div>
              <div className="fact">
                <dt>Parking</dt>
                <dd className="fact-parking">{loc.parking}</dd>
              </div>
            </dl>
            <a href={loc.cta.href} className="btn mt-6 w-full justify-center">
              {loc.cta.label}
            </a>
          </div>
        </div>
      </section>
      <div className="content-body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </article>
  );
}
