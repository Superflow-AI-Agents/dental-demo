// Writes the raster browser icons from the logo mark in public/media/favicon.svg.
// Run once after changing the mark:  pnpm media:icons
//
// The outputs are committed. Nothing here runs at build time, so every build serves the same bytes.
//   public/favicon.ico          16, 32 and 48 px PNGs in one ICO file
//   public/apple-touch-icon.png 180 px, full bleed (iOS rounds the corners itself)
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const mark = fs.readFileSync(path.join(PUBLIC, "media", "favicon.svg"), "utf8");

// Same tooth on a square without rounded corners, for the home screen icon.
const fullBleed = mark.replace(/<rect([^>]*?) rx="[^"]*"/, "<rect$1");

async function png(svg: string, size: number): Promise<Buffer> {
  return sharp(Buffer.from(svg), { density: 72 * (size / 40) * 4 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toBuffer();
}

// ICO container with PNG entries (supported by every current browser).
function ico(images: { size: number; data: Buffer }[]): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const entries: Buffer[] = [];
  let offset = 6 + 16 * images.length;
  for (const { size, data } of images) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

async function main() {
  const sizes = [16, 32, 48];
  const images = await Promise.all(sizes.map(async (size) => ({ size, data: await png(mark, size) })));
  fs.writeFileSync(path.join(PUBLIC, "favicon.ico"), ico(images));
  fs.writeFileSync(path.join(PUBLIC, "apple-touch-icon.png"), await png(fullBleed, 180));
  console.log("wrote public/favicon.ico and public/apple-touch-icon.png");
}

main();
