// Form stub. Accepts any form post, stores nothing, sends nothing, and says thanks.
export async function POST() {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Thanks | Larkmoor Family Dentistry</title><style>body{font-family:system-ui,sans-serif;background:#f7f5f0;color:#13302d;display:grid;place-items:center;min-height:100vh;margin:0;padding:24px}main{max-width:480px;text-align:center}a{color:#0c5b55;font-weight:600}</style></head><body><main><h1>Thanks, we have your request</h1><p>Our front desk will reach out within one business day. If this is urgent, please call your office directly.</p><p><a href="/">Back to the home page</a></p></main></body></html>`;
  return new Response(html, { status: 200, headers: { "content-type": "text/html; charset=utf-8" } });
}
