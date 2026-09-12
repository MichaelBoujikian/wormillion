/**
 * The "ONE IN WORMILLION" burst: pixel confetti and lightning bolts thrown out
 * from a point, drawn on a canvas the UI hands in. No DOM (Spec S7) - like
 * worldRender.js, this only ever sees a canvas and a 2d context, so it can be
 * driven headlessly in tests.
 *
 * The UI decides WHEN (an answer at JACKPOT_RARITY or better) and for how long;
 * this module only knows how to throw things out of a point and let them fall.
 */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else (root.Wormillion = root.Wormillion || {}).jackpot = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';

  const isNode = typeof module === 'object' && module.exports;
  const rarity = isNode ? require('./rarity.js') : root.Wormillion.rarity;

  /** An answer this obscure (rarity, 0..1) is one in Wormillion - scoring owns the bar. */
  const JACKPOT_RARITY = rarity.JACKPOT_RARITY;
  /** How long the celebration stays up if the player doesn't answer again. */
  const HOLD_SECONDS = 10;

  const CONFETTI = ['#ffb648', '#f6ead6', '#e0705a', '#9ed45c', '#7ec8ff', '#ffcf5c', '#ff8fd8'];
  const BOLT = ['#fff6d0', '#ffe27a'];
  const GRAVITY = 55; // logical px / s^2 - chunky pixels, so gentle

  /**
   * How busy the burst is at a given moment: a big opening salvo, a lively
   * couple of seconds, then a drizzle so the overlay still feels alive for
   * the rest of the hold without becoming wallpaper.
   */
  function rates(t) {
    if (t < 1.5) return { confettiPerSec: 70, boltEvery: 0.12 };
    if (t < 6) return { confettiPerSec: 14, boltEvery: 0.55 };
    return { confettiPerSec: 5, boltEvery: 1.4 };
  }

  /**
   * @param {object} opts
   * @param {HTMLCanvasElement} opts.canvas
   * @param {() => boolean} [opts.reducedMotion]  when true, start() shows nothing moving
   * @param {() => number} [opts.rng]
   */
  function createBurst(opts) {
    const canvas = opts.canvas;
    const ctx = canvas.getContext('2d');
    const reducedMotion = opts.reducedMotion || (() => false);
    const rng = opts.rng || Math.random;

    let w = 0;
    let h = 0;
    let px = 3; // CSS pixels per logical pixel
    let origin = { x: 0, y: 0 };
    let particles = [];
    let bolts = [];
    let elapsed = 0;
    let confettiDebt = 0;
    let boltTimer = 0;
    let active = false;

    /** Size the canvas to its CSS box at a chunky pixel scale. */
    function resize(cssWidth, cssHeight, pixel) {
      px = pixel || px;
      w = Math.max(1, Math.round(cssWidth / px));
      h = Math.max(1, Math.round(cssHeight / px));
      canvas.width = w;
      canvas.height = h;
      ctx.imageSmoothingEnabled = false;
      origin = { x: w / 2, y: h / 2 };
    }

    const between = (lo, hi) => lo + rng() * (hi - lo);
    const pick = (items) => items[Math.floor(rng() * items.length)];

    function spawnConfetti(n) {
      for (let i = 0; i < n; i++) {
        // Thrown upward and outward from the text, then left to fall.
        const angle = -Math.PI / 2 + between(-1.4, 1.4);
        const speed = between(35, 130);
        particles.push({
          x: origin.x + between(-18, 18),
          y: origin.y + between(-6, 6),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: rng() < 0.3 ? 2 : 1,
          colour: pick(CONFETTI),
          life: between(1.6, 3.2),
          age: 0,
          spin: between(4, 10),
          phase: rng() * 6.28
        });
      }
    }

    /** A jagged pixel line from the text outward, with maybe one fork. */
    function spawnBolt() {
      const angle = between(0, Math.PI * 2);
      const length = between(28, Math.min(w, h) * 0.55);
      const points = [{ x: origin.x, y: origin.y }];
      let x = origin.x;
      let y = origin.y;
      const steps = Math.max(3, Math.round(length / 7));
      for (let i = 1; i <= steps; i++) {
        const along = (length / steps) * i;
        const jitter = between(-5, 5);
        x = origin.x + Math.cos(angle) * along + Math.cos(angle + Math.PI / 2) * jitter;
        y = origin.y + Math.sin(angle) * along + Math.sin(angle + Math.PI / 2) * jitter;
        points.push({ x, y });
      }
      const bolt = { points, life: between(0.1, 0.22), age: 0, colour: pick(BOLT), fork: null };
      if (rng() < 0.5) {
        // Fork off partway along, shorter and at a bent angle.
        const from = points[Math.floor(points.length / 2)];
        const forkAngle = angle + between(-0.9, 0.9);
        const forkLength = length * between(0.3, 0.5);
        const fp = [{ x: from.x, y: from.y }];
        const fs = Math.max(2, Math.round(forkLength / 7));
        for (let i = 1; i <= fs; i++) {
          const along = (forkLength / fs) * i;
          const jitter = between(-4, 4);
          fp.push({
            x: from.x + Math.cos(forkAngle) * along + Math.cos(forkAngle + Math.PI / 2) * jitter,
            y: from.y + Math.sin(forkAngle) * along + Math.sin(forkAngle + Math.PI / 2) * jitter
          });
        }
        bolt.fork = fp;
      }
      bolts.push(bolt);
    }

    /** Begin a burst centred on the canvas. Idempotent while running: restarts. */
    function start() {
      active = true;
      elapsed = 0;
      confettiDebt = 0;
      boltTimer = 0;
      particles = [];
      bolts = [];
      if (reducedMotion()) return; // the text alone is the celebration
      spawnConfetti(150);
      for (let i = 0; i < 7; i++) spawnBolt();
    }

    function stop() {
      active = false;
      particles = [];
      bolts = [];
      if (w && h) ctx.clearRect(0, 0, w, h);
    }

    function update(dt) {
      if (!active) return;
      elapsed += dt;
      if (reducedMotion()) return;

      const rate = rates(elapsed);
      confettiDebt += rate.confettiPerSec * dt;
      const due = Math.floor(confettiDebt);
      if (due > 0) {
        spawnConfetti(due);
        confettiDebt -= due;
      }
      boltTimer += dt;
      if (boltTimer >= rate.boltEvery) {
        boltTimer = 0;
        spawnBolt();
        if (elapsed < 1.5 && rng() < 0.5) spawnBolt();
      }

      for (const p of particles) {
        p.age += dt;
        p.vy += GRAVITY * dt;
        p.vx *= 1 - 0.6 * dt; // air drag, so the spray doesn't cross the whole scene
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }
      particles = particles.filter((p) => p.age < p.life && p.y < h + 4);
      for (const b of bolts) b.age += dt;
      bolts = bolts.filter((b) => b.age < b.life);
    }

    /** Bresenham in logical pixels, drawn as `size`-wide squares. */
    function pixelLine(x0, y0, x1, y1, size) {
      let ax = Math.round(x0);
      let ay = Math.round(y0);
      const bx = Math.round(x1);
      const by = Math.round(y1);
      const dx = Math.abs(bx - ax);
      const dy = -Math.abs(by - ay);
      const sx = ax < bx ? 1 : -1;
      const sy = ay < by ? 1 : -1;
      let err = dx + dy;
      for (let guard = 0; guard < 4096; guard++) {
        ctx.fillRect(ax, ay, size, size);
        if (ax === bx && ay === by) break;
        const e2 = 2 * err;
        if (e2 >= dy) { err += dy; ax += sx; }
        if (e2 <= dx) { err += dx; ay += sy; }
      }
    }

    function drawBolt(points, colour, thick) {
      ctx.fillStyle = colour;
      for (let i = 1; i < points.length; i++) {
        pixelLine(points[i - 1].x, points[i - 1].y, points[i].x, points[i].y, thick ? 2 : 1);
      }
    }

    function draw() {
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);
      if (!active) return;

      for (const b of bolts) {
        // A bolt is bright for its first flicker, then thins out.
        const fresh = b.age < b.life * 0.5;
        drawBolt(b.points, fresh ? '#ffffff' : b.colour, fresh);
        if (b.fork) drawBolt(b.fork, b.colour, false);
      }

      for (const p of particles) {
        // Blink out at the end instead of fading: no alpha, stays pixel-crisp.
        const remaining = p.life - p.age;
        if (remaining < 0.6 && Math.floor(p.age * 12) % 2 === 1) continue;
        ctx.fillStyle = p.colour;
        // Tumble: a square that squashes to a line and back.
        const t = Math.sin(p.age * p.spin + p.phase);
        const wide = Math.abs(t) > 0.5;
        const s = p.size;
        if (wide) ctx.fillRect(Math.round(p.x), Math.round(p.y), s + 1, s);
        else ctx.fillRect(Math.round(p.x), Math.round(p.y), s, s + 1);
      }
    }

    return {
      resize,
      start,
      stop,
      update,
      draw,
      get active() { return active; },
      get elapsed() { return elapsed; },
      get particleCount() { return particles.length; },
      get boltCount() { return bolts.length; }
    };
  }

  return { JACKPOT_RARITY, HOLD_SECONDS, createBurst };
});
