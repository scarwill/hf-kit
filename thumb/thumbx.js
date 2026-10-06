// ===== thumbx.js — thumbnail extras ON TOP of the video kit (1920x1080 world coords, area 0 = the frame) =====
// Big heavy title (user's exact words), soft glow, red ring, fat arrow. Names start with t* so they never clash with the kit.
function tGlow(par, cx, cy, r, col, op = .6) { const id = 'tg' + (++_gi); const g = S('radialGradient', { id }, document.querySelector('#world defs')); S('stop', { offset: 0, 'stop-color': col, 'stop-opacity': op }, g); S('stop', { offset: .5, 'stop-color': col, 'stop-opacity': op * .3 }, g); S('stop', { offset: 1, 'stop-color': col, 'stop-opacity': 0 }, g); return S('circle', { cx, cy, r, fill: `url(#${id})` }, par); }
// lines = [['IT','HAS'],['NO','HANDS']]; hl = punch words (yellow). The line holding hl words is the biggest.
function tTitle(par, lines, { x = 90, y = 120, maxW = 900, size = 230, hl = [], hlCol = '#facc15', col = '#ffffff', panel = true } = {}) {
  const g = S('g', {}, par); const H2 = new Set(hl);
  const meas = ws => { const t = S('text', { 'font-family': 'Poppins', 'font-weight': 700, 'font-size': 100, 'letter-spacing': -2 }, g); t.textContent = ws.join(' '); const w = t.getComputedTextLength(); t.remove(); return 100 * maxW / w; };
  const fit = lines.map(meas), isH = lines.map(ws => ws.some(w => H2.has(w))), anyH = isH.some(Boolean);
  const hs = Math.min(size * 1.25, ...(anyH ? fit.filter((f, i) => isH[i]) : fit));
  const FS = fit.map((f, i) => isH[i] ? Math.min(f, hs) : Math.min(f, anyH ? hs * .8 : hs, size));
  let yy = y; const body = S('g', {}, g);
  lines.forEach((ws, li) => { const fs = FS[li]; yy = li === 0 ? y + fs * .78 : yy + FS[li - 1] * .22 + fs * .8;
    const mk = layer => { const t = S('text', { x, y: yy, 'font-family': 'Poppins', 'font-weight': 700, 'font-size': fs, 'letter-spacing': -fs * .02 }, body);
      ws.forEach((w, k) => { const ts = S('tspan', {}, t); ts.textContent = (k ? ' ' : '') + w; const c = H2.has(w) ? hlCol : col;
        if (layer === 'sh') ts.setAttribute('fill', '#000');
        else if (layer === 'out') { ts.setAttribute('fill', '#000'); ts.setAttribute('stroke', '#000'); ts.setAttribute('stroke-width', fs * .16); ts.setAttribute('stroke-linejoin', 'round'); }
        else { ts.setAttribute('fill', c); ts.setAttribute('stroke', c); ts.setAttribute('stroke-width', fs * .035); ts.setAttribute('stroke-linejoin', 'round'); } }); return t; };
    const sh = mk('sh'); sh.setAttribute('transform', `translate(${fs * .03} ${fs * .07})`); sh.setAttribute('opacity', .7); mk('out'); mk('fill'); });
  if (panel) { const b = body.getBBox(); const id = 'tp' + (++_gi); const lg = S('linearGradient', { id, x1: 0, y1: 0, x2: 1, y2: 0 }, document.querySelector('#world defs')); S('stop', { offset: 0, 'stop-color': '#020617', 'stop-opacity': .75 }, lg); S('stop', { offset: 1, 'stop-color': '#020617', 'stop-opacity': 0 }, lg);
    g.insertBefore(S('rect', { x: b.x - 120, y: b.y - 60, width: b.width + 260, height: b.height + 120, fill: `url(#${id})` }), body); }
  return g;
}
function tRing(par, cx, cy, rx, ry, col = '#ef4444', w = 18) { const g = S('g', { transform: `rotate(-8 ${cx} ${cy})` }, par); let d = '';
  for (let i = 0; i <= 64; i++) { const a = -Math.PI * .6 + i / 64 * Math.PI * 2.12, k = 1 + .05 * Math.sin(i * .35); d += (i ? 'L' : 'M') + (cx + Math.cos(a) * rx * k).toFixed(1) + ' ' + (cy + Math.sin(a) * ry * k).toFixed(1); }
  S('path', { d, stroke: '#000', 'stroke-width': w + 10, fill: 'none', 'stroke-linecap': 'round', opacity: .55 }, g); S('path', { d, stroke: col, 'stroke-width': w, fill: 'none', 'stroke-linecap': 'round' }, g); return g; }
function tArrow(par, x1, y1, x2, y2, col = '#ef4444', w = 40) { const a = Math.atan2(y2 - y1, x2 - x1), L = Math.hypot(x2 - x1, y2 - y1), hw = w * 1.35, hl = w * 1.6;
  const g = S('g', { transform: `translate(${x1} ${y1}) rotate(${a * 180 / Math.PI})`, filter: 'url(#fSh)' }, par);
  S('path', { d: `M0 ${-w / 2} L${L - hl} ${-w / 2} L${L - hl} ${-hw} L${L} 0 L${L - hl} ${hw} L${L - hl} ${w / 2} L0 ${w / 2} Z`, fill: col, stroke: '#000', 'stroke-width': 7, 'stroke-linejoin': 'round' }, g); return g; }
// keep x>1665, y>945 empty (YouTube time badge). Call tSafe() while testing to see the box.
