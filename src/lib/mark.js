// The Lydion mark: a column carrying a phi, inside a disc.
// Geometry was measured from the original 1962 px artwork (logo_02.png) so the
// vector version lines up with it. Coordinates are in that 1962 unit box.

export const MARK_BOX = 1962;
const C = 979.5; // vertical axis of the column

/** @typedef {{ x: number, y: number, w: number, h: number }} Rect */

/** @param {number} x0 @param {number} x1 @param {number} y0 @param {number} y1 @returns {Rect} */
const rect = (x0, x1, y0, y1) => ({ x: x0, y: y0, w: x1 - x0, h: y1 - y0 });

export const FULL = {
  ring: { cx: 981, cy: 981, r: 974.5 },
  capital: [
    rect(457.5, 1499.5, 269.5, 374.5),
    rect(551.5, 1405.5, 374.5, 455.5),
    rect(609.5, 1347.5, 455.5, 526.5),
  ],
  shaft: [
    [745.6, 526.5],
    [2 * C - 745.6, 526.5],
    [2 * C - 662.8, 1429.5],
    [662.8, 1429.5],
  ],
  base: [
    rect(609.5, 1347.5, 1429.5, 1499.5),
    rect(551.5, 1405.5, 1499.5, 1581.5),
    rect(457.5, 1499.5, 1581.5, 1677.5),
  ],
  phi: { cx: 977.5, cy: 977.5, scale: 1 },
};

// Fewer, chunkier steps so the mark still reads at 16 to 40 px.
export const COMPACT = {
  ring: { cx: 981, cy: 981, r: 930 },
  capital: [rect(430, 1530, 300, 430), rect(590, 1370, 430, 540)],
  shaft: [
    [740, 540],
    [2 * C - 740, 540],
    [2 * C - 655, 1420],
    [655, 1420],
  ],
  base: [rect(590, 1370, 1420, 1530), rect(430, 1530, 1530, 1660)],
  phi: { cx: 979.5, cy: 980, scale: 1.45 },
};

/**
 * Phi glyph (slab serif) as separate filled parts, centred on (cx, cy).
 * @param {{ cx: number, cy: number, scale: number }} p
 */
export function phiParts({ cx, cy, scale: s }) {
  const ox = 151.5 * s, oy = 91.5 * s; // bowl outer radii
  const ix = 102 * s, iy = 58.5 * s; // bowl inner radii
  const stemW = 49 * s, serifW = 126 * s, serifH = 34 * s, half = 144 * s;
  const ellipse = (/** @type {number} */ rx, /** @type {number} */ ry) =>
    `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0Z`;
  return {
    bowl: `${ellipse(ox, oy)}${ellipse(ix, iy)}`,
    stem: rect(cx - stemW / 2, cx + stemW / 2, cy - half + serifH, cy + half - serifH),
    serifTop: rect(cx - serifW / 2, cx + serifW / 2, cy - half, cy - half + serifH),
    serifBottom: rect(cx - serifW / 2, cx + serifW / 2, cy + half - serifH, cy + half),
  };
}

const r1 = (/** @type {number} */ n) => Math.round(n * 10) / 10;

/**
 * Render the mark as an SVG string.
 * variant "line": theme-aware, strokes use currentColor, fills use CSS vars.
 * variant "color": the original cream and charcoal artwork.
 * @param {{ variant?: 'line' | 'color', detail?: 'full' | 'compact', strokePx?: number, title?: string, className?: string }} [opts]
 */
export function markSvg(opts = {}) {
  const { variant = 'line', detail = 'full', strokePx, title, className = '' } = opts;
  const g = detail === 'compact' ? COMPACT : FULL;
  const color = variant === 'color';
  const line = color ? '#535353' : 'currentColor';
  const disc = color ? '#f7f4ef' : 'var(--mark-disc, transparent)';
  const body = color ? '#f4ede3' : 'var(--mark-body, transparent)';
  const glyph = color ? '#535353' : 'var(--mark-glyph, currentColor)';
  // Stroke widths: in artwork units by default, or fixed screen px when strokePx is set.
  const nonScaling = strokePx != null ? ' vector-effect="non-scaling-stroke"' : '';
  const sw = (/** @type {number} */ units, /** @type {number} */ px) =>
    strokePx != null ? r1(px * strokePx) : detail === 'compact' ? units * 4 : units;
  const rectEl = (/** @type {Rect} */ r) =>
    `<rect x="${r1(r.x)}" y="${r1(r.y)}" width="${r1(r.w)}" height="${r1(r.h)}"/>`;
  const p = phiParts(g.phi);
  const shaft = g.shaft.map(([x, y]) => `${r1(x)},${r1(y)}`).join(' ');

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MARK_BOX} ${MARK_BOX}"${className ? ` class="${className}"` : ''} role="img"${title ? '' : ' aria-hidden="true"'}>`,
    title ? `<title>${title}</title>` : '',
    `<circle cx="${g.ring.cx}" cy="${g.ring.cy}" r="${g.ring.r}" fill="${disc}" stroke="${line}" stroke-width="${sw(13, 1)}"${nonScaling}/>`,
    // vector-effect is not inherited, so it goes on each stroked shape, not the group.
    `<g fill="${body}" stroke="${line}" stroke-width="${sw(10, 1)}" stroke-linejoin="miter">`,
    `<polygon points="${shaft}" stroke-width="${sw(6, 0.8)}"${nonScaling}/>`,
    g.capital.map((r) => rectEl(r).replace('/>', `${nonScaling}/>`)).join(''),
    g.base.map((r) => rectEl(r).replace('/>', `${nonScaling}/>`)).join(''),
    `</g>`,
    `<g fill="${glyph}">`,
    `<path fill-rule="evenodd" d="${p.bowl}"/>`,
    rectEl(p.stem),
    rectEl(p.serifTop),
    rectEl(p.serifBottom),
    `</g>`,
    `</svg>`,
  ].join('');
}
