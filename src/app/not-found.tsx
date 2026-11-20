export const metadata = { title: "Page not found | Larkmoor Family Dentistry" };

export default function NotFound() {
  return (
    <section className="wrap py-28 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="page-title mx-auto max-w-2xl">We could not find that page</h1>
      <p className="mx-auto mt-5 max-w-xl text-lg text-ink-2">
        The link may be old, or the page may have moved. You can head back to the home page or book a visit.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <a href="/" className="btn">Go to the home page</a>
        <a href="/book" className="btn btn-secondary">Book a visit</a>
      </div>
    </section>
  );
}
