// Writes neutral placeholder images at their final sizes. Real Unsplash photos and AI portraits
// replace these files later under the same names and sizes (see docs/media-credits.md).
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

type Item = { file: string; w: number; h: number; label: string; kind: "photo" | "portrait" };

const services = [
  "cleanings-and-exams", "fillings", "crowns-and-bridges", "root-canals", "extractions", "dental-implants",
  "dentures", "teeth-whitening", "veneers", "clear-aligners", "kids-dentistry", "emergency-dentistry",
];
const blog = [
  "how-often-should-you-get-a-dental-cleaning", "electric-or-manual-toothbrush", "your-childs-first-dental-visit",
  "why-are-my-teeth-sensitive", "dental-implant-or-bridge", "is-teeth-whitening-safe", "tips-for-dental-anxiety",
];
const team = ["dr-helen-whitfield", "dr-marcus-oyelaran", "dr-priya-natarajan", "dr-samuel-brandt", "jenna-kowalski", "luis-ortega"];

const items: Item[] = [
  { file: "pages/home-hero.jpg", w: 1400, h: 1050, label: "Reception area", kind: "photo" },
  { file: "pages/about.jpg", w: 1200, h: 800, label: "Treatment room", kind: "photo" },
  { file: "pages/new-patients.jpg", w: 1200, h: 800, label: "Waiting area", kind: "photo" },
  { file: "pages/insurance.jpg", w: 1200, h: 800, label: "Front desk", kind: "photo" },
  { file: "pages/careers.jpg", w: 1200, h: 800, label: "Staff area", kind: "photo" },
  ...["northgate", "riverside", "old-mill"].map((s) => ({ file: `locations/${s}.jpg`, w: 1200, h: 800, label: `${s} office`, kind: "photo" as const })),
  ...services.map((s) => ({ file: `services/${s}.jpg`, w: 800, h: 500, label: s.replace(/-/g, " "), kind: "photo" as const })),
  ...blog.map((s) => ({ file: `blog/${s}.jpg`, w: 800, h: 500, label: "Blog photo", kind: "photo" as const })),
  ...team.map((s) => ({ file: `team/${s}.jpg`, w: 480, h: 600, label: "Portrait", kind: "portrait" as const })),
];

const OUT = path.join(process.cwd(), "public", "media");

function svgFor(it: Item): string {
  const { w, h } = it;
  if (it.kind === "portrait") {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e4f3ee"/><stop offset="1" stop-color="#cfe6df"/></linearGradient></defs>
      <rect width="${w}" height="${h}" fill="url(#g)"/>
      <circle cx="${w / 2}" cy="${h * 0.38}" r="${w * 0.19}" fill="#a9cdc3"/>
      <path d="M ${w * 0.16} ${h} C ${w * 0.18} ${h * 0.66}, ${w * 0.82} ${h * 0.66}, ${w * 0.84} ${h} Z" fill="#a9cdc3"/>
    </svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e9f2ef"/><stop offset="1" stop-color="#d4e6e0"/></linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    <rect x="${w * 0.08}" y="${h * 0.62}" width="${w * 0.84}" height="${h * 0.06}" rx="${h * 0.03}" fill="#c3dbd3"/>
    <rect x="${w * 0.58}" y="${h * 0.18}" width="${w * 0.26}" height="${h * 0.36}" rx="${h * 0.03}" fill="#f7f5f0" opacity="0.8"/>
    <circle cx="${w * 0.28}" cy="${h * 0.36}" r="${h * 0.12}" fill="#b8d6cd"/>
  </svg>`;
}

async function main() {
  for (const it of items) {
    const dest = path.join(OUT, it.file);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    await sharp(Buffer.from(svgFor(it))).jpeg({ quality: 82, mozjpeg: true }).withMetadata({}).toFile(dest);
  }
  // Open Graph image
  const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#0c5b55"/>
    <text x="80" y="300" font-family="Georgia, serif" font-size="72" fill="#ffffff">Larkmoor Family Dentistry</text>
    <text x="80" y="380" font-family="Arial, sans-serif" font-size="34" fill="#a8e0d2">Family dentistry in Larkmoor, Oregon</text></svg>`;
  await sharp(Buffer.from(og)).png().toFile(path.join(OUT, "og.png"));
  console.log(`wrote ${items.length + 1} images`);
}

main();
