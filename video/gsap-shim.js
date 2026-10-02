(function () {
  const pow = (p) => ({ in: (t) => Math.pow(t, p), out: (t) => 1 - Math.pow(1 - t, p), inOut: (t) => (t < 0.5 ? Math.pow(2 * t, p) / 2 : 1 - Math.pow(2 * (1 - t), p) / 2) });
  function parseEase(e) {
    if (!e || e === 'none' || e === 'linear') return e === 'none' || e === 'linear' ? (t) => t : pow(2).out;
    if (typeof e === 'function') return e;
    const m = e.match(/^(\w+)\.(in|out|inOut)(?:\(([^)]*)\))?$/);
    if (!m) return (t) => t;
    const [, n, k, a] = m;
    if (n.startsWith('power')) return pow(parseInt(n.slice(5)) + 1)[k];
    if (n === 'sine') return { in: (t) => 1 - Math.cos((t * Math.PI) / 2), out: (t) => Math.sin((t * Math.PI) / 2), inOut: (t) => -(Math.cos(Math.PI * t) - 1) / 2 }[k];
    if (n === 'back') { const s = a ? parseFloat(a) : 1.70158; return (t) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2); }
    if (n === 'elastic') return (t) => (t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin(((t * 10 - 0.75) * 2 * Math.PI) / 3) + 1);
    return (t) => t;
  }
  const TF = ['x', 'y', 'scale', 'scaleX', 'scaleY', 'rotation'];
  function tf(el) { return el._tf || (el._tf = { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 }); }
  function writeTf(el) { const t = tf(el); if (el instanceof SVGElement) el.style.transformBox = 'fill-box'; el.style.transform = `translate(${t.x}px, ${t.y}px) rotate(${t.rotation}deg) scale(${t.scaleX}, ${t.scaleY})`; }
  function getVal(el, p) {
    if (!(el instanceof Element)) return 0;
    if (p === 'scale') return tf(el).scaleX;
    if (TF.includes(p)) return tf(el)[p];
    const cs = getComputedStyle(el);
    if (p === 'autoAlpha' || p === 'opacity') return cs.visibility === 'hidden' && p === 'autoAlpha' ? 0 : parseFloat(cs.opacity);
    if (p === 'strokeDashoffset') return parseFloat(el.style.strokeDashoffset || cs.strokeDashoffset) || 0;
    const v = parseFloat(cs[p]); return isNaN(v) ? cs[p] : v;
  }
  function setVal(el, p, v) {
    if (!(el instanceof Element)) return;
    if (p === 'scale') { tf(el).scaleX = tf(el).scaleY = v; return writeTf(el); }
    if (TF.includes(p)) { tf(el)[p] = v; return writeTf(el); }
    if (p === 'transformOrigin') { el.style.transformOrigin = v; if (el instanceof SVGElement) el.style.transformBox = 'fill-box'; return; }
    if (p === 'autoAlpha') { el.style.opacity = v; el.style.visibility = v <= 0.001 ? 'hidden' : 'inherit'; return; }
    if (p === 'opacity') { el.style.opacity = v; return; }
    if (p === 'strokeDashoffset') { el.style.strokeDashoffset = v; return; }
    el.style[p] = typeof v === 'number' && !['zIndex'].includes(p) ? v + 'px' : v;
  }
  function targets(t) { if (typeof t === 'string') return [...document.querySelectorAll(t)]; if (Array.isArray(t)) return t.flatMap(targets); if (t instanceof NodeList) return [...t]; return [t]; }
  const RESERVED = ['duration', 'ease', 'stagger', 'repeat', 'yoyo', 'immediateRender', 'delay'];
  function resolve(vars, i, el, all) {
    const o = {};
    for (const k in vars) {
      if (RESERVED.includes(k)) continue;
      let v = vars[k];
      if (k === 'attr') { o.attr = {}; for (const a in v) o.attr[a] = typeof v[a] === 'function' ? v[a](i, el, all) : v[a]; continue; }
      o[k] = typeof v === 'function' ? v(i, el, all) : v;
    }
    return o;
  }
  function timeline() {
    const tweens = []; let seq = 0; let dur = 0;
    function add(tg, from, to, pos) {
      const els = targets(tg);
      const d = to.duration ?? 0.5 * (from === 'set' ? 0 : 1);
      const rep = to.repeat || 0, yoyo = !!to.yoyo, st = to.stagger || 0;
      const ease = parseEase(to.ease);
      const start = pos === undefined ? dur : pos;
      els.forEach((el, i) => {
        const tw = { el, s: start + i * st, d: from === 'set' ? 0 : d, rep, yoyo, ease, seq: seq++, to: resolve(to, i, el, els), from: from && from !== 'set' ? resolve(from, i, el, els) : null, inited: false };
        tw.total = tw.d * (rep + 1);
        dur = Math.max(dur, tw.s + tw.total);
        const imm = to.immediateRender !== undefined ? to.immediateRender : !!tw.from;
        if (tw.from && imm) apply(tw, 0, true);
        tweens.push(tw);
      });
    }
    function apply(tw, p, fromOnly) {
      const el = tw.el;
      if (!tw.inited && !fromOnly) {
        tw.start = {};
        for (const k in tw.to) {
          if (k === 'attr') { tw.start.attr = {}; for (const a in tw.to.attr) tw.start.attr[a] = tw.from && tw.from.attr && a in tw.from.attr ? tw.from.attr[a] : parseFloat(el.getAttribute(a)) || 0; continue; }
          tw.start[k] = tw.from && k in tw.from ? tw.from[k] : getVal(el, k);
        }
        tw.inited = true;
      }
      if (fromOnly) { for (const k in tw.from) { if (k === 'attr') { for (const a in tw.from.attr) el.setAttribute(a, tw.from.attr[a]); } else setVal(el, k, tw.from[k]); } return; }
      const e = tw.ease(p);
      for (const k in tw.to) {
        if (k === 'attr') { for (const a in tw.to.attr) { const s = tw.start.attr[a], t = tw.to.attr[a]; el.setAttribute(a, typeof t === 'number' ? s + (t - s) * e : t); } continue; }
        const s = tw.start[k], t = tw.to[k];
        if (typeof t === 'number' && typeof s === 'number') setVal(el, k, s + (t - s) * e);
        else setVal(el, k, p > 0 || tw.d === 0 ? t : s);
      }
    }
    return {
      fromTo(t, f, v, pos) { add(t, f, v, pos); return this; },
      to(t, v, pos) { add(t, null, v, pos); return this; },
      set(t, v, pos) { add(t, 'set', Object.assign({}, v, { duration: 0 }), pos); return this; },
      duration() { return dur; },
      seek(time) {
        const order = [...tweens].sort((a, b) => a.s - b.s || a.seq - b.seq);
        for (const tw of order) {
          if (time < tw.s) continue;
          let p;
          if (tw.d === 0) p = 1;
          else {
            const local = Math.min(time - tw.s, tw.total);
            let cyc = Math.floor(local / tw.d); let f = (local - cyc * tw.d) / tw.d;
            if (local >= tw.total) { cyc = tw.rep; f = 1; }
            p = tw.yoyo && cyc % 2 === 1 ? 1 - f : f;
          }
          apply(tw, p, false);
        }
        return this;
      },
    };
  }
  window.gsap = { timeline };
})();
