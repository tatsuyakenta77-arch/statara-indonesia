// Statara — canvas charts. No library: every chart is drawn by hand so the
// first load stays small and the site works with no network request.

const INK = '#17324f';
const MUTED = '#5d7186';
const GRID = '#dfe7ee';
const TEAL = '#0e7a6d';
const AMBER = '#d97706';
const BLUE = '#2563eb';
const RED = '#c2410c';
const GREEN = '#15803d';

function setupCanvas(canvas, height) {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || canvas.parentElement.clientWidth || 640;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.height = height + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.font = '12px system-ui, -apple-system, "Segoe UI", sans-serif';
  return { ctx, width, height };
}

function niceMax(max) {
  const step = Math.pow(10, Math.floor(Math.log10(max)));
  const scaled = max / step;
  const nice = scaled <= 1 ? 1 : scaled <= 2 ? 2 : scaled <= 5 ? 5 : 10;
  return nice * step;
}

function drawAxes(ctx, x0, y0, x1, y1, yTicks, formatTick) {
  ctx.strokeStyle = GRID;
  ctx.fillStyle = MUTED;
  ctx.lineWidth = 1;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (const tick of yTicks) {
    const y = y0 - (tick.value / tick.max) * (y0 - y1);
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.lineTo(x1, y);
    ctx.stroke();
    ctx.fillText(formatTick(tick.value), x0 - 8, y);
  }
  ctx.strokeStyle = '#b8c6d4';
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y0);
  ctx.stroke();
}

// Line chart for a yearly series. options: {color, unit, decimals, zeroLine}
export function drawLineChart(canvas, years, values, options = {}) {
  const height = options.height || 260;
  const { ctx, width } = setupCanvas(canvas, height);
  const color = options.color || TEAL;
  const decimals = options.decimals ?? 1;
  const min = Math.min(0, ...values);
  const max = Math.max(...values);
  const top = niceMax(max - min) + min;
  const padL = 56;
  const padR = 14;
  const padT = 18;
  const padB = 28;
  const x0 = padL;
  const x1 = width - padR;
  const y0 = height - padB;
  const y1 = padT;
  const span = top - min || 1;
  const ticks = [];
  for (let i = 0; i <= 4; i++) {
    ticks.push({ value: min + ((top - min) * i) / 4, max: span });
  }
  const fmt = (v) =>
    v.toLocaleString('id-ID', { maximumFractionDigits: decimals, minimumFractionDigits: 0 });
  drawAxes(ctx, x0, y0, x1, y1, ticks, fmt);
  const px = (i) => x0 + ((x1 - x0) * i) / (years.length - 1);
  const py = (v) => y0 - ((v - min) / span) * (y0 - y1);
  if (min < 0) {
    ctx.strokeStyle = '#b8c6d4';
    ctx.beginPath();
    ctx.moveTo(x0, py(0));
    ctx.lineTo(x1, py(0));
    ctx.stroke();
  }
  // Area fill.
  ctx.beginPath();
  ctx.moveTo(px(0), y0);
  values.forEach((v, i) => ctx.lineTo(px(i), py(v)));
  ctx.lineTo(px(values.length - 1), y0);
  ctx.closePath();
  ctx.fillStyle = color + '22';
  ctx.fill();
  // Line.
  ctx.beginPath();
  values.forEach((v, i) => (i === 0 ? ctx.moveTo(px(i), py(v)) : ctx.lineTo(px(i), py(v))));
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.stroke();
  // Points + labels.
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  values.forEach((v, i) => {
    ctx.beginPath();
    ctx.arc(px(i), py(v), 3.5, 0, Math.PI * 2);
    ctx.fill();
    if (i === 0 || i === values.length - 1 || i % 3 === 0) {
      ctx.fillStyle = INK;
      ctx.fillText(fmt(v), px(i), py(v) - 8);
      ctx.fillStyle = color;
    }
  });
  // Year labels.
  ctx.fillStyle = MUTED;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  years.forEach((year, i) => {
    if (i % 2 === 0 || i === years.length - 1) ctx.fillText(String(year), px(i), y0 + 8);
  });
  canvas.setAttribute('role', 'img');
  canvas.setAttribute(
    'aria-label',
    'Grafik garis ' + years[0] + '–' + years[years.length - 1] + ': ' + fmt(values[values.length - 1]),
  );
}

// Vertical bars for a yearly series.
export function drawBarChart(canvas, years, values, options = {}) {
  const height = options.height || 260;
  const { ctx, width } = setupCanvas(canvas, height);
  const color = options.color || BLUE;
  const decimals = options.decimals ?? 1;
  const min = Math.min(0, ...values);
  const max = Math.max(...values);
  const top = niceMax(max - min) + min;
  const padL = 56;
  const padR = 14;
  const padT = 22;
  const padB = 28;
  const x0 = padL;
  const x1 = width - padR;
  const y0 = height - padB;
  const y1 = padT;
  const span = top - min || 1;
  const ticks = [];
  for (let i = 0; i <= 4; i++) ticks.push({ value: min + ((top - min) * i) / 4, max: span });
  const fmt = (v) =>
    v.toLocaleString('id-ID', { maximumFractionDigits: decimals, minimumFractionDigits: 0 });
  drawAxes(ctx, x0, y0, x1, y1, ticks, fmt);
  const slot = (x1 - x0) / years.length;
  const barW = Math.min(46, slot * 0.62);
  const py = (v) => y0 - ((v - min) / span) * (y0 - y1);
  values.forEach((v, i) => {
    const cx = x0 + slot * (i + 0.5);
    const y = py(v);
    ctx.fillStyle = v < 0 ? RED : color;
    const topY = Math.min(y, py(0));
    const h = Math.abs(py(0) - y);
    ctx.fillRect(cx - barW / 2, topY, barW, Math.max(h, 2));
    ctx.fillStyle = INK;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(fmt(v), cx, topY - 4);
  });
  ctx.fillStyle = MUTED;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  years.forEach((year, i) => {
    if (i % 2 === 0 || i === years.length - 1) ctx.fillText(String(year), x0 + slot * (i + 0.5), y0 + 8);
  });
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Grafik batang ' + years[0] + '–' + years[years.length - 1]);
}

// Horizontal bars for ranked categories: items = [{label, value}].
export function drawHBarChart(canvas, items, options = {}) {
  const rowH = options.rowHeight || 30;
  const height = items.length * rowH + 34;
  const { ctx, width } = setupCanvas(canvas, height);
  const color = options.color || TEAL;
  const decimals = options.decimals ?? 1;
  const max = Math.max(...items.map((d) => d.value));
  const labelW = options.labelWidth || 150;
  const x0 = labelW;
  const x1 = width - 52;
  const fmt = (v) =>
    v.toLocaleString('id-ID', { maximumFractionDigits: decimals, minimumFractionDigits: 0 });
  items.forEach((d, i) => {
    const y = 8 + i * rowH;
    const barH = 16;
    ctx.fillStyle = INK;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(d.label, x0 - 8, y + barH / 2);
    ctx.fillStyle = GRID;
    ctx.fillRect(x0, y, x1 - x0, barH);
    ctx.fillStyle = d.highlight ? AMBER : color;
    ctx.fillRect(x0, y, Math.max(((x1 - x0) * d.value) / max, 2), barH);
    ctx.fillStyle = INK;
    ctx.textAlign = 'left';
    ctx.fillText(fmt(d.value) + (options.suffix || ''), x1 + 6, y + barH / 2);
  });
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Grafik batang horizontal, nilai tertinggi ' + fmt(max));
}

// Donut chart for shares: items = [{name, share}].
export function drawDonut(canvas, items, options = {}) {
  const size = options.size || 220;
  const { ctx, width } = setupCanvas(canvas, size);
  const cx = 92;
  const cy = size / 2;
  const r = Math.min(84, size / 2 - 12);
  const palette = [TEAL, BLUE, AMBER, GREEN, '#7c3aed', '#db2777', '#0891b2', '#65a30d', '#94a3b8'];
  let start = -Math.PI / 2;
  items.forEach((d, i) => {
    const angle = (d.share / 100) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, start + angle);
    ctx.closePath();
    ctx.fillStyle = palette[i % palette.length];
    ctx.fill();
    start += angle;
  });
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.58, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.fillStyle = INK;
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('100%', cx, cy - 8);
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillStyle = MUTED;
  ctx.fillText('dari PDB', cx, cy + 10);
  // Legend.
  ctx.font = '12px system-ui, sans-serif';
  ctx.textAlign = 'left';
  items.forEach((d, i) => {
    const y = 14 + i * ((size - 28) / items.length);
    ctx.fillStyle = palette[i % palette.length];
    ctx.fillRect(196, y - 5, 10, 10);
    ctx.fillStyle = INK;
    const label = d.name.length > 26 ? d.name.slice(0, 25) + '…' : d.name;
    ctx.fillText(label + ' — ' + d.share.toLocaleString('id-ID') + '%', 212, y);
  });
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Diagram lingkaran pangsa sektor terhadap PDB');
}

export function drawMultiLine(canvas, years, seriesList, options = {}) {
  const height = options.height || 260;
  const { ctx, width } = setupCanvas(canvas, height);
  const decimals = options.decimals ?? 1;
  const all = seriesList.flatMap((s) => s.values);
  const min = Math.min(0, ...all);
  const max = Math.max(...all);
  const top = niceMax(max - min) + min;
  const padL = 56;
  const padR = 14;
  const padT = 30;
  const padB = 28;
  const x0 = padL;
  const x1 = width - padR;
  const y0 = height - padB;
  const y1 = padT;
  const span = top - min || 1;
  const ticks = [];
  for (let i = 0; i <= 4; i++) ticks.push({ value: min + ((top - min) * i) / 4, max: span });
  const fmt = (v) =>
    v.toLocaleString('id-ID', { maximumFractionDigits: decimals, minimumFractionDigits: 0 });
  drawAxes(ctx, x0, y0, x1, y1, ticks, fmt);
  const px = (i) => x0 + ((x1 - x0) * i) / (years.length - 1);
  const py = (v) => y0 - ((v - min) / span) * (y0 - y1);
  seriesList.forEach((s) => {
    ctx.beginPath();
    s.values.forEach((v, i) => (i === 0 ? ctx.moveTo(px(i), py(v)) : ctx.lineTo(px(i), py(v))));
    ctx.strokeStyle = s.color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.fillStyle = s.color;
    s.values.forEach((v, i) => {
      ctx.beginPath();
      ctx.arc(px(i), py(v), 3, 0, Math.PI * 2);
      ctx.fill();
    });
  });
  // Legend.
  ctx.font = '12px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  let lx = x0;
  seriesList.forEach((s) => {
    ctx.fillStyle = s.color;
    ctx.fillRect(lx, 8, 14, 4);
    ctx.fillStyle = INK;
    ctx.fillText(s.label, lx + 20, 10);
    lx += 20 + ctx.measureText(s.label).width + 24;
  });
  ctx.fillStyle = MUTED;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  years.forEach((year, i) => {
    if (i % 2 === 0 || i === years.length - 1) ctx.fillText(String(year), px(i), y0 + 8);
  });
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Grafik garis ' + seriesList.map((s) => s.label).join(' dan '));
}

export const CHART_COLORS = { teal: TEAL, amber: AMBER, blue: BLUE, red: RED, green: GREEN };
