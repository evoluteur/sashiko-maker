// Sashiko Maker -- Japanese running-stitch patterns, stitched out line by line.
//
// Every pattern is a set of lines (straight, zigzag or curved) drawn on the
// cloth, grouped in "passes": in sashiko you stitch all the lines going one
// way, then all the lines going the next way, and so on. Each line is then
// cut into running stitches: a stitch on top, a gap where the thread runs
// under the cloth, a stitch, a gap... The stitches are fitted to every
// straight run of a line, so a stitch always ends right on a corner.

const S = 720; // drawing size
const M = 30; // hem: the pattern stays inside [M, S - M]

const PATTERNS = {
  seigaiha: {
    name: "Seigaiha",
    jp: "青海波",
    en: "Blue ocean waves",
    passes: ["the waves, row by row"],
    about:
      "Overlapping fans of concentric arcs, like waves rolling in one behind the other. The waves go on forever, so seigaiha wishes for peace, calm and good fortune that lasts.",
  },
  asanoha: {
    name: "Asanoha",
    jp: "麻の葉",
    en: "Hemp leaf",
    passes: ["the vertical lines", "the rising diagonals", "the falling diagonals", "the leaves"],
    about:
      "Six-pointed stars of diamond leaves. Hemp grows tall, straight and fast, so asanoha was stitched on babies' clothes to wish them health and growth, and to keep evil away.",
  },
  shippo: {
    name: "Shippō",
    jp: "七宝",
    en: "Seven treasures",
    passes: ["the horizontal waves", "the vertical waves"],
    about:
      "Circles that overlap a quarter of each of their neighbors, leaving petals and four-pointed stars. The seven treasures of Buddhism, linked without end: harmony and good relationships.",
  },
  kikko: {
    name: "Kikkō",
    jp: "亀甲",
    en: "Tortoise shell",
    passes: ["the zigzags", "the short verticals"],
    about:
      "A honeycomb of hexagons like the plates of a tortoise shell. The tortoise is said to live ten thousand years, so kikkō is a wish for a long life.",
  },
  yamagata: {
    name: "Yamagata",
    jp: "山形",
    en: "Mountains",
    passes: ["the mountain ranges"],
    about:
      "Rows of zigzags stacked like distant mountain ranges. One of the simplest patterns, and one of the best to learn the rhythm of the stitches and the turns.",
  },
  higaki: {
    name: "Higaki",
    jp: "檜垣",
    en: "Cypress fence",
    passes: ["the horizontal lines", "the zigzag columns"],
    about:
      "The woven hinoki fence of shrines and gardens: slats that lean one way in a row and the other way in the next, a herringbone of protection.",
  },
  kagome: {
    name: "Kagome",
    jp: "籠目",
    en: "Basket weave",
    passes: ["the horizontal lines", "the rising lines", "the falling lines"],
    about:
      "The eyes of a woven bamboo basket: three sets of straight lines make hexagons ringed by six-pointed stars, a sign that was hung over doorways to keep evil away.",
  },
  hitomezashi: {
    name: "Hitomezashi",
    jp: "一目刺し",
    en: "One-stitch",
    passes: ["the rows", "the columns"],
    random: true,
    about:
      "Every stitch is exactly one square of the grid long, and each row and column starts either on a stitch or on a gap. Rows and columns alone build the staircase pattern. Try New pattern for another one.",
  },
};

const CLOTHS = {
  indigo: { name: "Indigo", bg: "#1f2d4d", thread: "#f3eee2" },
  night: { name: "Deep indigo", bg: "#131b30", thread: "#e9e1cc" },
  red: { name: "Red thread", bg: "#1f2d4d", thread: "#d9533b" },
  undyed: { name: "Undyed", bg: "#ece4d2", thread: "#24345a" },
  persimmon: { name: "Persimmon", bg: "#a8532e", thread: "#f6eedd" },
  sumi: { name: "Sumi black", bg: "#1d1c1b", thread: "#e8dfca" },
};

const opts = {
  pattern: "asanoha",
  size: 60, // pattern unit, px on a 720 drawing
  stitch: 9, // stitch length, px
  gap: 55, // gap, % of a stitch
  width: 2.6, // thread width, px
  cloth: "indigo",
  chalk: false,
  texture: true,
  wobble: true,
  speed: 5,
  seed: 1,
};
let lines = []; // [{ pts, pass, fixed? }]
let stitches = []; // per line: array of polylines
let anim = null;

const $e = (id) => document.getElementById(id);
const f1 = (v) => Math.round(v * 10) / 10;

function rng(s) {
  s = s % 2147483647 || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ---------------------------------------------------------------- clipping

const LO = M, HI = S - M;
const inside = ([x, y]) => x >= LO - 1e-6 && x <= HI + 1e-6 && y >= LO - 1e-6 && y <= HI + 1e-6;

// Liang-Barsky: the part of segment a-b inside the hem, or null
function clipSeg(a, b) {
  let t0 = 0, t1 = 1;
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const p = [-dx, dx, -dy, dy];
  const q = [a[0] - LO, HI - a[0], a[1] - LO, HI - a[1]];
  for (let i = 0; i < 4; i++) {
    if (Math.abs(p[i]) < 1e-12) {
      if (q[i] < 0) return null;
    } else {
      const r = q[i] / p[i];
      if (p[i] < 0) t0 = Math.max(t0, r);
      else t1 = Math.min(t1, r);
    }
  }
  if (t0 > t1 - 1e-9) return null;
  return [
    [a[0] + t0 * dx, a[1] + t0 * dy, t0 > 0],
    [a[0] + t1 * dx, a[1] + t1 * dy, t1 < 1],
  ];
}

// cut a polyline where it leaves the hem; returns the pieces inside
function clipLine(pts) {
  const out = [];
  let cur = null;
  for (let i = 0; i < pts.length - 1; i++) {
    const c = clipSeg(pts[i], pts[i + 1]);
    if (!c) {
      if (cur) out.push(cur), (cur = null);
      continue;
    }
    const [a, b] = c;
    if (!cur || a[2]) {
      if (cur) out.push(cur);
      cur = [[a[0], a[1]]];
    }
    cur.push([b[0], b[1]]);
    if (b[2]) out.push(cur), (cur = null);
  }
  if (cur) out.push(cur);
  return out.filter((l) => polyLen(l) > 2);
}

const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
function polyLen(p) {
  let L = 0;
  for (let i = 1; i < p.length; i++) L += dist(p[i - 1], p[i]);
  return L;
}

// ---------------------------------------------------------------- patterns
// Each returns lines as { pts, pass } in drawing coordinates (before clipping).

const arc = (cx, cy, r, a0, a1, step = 3) => {
  const n = Math.max(2, Math.ceil((Math.abs(a1 - a0) * r) / step));
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
};

function seigaiha(u) {
  const R = u, out = [];
  const rows = [];
  for (let j = -2; j * (R / 2) < S + 2 * R; j++) {
    const cy = j * (R / 2), off = j % 2 ? R : 0, row = [];
    for (let x = -2 * R + off; x < S + 2 * R; x += 2 * R) row.push([x, cy]);
    rows.push(row);
  }
  // a fan is hidden wherever a fan of a later row (drawn in front) covers it
  const covered = (p, j) => {
    for (let k = j + 1; k <= j + 3 && k < rows.length; k++)
      for (const [cx, cy] of rows[k]) if (Math.abs(p[0] - cx) < R && (p[0] - cx) ** 2 + (p[1] - cy) ** 2 < R * R - 0.5) return true;
    return false;
  };
  rows.forEach((row, j) => {
    for (const [cx, cy] of row) {
      for (let k = 4; k >= 1; k--) {
        const r = (R * k) / 4;
        const pts = arc(cx, cy, r, Math.PI, 2 * Math.PI, 2);
        let run = [];
        for (const p of pts) {
          if (covered(p, j)) {
            if (run.length > 1) out.push({ pts: run, pass: 0 });
            run = [];
          } else run.push(p);
        }
        if (run.length > 1) out.push({ pts: run, pass: 0 });
      }
    }
  });
  return out;
}

// lines of a family across the drawing: direction angle th, spacing d, offset c
function family(th, d, c, pass) {
  const out = [];
  const ux = Math.cos(th), uy = Math.sin(th);
  let nx = -uy, ny = ux; // normal, pointing right / down so lines come in reading order
  if (nx + ny * 1.01 < 0) (nx = -nx), (ny = -ny);
  const C = S / 2, L = S;
  const k0 = Math.floor((-L - c) / d), k1 = Math.ceil((L - c) / d);
  for (let k = k0; k <= k1; k++) {
    const o = c + k * d;
    const px = C + nx * o, py = C + ny * o;
    out.push({ pts: [[px - ux * L, py - uy * L], [px + ux * L, py + uy * L]], pass });
  }
  return out;
}

// join segments that share ends into longer lines (smallest turn first)
function chain(segs, pass) {
  const key = (p) => Math.round(p[0] * 4) + "," + Math.round(p[1] * 4);
  const at = new Map();
  segs.forEach((s, i) => {
    for (const e of [0, 1]) {
      const k = key(s[e]);
      if (!at.has(k)) at.set(k, []);
      at.get(k).push(i);
    }
  });
  const used = new Uint8Array(segs.length);
  const out = [];
  const extend = (pts) => {
    for (;;) {
      const end = pts[pts.length - 1], prev = pts[pts.length - 2];
      const dir = Math.atan2(end[1] - prev[1], end[0] - prev[0]);
      let best = -1, bestTurn = 1e9, bestPt = null;
      for (const i of at.get(key(end)) || []) {
        if (used[i]) continue;
        const s = segs[i];
        const nxt = key(s[0]) === key(end) ? s[1] : s[0];
        let t = Math.abs(Math.atan2(nxt[1] - end[1], nxt[0] - end[0]) - dir);
        if (t > Math.PI) t = 2 * Math.PI - t;
        if (t < bestTurn) (bestTurn = t), (best = i), (bestPt = nxt);
      }
      if (best < 0 || bestTurn > 2.2) return;
      used[best] = 1;
      pts.push(bestPt);
    }
  };
  // sort so chains start from the top left, in reading order
  const order = segs.map((_, i) => i).sort((a, b) => {
    const A = segs[a], B = segs[b];
    return Math.min(A[0][1], A[1][1]) - Math.min(B[0][1], B[1][1]) || Math.min(A[0][0], A[1][0]) - Math.min(B[0][0], B[1][0]);
  });
  for (const i of order) {
    if (used[i]) continue;
    used[i] = 1;
    const pts = [segs[i][0], segs[i][1]];
    extend(pts);
    pts.reverse();
    extend(pts);
    out.push({ pts, pass });
  }
  return out;
}

function asanoha(u) {
  const a = u, h = (a * Math.sqrt(3)) / 2;
  const out = [
    ...family(Math.PI / 2, h, 0, 0),
    ...family(-Math.PI / 6, a * Math.cos(Math.PI / 6), 0, 1),
    ...family(Math.PI / 6, a * Math.cos(Math.PI / 6), 0, 2),
  ];
  // lattice points: columns x = C + i h, rows offset by a/2 on odd columns
  const C = S / 2, segs = [];
  const n = Math.ceil(S / h / 2) + 2;
  const P = (i, j) => [C + i * h, C + j * a + (Math.abs(i) % 2 ? a / 2 : 0)];
  for (let i = -n; i < n; i++) {
    for (let j = -n; j <= n; j++) {
      // two triangles per lattice cell between columns i and i+1
      const odd = Math.abs(i) % 2;
      const L0 = P(i, j), L1 = P(i, j + 1);
      const R0 = P(i + 1, odd ? j + 1 : j);
      const R1 = P(i + 1, odd ? j : j - 1);
      for (const tri of [[L0, L1, R0], [L0, R1, R0]]) {
        const g = [(tri[0][0] + tri[1][0] + tri[2][0]) / 3, (tri[0][1] + tri[1][1] + tri[2][1]) / 3];
        if (g[0] < -a || g[0] > S + a || g[1] < -a || g[1] > S + a) continue;
        for (const v of tri) segs.push([g, v]);
      }
    }
  }
  return out.concat(chain(segs, 3));
}

function shippo(u) {
  const a = u, out = [];
  const C = S / 2, n = Math.ceil(S / a / 2) + 2;
  for (const vertical of [false, true]) {
    for (let k = -n; k < n; k++) {
      const y0 = C + (k + 0.5) * a;
      for (const phase of [0, 1]) {
        let pts = [];
        for (let i = -n; i < n; i++) {
          const x0 = C + i * a, cx = x0 + a / 2;
          const up = (i + phase) % 2 === 0;
          const seg = up
            ? arc(cx, y0 + a / 2, a / Math.SQRT2, (-3 * Math.PI) / 4, -Math.PI / 4, 2)
            : arc(cx, y0 - a / 2, a / Math.SQRT2, (3 * Math.PI) / 4, Math.PI / 4, 2);
          pts = pts.concat(pts.length ? seg.slice(1) : seg);
        }
        if (vertical) pts = pts.map(([x, y]) => [y, x]);
        out.push({ pts, pass: vertical ? 1 : 0 });
      }
    }
  }
  return out;
}

function kikko(u) {
  const s = u * 0.62, w = Math.sqrt(3) * s, out = [];
  const C = S / 2;
  const nr = Math.ceil(S / (1.5 * s) / 2) + 2, nc = Math.ceil(S / w / 2) + 2;
  for (let r = -nr; r <= nr; r++) {
    const cy = C + r * 1.5 * s, off = Math.abs(r) % 2 ? w / 2 : 0;
    const zig = [];
    for (let c = -nc; c <= nc; c++) {
      const cx = C + c * w + off;
      zig.push([cx - w / 2, cy - s / 2], [cx, cy - s]);
      out.push({ pts: [[cx - w / 2, cy - s / 2], [cx - w / 2, cy + s / 2]], pass: 1 });
    }
    out.push({ pts: zig, pass: 0 });
  }
  return out;
}

function yamagata(u) {
  const out = [], C = S / 2;
  const sp = u / 2, amp = u * 0.6, per = u * 1.2;
  const n = Math.ceil(S / sp / 2) + 4;
  for (let k = -n; k <= n; k++) {
    const y = C + k * sp, pts = [];
    for (let x = -per; x <= S + per; x += per / 2) {
      const up = Math.round(x / (per / 2)) % 2 === 0;
      pts.push([x, y + (up ? -amp / 2 : amp / 2)]);
    }
    out.push({ pts, pass: 0 });
  }
  return out;
}

function higaki(u) {
  const out = family(0, u, 0, 0);
  const C = S / 2, n = Math.ceil(S / u / 2) + 2;
  for (let k = -2 * n; k <= 2 * n; k++) {
    const x = C + (k * u) / 2, pts = [];
    for (let j = -n; j <= n; j++) pts.push([x + (j % 2 ? u : 0), C + j * u]);
    out.push({ pts, pass: 1 });
  }
  return out;
}

function kagome(u) {
  const d = u * 0.6;
  return [...family(0, d, 0, 0), ...family(Math.PI / 3, d, 0, 1), ...family((2 * Math.PI) / 3, d, d / 2, 2)];
}

function hitomezashi(u) {
  const a = u / 3, out = [];
  const rand = rng(opts.seed);
  const n = Math.ceil((HI - LO) / a);
  const a0 = LO + ((HI - LO) - n * a) / 2;
  for (const vertical of [false, true]) {
    for (let k = 1; k < n; k++) {
      const c = a0 + k * a;
      const pts = vertical ? [[c, a0], [c, a0 + n * a]] : [[a0, c], [a0 + n * a, c]];
      out.push({ pts, pass: vertical ? 1 : 0, fixed: { len: a, start: rand() < 0.5 ? 0 : 1 } });
    }
  }
  return out;
}

const MAKERS = { seigaiha, asanoha, shippo, kikko, yamagata, higaki, kagome, hitomezashi };

// ---------------------------------------------------------------- stitches

// split a line at sharp corners: stitches are fitted to each straight run
function runs(pts) {
  const out = [];
  let cur = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    cur.push(pts[i]);
    if (i < pts.length - 1) {
      const a = Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0]);
      const b = Math.atan2(pts[i + 1][1] - pts[i][1], pts[i + 1][0] - pts[i][0]);
      let t = Math.abs(b - a);
      if (t > Math.PI) t = 2 * Math.PI - t;
      if (t > 0.35) out.push(cur), (cur = [pts[i]]);
    }
  }
  out.push(cur);
  return out;
}

// the part of a polyline between lengths t0 and t1
function slice(pts, cum, t0, t1) {
  const at = (t) => {
    let i = 1;
    while (i < cum.length - 1 && cum[i] < t) i++;
    const k = (t - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
    return [pts[i - 1][0] + k * (pts[i][0] - pts[i - 1][0]), pts[i - 1][1] + k * (pts[i][1] - pts[i - 1][1])];
  };
  const out = [at(t0)];
  for (let i = 1; i < pts.length - 1; i++) if (cum[i] > t0 && cum[i] < t1) out.push(pts[i]);
  out.push(at(t1));
  return out;
}

function makeStitches(line, rand) {
  const out = [];
  const jit = () => (opts.wobble ? (rand() - 0.5) * 0.9 : 0);
  for (const run of runs(line.pts)) {
    const cum = [0];
    for (let i = 1; i < run.length; i++) cum.push(cum[i - 1] + dist(run[i - 1], run[i]));
    const len = cum[cum.length - 1];
    if (len < 1) continue;
    let spans = [];
    if (line.fixed) {
      const a = line.fixed.len;
      for (let t = line.fixed.start * a; t < len - 1; t += 2 * a) spans.push([t + 0.8, Math.min(len, t + a) - 0.8]);
    } else {
      const L = opts.stitch, G = (opts.stitch * opts.gap) / 100;
      if (len < L * 0.7) spans.push([len * 0.12, len * 0.88]);
      else {
        const n = Math.max(1, Math.round((len + G) / (L + G)));
        const k = len / (n * L + (n - 1) * G);
        for (let i = 0; i < n; i++) spans.push([i * (L + G) * k, (i * (L + G) + L) * k]);
      }
    }
    for (const [t0, t1] of spans) {
      const p = slice(run, cum, Math.max(0, t0 + jit() * 0.6), Math.min(len, t1 + jit() * 0.6));
      if (opts.wobble) {
        const dx = jit() * 0.5, dy = jit() * 0.5;
        p.forEach((q) => ((q[0] += dx), (q[1] += dy)));
      }
      out.push(p);
    }
  }
  return out;
}

function generate() {
  stopAnim();
  const raw = MAKERS[opts.pattern](opts.size);
  lines = [];
  for (const l of raw) for (const pts of clipLine(l.pts)) lines.push({ pts, pass: l.pass, fixed: l.fixed });
  // stitch the passes in order, and each pass from the top left
  lines.forEach((l, i) => (l.i = i));
  lines.sort((a, b) => a.pass - b.pass || a.i - b.i);
  const rand = rng(opts.seed * 7 + 3);
  stitches = lines.map((l) => makeStitches(l, rand));
}

// ---------------------------------------------------------------- drawing

const pathD = (sts) =>
  sts.map((p) => "M" + p.map((q) => f1(q[0]) + " " + f1(q[1])).join("L")).join("");

function svgMarkup(forExport, upTo) {
  const C = CLOTHS[opts.cloth];
  const tex = opts.texture
    ? `<filter id="weave" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9 0.06" numOctaves="2" seed="4" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.16 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
       <filter id="weave2" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.06 0.9" numOctaves="2" seed="9" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.07 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>`
    : "";
  let body = `<rect width="${S}" height="${S}" fill="${C.bg}"/>`;
  if (opts.texture)
    body += `<rect width="${S}" height="${S}" fill="${C.bg}" filter="url(#weave)"/><rect width="${S}" height="${S}" fill="${C.bg}" filter="url(#weave2)"/>`;
  // the hem
  body += `<rect x="${M / 2}" y="${M / 2}" width="${S - M}" height="${S - M}" fill="none" stroke="${C.thread}" stroke-opacity="0.22" stroke-width="1" stroke-dasharray="6 5"/>`;
  if (opts.chalk)
    body += `<g fill="none" stroke="${C.thread}" stroke-opacity="0.2" stroke-width="0.8">${lines
      .map((l) => `<path d="M${l.pts.map((q) => f1(q[0]) + " " + f1(q[1])).join("L")}"/>`)
      .join("")}</g>`;
  const n = upTo === undefined ? lines.length : upTo;
  body += `<g id="threads" fill="none" stroke="${C.thread}" stroke-width="${opts.width}" stroke-linecap="round" stroke-linejoin="round">`;
  for (let i = 0; i < n; i++) body += `<path d="${pathD(stitches[i])}"/>`;
  body += "</g>";
  if (!forExport) body += `<g id="needle" visibility="hidden"><line x1="0" y1="0" x2="26" y2="-26" stroke="#d6dbe2" stroke-width="2.2" stroke-linecap="round"/><circle cx="23" cy="-23" r="1.6" fill="${C.bg}"/></g>`;
  const ns = forExport ? ' xmlns="http://www.w3.org/2000/svg"' : "";
  return `<svg${ns} class="plain" viewBox="0 0 ${S} ${S}" width="${forExport ? S : "100%"}" height="${forExport ? S : "100%"}" role="img" aria-label="${PATTERNS[opts.pattern].name} sashiko"><defs>${tex}</defs>${body}</svg>`;
}

function render() {
  stopAnim();
  $e("sashiko").innerHTML = svgMarkup(false);
  renderInfo();
}

function renderInfo() {
  const P = PATTERNS[opts.pattern];
  const nSt = stitches.reduce((a, s) => a + s.length, 0);
  const lenPx = lines.reduce((a, l) => a + polyLen(l.pts), 0);
  const cm = (lenPx * 40) / (S - 2 * M); // on a 40 cm square of cloth
  const tile = (k, v) => `<div class="stat"><div class="k">${k}</div><div class="v">${v}</div></div>`;
  $e("stats").innerHTML =
    tile("Pattern", `${P.name} <span class="jp">${P.jp}</span>`) +
    tile("Passes", P.passes.length) +
    tile("Lines", lines.length.toLocaleString()) +
    tile("Stitches", nSt.toLocaleString()) +
    tile("Thread*", `${(cm / 100).toFixed(1)} m`);
  $e("pattern-about").innerHTML = `<strong>${P.name}</strong> <span class="jp">${P.jp}</span>, “${P.en}”. ${P.about}`;
  $e("new").hidden = !P.random;
  $e("stitch-note").textContent = "";
}

function stopAnim() {
  if (anim) cancelAnimationFrame(anim.raf);
  anim = null;
  const b = $e("stitch");
  if (b) b.textContent = "Stitch it";
}

function stitchIt() {
  if (anim) {
    stopAnim();
    render();
    return;
  }
  $e("sashiko").innerHTML = svgMarkup(false, 0);
  const g = $e("sashiko").querySelector("#threads");
  const needle = $e("sashiko").querySelector("#needle");
  const P = PATTERNS[opts.pattern];
  const note = $e("stitch-note");
  let li = 0, si = 0, acc = 0, last = performance.now(), path = null, pass = -1;
  $e("stitch").textContent = "Stop";
  anim = {};
  const step = (now) => {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    acc += dt * (4 + opts.speed * opts.speed * 4); // stitches per second
    while (acc >= 1 && li < lines.length) {
      acc -= 1;
      if (!path) {
        path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        g.appendChild(path);
        if (lines[li].pass !== pass) {
          pass = lines[li].pass;
          note.textContent = `Pass ${pass + 1} of ${P.passes.length}: ${P.passes[pass]}.`;
        }
      }
      si++;
      const sts = stitches[li];
      path.setAttribute("d", pathD(sts.slice(0, si)));
      const tip = sts[Math.max(0, si - 1)];
      if (tip) {
        const q = tip[tip.length - 1];
        needle.setAttribute("transform", `translate(${f1(q[0])} ${f1(q[1])})`);
        needle.setAttribute("visibility", "visible");
      }
      if (si >= sts.length) (li++), (si = 0), (path = null);
    }
    if (li >= lines.length) {
      needle.setAttribute("visibility", "hidden");
      note.textContent = "Done. Knot the thread on the back, and press the cloth.";
      anim = null;
      $e("stitch").textContent = "Stitch it";
      return;
    }
    anim.raf = requestAnimationFrame(step);
  };
  anim.raf = requestAnimationFrame(step);
}

// ---------------------------------------------------------------- address & storage

function writeUrl() {
  const q = new URLSearchParams();
  q.set("p", opts.pattern);
  q.set("u", opts.size);
  q.set("s", opts.stitch);
  q.set("g", opts.gap);
  q.set("c", opts.cloth);
  if (PATTERNS[opts.pattern].random) q.set("seed", opts.seed);
  history.replaceState(null, "", "#" + q.toString());
}
function readUrl() {
  const q = new URLSearchParams(location.hash.slice(1));
  if (!q.get("p")) return;
  const num = (k, lo, hi, def) => {
    const v = parseFloat(q.get(k));
    return isNaN(v) ? def : Math.max(lo, Math.min(hi, v));
  };
  if (PATTERNS[q.get("p")]) opts.pattern = q.get("p");
  if (CLOTHS[q.get("c")]) opts.cloth = q.get("c");
  opts.size = num("u", 30, 120, opts.size);
  opts.stitch = num("s", 3, 20, opts.stitch);
  opts.gap = num("g", 20, 120, opts.gap);
  opts.seed = num("seed", 1, 2147483646, opts.seed);
}
const LS = "sashiko-maker";
function save() {
  try {
    const { width, chalk, texture, wobble, speed } = opts;
    localStorage.setItem(LS, JSON.stringify({ width, chalk, texture, wobble, speed }));
  } catch (e) {}
}
function load() {
  try {
    Object.assign(opts, JSON.parse(localStorage.getItem(LS)) || {});
  } catch (e) {}
}

// ---------------------------------------------------------------- controls

function chips(id, items, key, onPick, label = (v) => v.name) {
  const el = $e(id);
  el.innerHTML = Object.entries(items)
    .map(([k, v]) => `<button type="button" data-k="${k}" aria-pressed="${opts[key] === k}">${label(v)}</button>`)
    .join("");
  el.onclick = (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    opts[key] = b.dataset.k;
    el.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b));
    onPick();
  };
}
function rangeCtl(id, key, fmt, onChange) {
  const el = $e(id);
  el.value = opts[key];
  const show = () => ($e(id + "-val").textContent = fmt(opts[key]));
  show();
  el.addEventListener("input", () => {
    opts[key] = +el.value;
    show();
    onChange();
  });
}
function update() {
  generate();
  render();
  writeUrl();
  save();
}
function restyle() {
  render();
  writeUrl();
  save();
}

function download(name, href) {
  const a = document.createElement("a");
  a.download = name;
  a.href = href;
  a.click();
}
const fileName = () => "sashiko-" + opts.pattern;
function saveSvg() {
  download(fileName() + ".svg", URL.createObjectURL(new Blob([svgMarkup(true)], { type: "image/svg+xml" })));
}
function savePng() {
  const img = new Image();
  img.onload = () => {
    const c = document.createElement("canvas");
    c.width = c.height = 2000;
    c.getContext("2d").drawImage(img, 0, 0, 2000, 2000);
    download(fileName() + ".png", c.toDataURL("image/png"));
  };
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgMarkup(true));
}

function initSashiko() {
  load();
  readUrl();
  chips("pattern-chips", PATTERNS, "pattern", update, (v) => `${v.name}<small>${v.en}</small>`);
  chips("cloth-chips", CLOTHS, "cloth", restyle);
  rangeCtl("size", "size", (v) => `${((v * 40) / (S - 2 * M)).toFixed(1)} cm`, update);
  rangeCtl("stitch", "stitch", (v) => `${((v * 400) / (S - 2 * M)).toFixed(1)} mm`, update);
  rangeCtl("gap", "gap", (v) => `${v}%`, update);
  rangeCtl("width", "width", (v) => v.toFixed(1), restyle);
  rangeCtl("speed", "speed", (v) => v, () => {});
  for (const k of ["chalk", "texture", "wobble"]) {
    $e("o-" + k).checked = opts[k];
    $e("o-" + k).addEventListener("change", (e) => {
      opts[k] = e.target.checked;
      k === "wobble" ? update() : restyle();
    });
  }
  $e("stitch").addEventListener("click", stitchIt);
  $e("new").addEventListener("click", () => {
    opts.seed = Math.floor(Math.random() * 2147483645) + 1;
    update();
  });
  $e("export-png").addEventListener("click", savePng);
  $e("export-svg").addEventListener("click", saveSvg);
  update();
}
