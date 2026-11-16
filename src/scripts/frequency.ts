// Aggregated single-machine system frequency response model.
// Swing equation with load damping, a governor feeding a reheat steam turbine,
// and an optional battery that ramps to a fixed share of demand once activated.
// All quantities in per unit on system base; integrated with fixed-step RK4.

export interface Params {
  H: number; // inertia constant, s
  dP: number; // lost generation, pu
  battery: boolean;
  tOn: number; // battery activation time after the event, s
}

const F0 = 50;
const D = 1; // load damping
const R = 0.05; // governor droop
const KM = 0.5; // share of generation that provides governor response
const TG = 0.4; // governor time constant, s
const TR = 8; // reheat time constant, s
const FH = 0.25; // high-pressure fraction
const PB = 0.03; // battery size, pu
const TB = 0.2; // battery ramp time constant, s
export const UFLS = 49.0;
export const T_END = 20;
const DT = 0.01;

export interface Result {
  t: number[];
  f: number[];
  nadir: number;
  tNadir: number;
}

export function simulate(p: Params): Result {
  const deriv = (s: number[], on: boolean) => {
    const [w, g, y, pb] = s;
    const dg = (-(KM / R) * w - g) / TG;
    const dy = (g - y) / TR;
    const pm = FH * g + (1 - FH) * y;
    const dw = (pm + pb - p.dP - D * w) / (2 * p.H);
    const dpb = ((on ? PB : 0) - pb) / TB;
    return [dw, dg, dy, dpb];
  };
  let s = [0, 0, 0, 0];
  const t: number[] = [0];
  const f: number[] = [F0];
  let nadir = F0;
  let tNadir = 0;
  const steps = Math.round(T_END / DT);
  for (let i = 1; i <= steps; i++) {
    const time = (i - 1) * DT;
    const on = p.battery && time >= p.tOn;
    const k1 = deriv(s, on);
    const k2 = deriv(s.map((v, j) => v + (DT / 2) * k1[j]), on);
    const k3 = deriv(s.map((v, j) => v + (DT / 2) * k2[j]), on);
    const k4 = deriv(s.map((v, j) => v + DT * k3[j]), on);
    s = s.map((v, j) => v + (DT / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
    const fr = F0 * (1 + s[0]);
    t.push(i * DT);
    f.push(fr);
    if (fr < nadir) {
      nadir = fr;
      tNadir = i * DT;
    }
  }
  return { t, f, nadir, tNadir };
}

/** Initial rate of change of frequency, Hz/s. */
export const rocof = (p: Params) => (-p.dP / (2 * p.H)) * F0;

export function initFrequencyDemo(root: HTMLElement) {
  const q = <T extends Element>(sel: string) => root.querySelector<T>(sel)!;
  const inputs = {
    H: q<HTMLInputElement>('[name="H"]'),
    dP: q<HTMLInputElement>('[name="dP"]'),
    battery: q<HTMLInputElement>('[name="battery"]'),
    tOn: q<HTMLInputElement>('[name="tOn"]'),
  };
  const svg = q<SVGSVGElement>('svg');
  const base = q<SVGPathElement>('[data-base]');
  const withBat = q<SVGPathElement>('[data-bat]');
  const uflsLine = q<SVGLineElement>('[data-ufls]');
  const uflsLabel = q<SVGTextElement>('[data-ufls-label]');
  const onLine = q<SVGLineElement>('[data-on]');
  const onLabel = q<SVGTextElement>('[data-on-label]');
  const yTicks = q<SVGGElement>('[data-yticks]');
  const out = {
    H: q<HTMLOutputElement>('[data-out="H"]'),
    dP: q<HTMLOutputElement>('[data-out="dP"]'),
    tOn: q<HTMLOutputElement>('[data-out="tOn"]'),
    nadirBase: q<HTMLElement>('[data-read="nadirBase"]'),
    nadirBat: q<HTMLElement>('[data-read="nadirBat"]'),
    rocof: q<HTMLElement>('[data-read="rocof"]'),
    verdict: q<HTMLElement>('[data-read="verdict"]'),
  };

  const vb = svg.viewBox.baseVal;
  const pad = { l: 52, r: 24, t: 22, b: 34 };
  const pw = vb.width - pad.l - pad.r;
  const ph = vb.height - pad.t - pad.b;
  const NS = 'http://www.w3.org/2000/svg';

  const update = () => {
    const p: Params = {
      H: Number(inputs.H.value),
      dP: Number(inputs.dP.value) / 100,
      battery: inputs.battery.checked,
      tOn: Number(inputs.tOn.value),
    };
    inputs.tOn.disabled = !p.battery;
    root.dataset.battery = String(p.battery);

    const r0 = simulate({ ...p, battery: false });
    const r1 = p.battery ? simulate(p) : r0;

    const yMax = 50.1;
    const lowest = Math.min(r0.nadir, r1.nadir, UFLS);
    const yMin = Math.min(48.4, Math.floor((lowest - 0.1) * 5) / 5);
    const X = (t: number) => pad.l + (t / T_END) * pw;
    const Y = (f: number) => pad.t + ((yMax - f) / (yMax - yMin)) * ph;
    const path = (r: Result) => {
      let d = '';
      for (let i = 0; i < r.t.length; i += 4) {
        d += `${i ? 'L' : 'M'}${X(r.t[i]).toFixed(1)} ${Y(r.f[i]).toFixed(1)}`;
      }
      return d;
    };

    base.setAttribute('d', path(r0));
    withBat.setAttribute('d', p.battery ? path(r1) : '');

    const yu = Y(UFLS);
    uflsLine.setAttribute('y1', String(yu));
    uflsLine.setAttribute('y2', String(yu));
    uflsLabel.setAttribute('y', String(yu - 7));

    const xo = X(p.tOn);
    onLine.setAttribute('x1', String(xo));
    onLine.setAttribute('x2', String(xo));
    onLabel.setAttribute('x', String(xo + 6));

    yTicks.replaceChildren();
    for (let v = Math.ceil(yMin * 2) / 2; v <= 50.001; v += 0.5) {
      const y = Y(v);
      const line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', String(pad.l));
      line.setAttribute('x2', String(vb.width - pad.r));
      line.setAttribute('y1', String(y));
      line.setAttribute('y2', String(y));
      line.setAttribute('class', 'grid-line');
      const text = document.createElementNS(NS, 'text');
      text.setAttribute('x', String(pad.l - 10));
      text.setAttribute('y', String(y + 4));
      text.setAttribute('text-anchor', 'end');
      text.setAttribute('class', 'tick');
      text.textContent = v.toFixed(1);
      yTicks.append(line, text);
    }

    out.H.value = `${p.H.toFixed(1)} s`;
    out.dP.value = `${Math.round(p.dP * 100)} %`;
    out.tOn.value = `${p.tOn.toFixed(1)} s`;
    out.nadirBase.textContent = `${r0.nadir.toFixed(2)} Hz`;
    out.nadirBat.textContent = p.battery ? `${r1.nadir.toFixed(2)} Hz` : 'off';
    out.rocof.textContent = `${rocof(p).toFixed(2)} Hz/s`;
    const final = p.battery ? r1.nadir : r0.nadir;
    const safe = final >= UFLS;
    out.verdict.textContent = safe
      ? 'Frequency stays above 49.0 Hz. No load is shed.'
      : 'Frequency crosses 49.0 Hz. The first stage of load shedding trips.';
    root.dataset.safe = String(safe);
  };

  Object.values(inputs).forEach((el) => el.addEventListener('input', update));
  update();
}
