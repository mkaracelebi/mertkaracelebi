import { traceStreamline, seedOffsets } from '../lib/flow.js';

// Live streamlines around the hero mark. The mark's box (set by CSS) defines the
// cylinder, so layout stays in the stylesheet and this script only follows it.

const TAU = Math.PI * 2;
const BREATH_PERIOD = 38; // seconds for one slow swing of the circulation
const TRACER_SPEED = 42; // px per second in the free stream
const TRACER_PERIOD = 420; // px between successive timelines
const TRACER_DUTY = 0.07;

export function initFlowField() {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-flow]');
  const mark = document.querySelector<HTMLElement>('[data-flow-obstacle]');
  if (!canvas || !mark) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer: fine)');

  let W = 0;
  let H = 0;
  let dpr = 1;
  let cx = 0;
  let cy = 0;
  let a = 0;
  let offsets: number[] = [];
  let accentIndex = 0;
  let colors = { line: '', tracer: '', accent: '' };

  let visible = true;
  let raf = 0;
  let last = 0;
  let clock = 0;
  let elapsed = 0;
  let pointerBias = 0;
  let pointerTarget = 0;

  const readColors = () => {
    const cs = getComputedStyle(canvas);
    colors = {
      line: cs.getPropertyValue('--flow-line').trim() || 'rgba(237,228,211,0.15)',
      tracer: cs.getPropertyValue('--flow-tracer').trim() || 'rgba(237,228,211,0.4)',
      accent: cs.getPropertyValue('--flow-accent').trim() || '#e0607e',
    };
  };

  const layout = () => {
    const box = canvas.getBoundingClientRect();
    const m = mark.getBoundingClientRect();
    W = box.width;
    H = box.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    cx = m.left - box.left + m.width / 2;
    cy = m.top - box.top + m.height / 2;
    a = m.width / 2 + 1;
    const spacing = W < 700 ? 13 : 16;
    offsets = seedOffsets(-cy - spacing * 3, H - cy + spacing * 3, spacing);
    // The accent line skims the upper shoulder of the disc.
    let best = Infinity;
    offsets.forEach((o, i) => {
      const d = Math.abs(o + a * 0.3);
      if (d < best) {
        best = d;
        accentIndex = i;
      }
    });
  };

  const circulation = () => {
    const gMax = 2 * TAU * a; // 4 pi a U with U = 1
    const breath = reduceMotion.matches ? 0.2 : 0.3 * Math.sin((TAU * elapsed) / BREATH_PERIOD);
    return gMax * (breath + pointerBias);
  };

  const draw = (withTracers: boolean) => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const G = circulation();
    const h = W < 700 ? 5 : 6;
    const maxSteps = Math.ceil(((W + 80) / h) * 1.8);
    const lines = offsets.map((o) =>
      traceStreamline({ x0: -40, y0: cy + o, cx, cy, a, G, h, xEnd: W + 40, maxSteps }),
    );

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    ctx.beginPath();
    lines.forEach((pts, i) => {
      if (i === accentIndex || pts.length < 6) return;
      ctx.moveTo(pts[0], pts[1]);
      for (let k = 3; k < pts.length; k += 3) ctx.lineTo(pts[k], pts[k + 1]);
    });
    ctx.strokeStyle = colors.line;
    ctx.lineWidth = 1;
    ctx.stroke();

    if (withTracers) {
      // Timelines: parcels released together upstream, drawn where they are now.
      const P = TRACER_PERIOD;
      const on = P * TRACER_DUTY;
      ctx.beginPath();
      for (const pts of lines) {
        let drawing = false;
        for (let k = 0; k < pts.length; k += 3) {
          const phase = (((pts[k + 2] - clock) % P) + P) % P;
          if (phase < on) {
            if (drawing) ctx.lineTo(pts[k], pts[k + 1]);
            else ctx.moveTo(pts[k], pts[k + 1]);
            drawing = true;
          } else {
            drawing = false;
          }
        }
      }
      ctx.strokeStyle = colors.tracer;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    const acc = lines[accentIndex];
    if (acc && acc.length > 6) {
      ctx.beginPath();
      ctx.moveTo(acc[0], acc[1]);
      for (let k = 3; k < acc.length; k += 3) ctx.lineTo(acc[k], acc[k + 1]);
      ctx.strokeStyle = colors.accent;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }
  };

  const frame = (now: number) => {
    raf = 0;
    if (!visible || reduceMotion.matches) return;
    const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
    // About 30 fps is plenty for motion this slow.
    if (dt > 0 && dt < 1 / 32) {
      raf = requestAnimationFrame(frame);
      return;
    }
    last = now;
    elapsed += dt;
    clock += dt * TRACER_SPEED;
    pointerBias += (pointerTarget - pointerBias) * Math.min(1, dt * 1.6);
    draw(true);
    raf = requestAnimationFrame(frame);
  };

  const start = () => {
    if (reduceMotion.matches) {
      draw(false);
      return;
    }
    if (!raf) {
      last = 0;
      raf = requestAnimationFrame(frame);
    }
  };

  const refresh = () => {
    layout();
    readColors();
    if (reduceMotion.matches || !raf) draw(!reduceMotion.matches);
    start();
  };

  new ResizeObserver(refresh).observe(canvas);

  new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting && document.visibilityState === 'visible';
      if (visible) start();
    },
    { threshold: 0 },
  ).observe(canvas);

  document.addEventListener('visibilitychange', () => {
    visible = document.visibilityState === 'visible';
    if (visible) start();
  });

  window.addEventListener('themechange', () => {
    readColors();
    if (reduceMotion.matches) draw(false);
  });

  reduceMotion.addEventListener('change', refresh);

  // A pointer above or below the disc tilts the circulation a little, so the wake follows you.
  const hero = canvas.parentElement;
  hero?.addEventListener('pointermove', (e) => {
    if (!finePointer.matches) return;
    const box = canvas.getBoundingClientRect();
    const y = e.clientY - box.top;
    pointerTarget = Math.max(-1, Math.min(1, (y - cy) / (H / 2))) * 0.22;
  });
  hero?.addEventListener('pointerleave', () => {
    pointerTarget = 0;
  });

  document.fonts?.ready.then(refresh);
  refresh();
}
