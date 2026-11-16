// Two-dimensional potential flow past a cylinder of radius a, with circulation G.
// Complex potential: w(z) = U (z + a^2 / z) - i G / (2 pi) ln z.
// Streamlines are traced as trajectories of the velocity field with RK4.

/**
 * Velocity at (X, Y) relative to the cylinder centre.
 * @param {number} X @param {number} Y @param {number} a @param {number} U @param {number} G
 * @returns {[number, number]}
 */
export function velocity(X, Y, a, U, G) {
  const r2 = X * X + Y * Y;
  const r4 = r2 * r2;
  const a2 = a * a;
  const k = G / (2 * Math.PI * r2);
  const u = U * (1 - (a2 * (X * X - Y * Y)) / r4) - k * Y;
  const v = (-U * 2 * a2 * X * Y) / r4 + k * X;
  return [u, v];
}

/**
 * @typedef {Object} TraceOptions
 * @property {number} x0 seed x (canvas px)
 * @property {number} y0 seed y (canvas px)
 * @property {number} cx cylinder centre x
 * @property {number} cy cylinder centre y
 * @property {number} a cylinder radius
 * @property {number} G circulation
 * @property {number} h arc-length step in px
 * @property {number} xEnd stop once x passes this
 * @property {number} maxSteps
 * @property {number} [U]
 */

/**
 * Trace one streamline with RK4 on the unit direction field (uniform arc-length steps).
 * Also accumulates travel time ds/|V| per point, so tracers can follow real fluid time.
 * Returns a flat array [x0, y0, t0, x1, y1, t1, ...].
 * @param {TraceOptions} o
 * @returns {number[]}
 */
export function traceStreamline(o) {
  const U = o.U ?? 1;
  const { cx, cy, a, G, h } = o;
  /** @param {number} x @param {number} y @returns {[number, number, number]} */
  const dir = (x, y) => {
    const [u, v] = velocity(x - cx, y - cy, a, U, G);
    const m = Math.hypot(u, v);
    return m < 1e-9 ? [0, 0, 0] : [u / m, v / m, m];
  };
  let x = o.x0;
  let y = o.y0;
  let t = 0;
  const out = [x, y, t];
  for (let i = 0; i < o.maxSteps; i++) {
    const k1 = dir(x, y);
    if (k1[2] === 0) break;
    const k2 = dir(x + (h / 2) * k1[0], y + (h / 2) * k1[1]);
    const k3 = dir(x + (h / 2) * k2[0], y + (h / 2) * k2[1]);
    const k4 = dir(x + h * k3[0], y + h * k3[1]);
    x += (h / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
    y += (h / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
    t += h / Math.max(k1[2], 0.05);
    const dx = x - cx;
    const dy = y - cy;
    if (dx * dx + dy * dy < a * a * 0.98) break;
    out.push(x, y, t);
    if (x > o.xEnd) break;
  }
  return out;
}

/**
 * Seed offsets (relative to the cylinder centre) spread evenly across a span,
 * half a spacing off the dividing streamline so no line stalls at a stagnation point.
 * @param {number} top @param {number} bottom @param {number} spacing
 */
export function seedOffsets(top, bottom, spacing) {
  /** @type {number[]} */
  const ys = [];
  const start = Math.ceil(top / spacing) * spacing + spacing / 2;
  for (let y = start; y < bottom; y += spacing) ys.push(y);
  return ys;
}

/**
 * Flat point list to an SVG path "d" string.
 * @param {number[]} pts flat [x, y, t, ...]
 * @param {number} [precision]
 */
export function toPath(pts, precision = 1) {
  const f = (/** @type {number} */ n) => n.toFixed(precision);
  let d = `M${f(pts[0])} ${f(pts[1])}`;
  for (let i = 3; i < pts.length; i += 3) d += `L${f(pts[i])} ${f(pts[i + 1])}`;
  return d;
}
