// Generates the static brand images in public/:
//   og.png               1200x630 social preview
//   favicon.svg          compact mark, original colours
//   favicon.ico          32 px PNG in an ICO container
//   apple-touch-icon.png 180 px, mark on its own cream ground
// Run with: npm run og
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import { markSvg } from '../src/lib/mark.js';
import { traceStreamline, seedOffsets, toPath } from '../src/lib/flow.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const pub = (f) => `${root}public/${f}`;
const fontFiles = [
  'Newsreader-Display.ttf',
  'Newsreader-Display-Italic.ttf',
  'IBMPlexMono-latin.ttf',
].map((f) => `${root}scripts/fonts/${f}`);

const render = (svg, width) =>
  new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Newsreader 16pt' },
  })
    .render()
    .asPng();

/** Strip the outer <svg> so a mark can be nested at a position and size. */
const nest = (svg, x, y, size) =>
  svg.replace('<svg ', `<svg x="${x}" y="${y}" width="${size}" height="${size}" `);

// Open Graph image
{
  const W = 1200;
  const H = 630;
  const cx = 905;
  const cy = 315;
  const a = 168;
  const G = 4 * Math.PI * a * 0.26;
  const lines = seedOffsets(-cy - 40, H - cy + 40, 15).map((o) =>
    traceStreamline({ x0: -30, y0: cy + o, cx, cy, a, G, h: 4, xEnd: W + 30, maxSteps: 900 }),
  );
  let accent = 0;
  let best = Infinity;
  seedOffsets(-cy - 40, H - cy + 40, 15).forEach((o, i) => {
    if (Math.abs(o + a * 0.3) < best) {
      best = Math.abs(o + a * 0.3);
      accent = i;
    }
  });
  const paths = lines
    .map((pts, i) =>
      i === accent
        ? ''
        : `<path d="${toPath(pts)}" fill="none" stroke="#ede4d3" stroke-opacity="0.16" stroke-width="1.2"/>`,
    )
    .join('');
  const accentPath = `<path d="${toPath(lines[accent])}" fill="none" stroke="#e0607e" stroke-width="2"/>`;
  // resvg has no CSS variables and ignores non-scaling strokes, so resolve colours here
  // and keep stroke widths in artwork units. Replace the var() forms before bare currentColor.
  const mark = markSvg({ variant: 'line' })
    .replaceAll('var(--mark-disc, transparent)', '#14101b')
    .replaceAll('var(--mark-body, transparent)', 'none')
    .replaceAll('var(--mark-glyph, currentColor)', '#ede4d3')
    .replaceAll('currentColor', '#ede4d3');
  const halo = 'stroke="#14101b" stroke-width="14" stroke-linejoin="round" paint-order="stroke"';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#14101b"/>
  ${paths}
  ${accentPath}
  ${nest(mark, cx - a, cy - a, 2 * a)}
  <g font-family="IBM Plex Mono" font-size="17" fill="#a79db1" letter-spacing="1.2">
    <text x="72" y="96">LYDION ENERGY  ·  ROTTERDAM, NL</text>
  </g>
  <g font-family="Newsreader 16pt" fill="#ede4d3" ${halo}>
    <text x="68" y="262" font-size="76" letter-spacing="-1.4">Software and studies</text>
    <text x="68" y="344" font-size="76" letter-spacing="-1.4">for power system</text>
    <text x="68" y="426" font-size="76" letter-spacing="-1.4" font-style="italic">dynamics.</text>
  </g>
  <g font-family="IBM Plex Mono" font-size="17" fill="#a79db1">
    <text x="72" y="548">Power system software  ·  RMS and EMT studies  ·  AI in energy</text>
  </g>
</svg>`;
  writeFileSync(pub('og.png'), render(svg, W));
}

// Favicon SVG: compact mark, original colours.
{
  const svg = markSvg({ variant: 'color', detail: 'compact' });
  writeFileSync(pub('favicon.svg'), svg);
}

// favicon.ico: a single 32 px PNG wrapped in an ICO header (supported by all current browsers).
{
  const png = render(markSvg({ variant: 'color', detail: 'compact' }), 32);
  const header = Buffer.alloc(6 + 16);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(32, 6);
  header.writeUInt8(32, 7);
  header.writeUInt8(0, 8);
  header.writeUInt8(0, 9);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18);
  writeFileSync(pub('favicon.ico'), Buffer.concat([header, png]));
}

// Apple touch icon: iOS masks the corners, so the mark sits on a full cream square.
{
  const size = 180;
  const inner = 150;
  const off = (size - inner) / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#f2ece1"/>
  ${nest(markSvg({ variant: 'color' }), off, off, inner)}
</svg>`;
  writeFileSync(pub('apple-touch-icon.png'), render(svg, size));
}

console.log('Wrote og.png, favicon.svg, favicon.ico, apple-touch-icon.png');
