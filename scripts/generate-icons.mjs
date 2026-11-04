// Generates the PWA / favicon PNGs in public/ from code (no image tools needed).
// Usage: node scripts/generate-icons.mjs   (2026-11-04)
import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const SUPERSAMPLE = 4;

const COLORS = {
    background: [28, 28, 30],
    display: [58, 58, 60],
    key: [99, 99, 102],
    accent: [255, 149, 0],
};

// Layout in unit coordinates (0..1) inside the maskable safe zone.
const SHAPES = [
    { x: 0.2, y: 0.2, w: 0.6, h: 0.16, r: 0.04, color: COLORS.display },
    ...[0, 1, 2].flatMap((row) => [0, 1, 2].map((col) => ({
        x: 0.2 + col * 0.21,
        y: 0.42 + row * 0.13,
        w: 0.18,
        h: 0.1,
        r: 0.03,
        color: col === 2 ? COLORS.accent : COLORS.key,
    }))),
];

function insideRoundRect(px, py, { x, y, w, h, r }) {
    if (px < x || px > x + w || py < y || py > y + h) return false;
    const cx = Math.min(Math.max(px, x + r), x + w - r);
    const cy = Math.min(Math.max(py, y + r), y + h - r);
    return (px - cx) ** 2 + (py - cy) ** 2 <= r * r;
}

function colorAt(u, v, rounded) {
    if (rounded && !insideRoundRect(u, v, { x: 0, y: 0, w: 1, h: 1, r: 0.22 })) return null;
    const shape = SHAPES.find((s) => insideRoundRect(u, v, s));
    return shape ? shape.color : COLORS.background;
}

function render(size, rounded) {
    const rgba = Buffer.alloc(size * size * 4);
    const n = SUPERSAMPLE * SUPERSAMPLE;
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            let r = 0, g = 0, b = 0, a = 0;
            for (let sy = 0; sy < SUPERSAMPLE; sy++) {
                for (let sx = 0; sx < SUPERSAMPLE; sx++) {
                    const c = colorAt((x + (sx + 0.5) / SUPERSAMPLE) / size, (y + (sy + 0.5) / SUPERSAMPLE) / size, rounded);
                    if (c) { r += c[0]; g += c[1]; b += c[2]; a += 255; }
                }
            }
            const i = (y * size + x) * 4;
            const covered = a / 255;
            rgba[i] = covered ? Math.round(r / covered) : 0;
            rgba[i + 1] = covered ? Math.round(g / covered) : 0;
            rgba[i + 2] = covered ? Math.round(b / covered) : 0;
            rgba[i + 3] = Math.round(a / n);
        }
    }
    return rgba;
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
});

function crc32(buf) {
    let c = 0xffffffff;
    for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body));
    return Buffer.concat([len, body, crc]);
}

function encodePng(size, rgba) {
    const header = Buffer.alloc(13);
    header.writeUInt32BE(size, 0);
    header.writeUInt32BE(size, 4);
    header[8] = 8; // bit depth
    header[9] = 6; // RGBA
    const raw = Buffer.alloc(size * (size * 4 + 1));
    for (let y = 0; y < size; y++) {
        raw[y * (size * 4 + 1)] = 0; // filter: none
        rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
    }
    return Buffer.concat([
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
        chunk('IHDR', header),
        chunk('IDAT', deflateSync(raw, { level: 9 })),
        chunk('IEND', Buffer.alloc(0)),
    ]);
}

const OUTPUTS = [
    { file: 'pwa-192x192.png', size: 192, rounded: true },
    { file: 'pwa-512x512.png', size: 512, rounded: true },
    { file: 'maskable-icon-512x512.png', size: 512, rounded: false },
    { file: 'apple-touch-icon.png', size: 180, rounded: false },
    { file: 'favicon-32x32.png', size: 32, rounded: true },
];

mkdirSync(OUT_DIR, { recursive: true });
for (const { file, size, rounded } of OUTPUTS) {
    writeFileSync(join(OUT_DIR, file), encodePng(size, render(size, rounded)));
    console.log(`wrote public/${file}`);
}
