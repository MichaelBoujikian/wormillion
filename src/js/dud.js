/**
 * The "0% OBSCURITY? DIG DEEPER NEXT TIME" mess: the opposite of jackpot.js.
 * Blood and worse drip from the words, stretch, break off and fall; flies
 * buzz around; sick little wisps rise. Drawn on a canvas the UI hands in - no
 * DOM (Spec S7), so it can be driven headlessly in tests like the burst.
 *
 * The UI decides WHEN (an accepted answer that reads as 0% - rarity.isDud)
 * and for how long; this module only knows how to make a mess under a box.
 */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else (root.Wormillion = root.Wormillion || {}).dud = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';

  const isNode = typeof module === 'object' && module.exports;
  const rarity = isNode ? require('./rarity.js') : root.Wormillion.rarity;

  /** An answer this common (rarity, 0..1) reads as 0% - scoring owns the bar. */
  const DUD_RARITY = rarity.DUD_RARITY;
  /** How long the shaming stays up if the player doesn't answer again. */
  const HOLD_SECONDS = 10;

  const BLOOD = ['#9b1010', '#c0161c', '#6e0b0b'];
  const MUCK = ['#6b4423', '#4a2c14', '#8a5a2b'];
  const BILE = ['#8f9a2f'];
  const FLY = '#0d0805';
  const WING = '#8f8f8f';
  const WISP = '#7f8f3a';
  const GRAVITY = 90; // logical px / s^2 - blobs are heavy
  const FLIES = 5;

  /** How busy the mess is at a given moment: a gush, then a steady ooze. */
  function rates(t) {
    if (t < 1.2) return { dripsPerSec: 14, wispEvery: 0.25 };
    if (t < 5) return { dripsPerSec: 3, wispEvery: 0.6 };
    return { dripsPerSec: 1.2, wispEvery: 1.1 };
  }

  /**
   * @param {object} opts
   * @param {HTMLCanvasElement} opts.canvas
   * @param {() => boolean} [opts.reducedMotion]  when true, start() shows nothing moving
   * @param {() => number} [opts.rng]
   */
  function createDrip(opts) {
    const canvas = opts.canvas;
    const ctx = canvas.getContext('2d');
    const reducedMotion = opts.reducedMotion || (() => false);
    const rng = opts.rng || Math.random;

    let w = 0;
    let h = 0;
    let px = 3; // CSS pixels per logical pixel
    let box = { x: 0, y: 0, width: 0, height: 0 }; // where the words are, logical px
    let drips = [];
    let flies = [];
    let wisps = [];
    let elapsed = 0;
    let dripDebt = 0;
    let wispTimer = 0;
    let active = false;

    /** Size the canvas to its CSS box at a chunky pixel scale. */
    function resize(cssWidth, cssHeight, pixel) {
      px = pixel || px;
      w = Math.max(1, Math.round(cssWidth / px));
      h = Math.max(1, Math.round(cssHeight / px));
      canvas.width = w;
      canvas.height = h;
      ctx.imageSmoothingEnabled = false;
      if (!box.width) box = defaultBox();
    }

    /** Where the words sit when nobody measured them: a band across the middle. */
    function defaultBox() {
      const width = w * 0.7;
      const height = h * 0.22;
      return { x: (w - width) / 2, y: (h - height) / 2, width, height };
    }

    const between = (lo, hi) => lo + rng() * (hi - lo);
    const pick = (items) => items[Math.floor(rng() * items.length)];
    const colour = () => {
      const roll = rng();
      return pick(roll < 0.45 ? BLOOD : roll < 0.9 ? MUCK : BILE);
    };

    /** A drip hangs from the bottom edge of the words, stretches, then lets go. */
    function spawnDrips(n) {
      const bottom = box.y + box.height - 1;
      for (let i = 0; i < n; i++) {
        drips.push({
          x: Math.round(box.x + rng() * box.width),
          top: bottom,
          len: 0,
          maxLen: between(6, 30),
          speed: between(5, 16), // px/s while stretching
          width: rng() < 0.4 ? 3 : 2, // chunky: these are logical pixels, ~3 CSS px each
          colour: colour(),
          falling: false,
          blobY: 0,
          vy: 0,
          age: 0
        });
      }
    }

    function spawnFlies() {
      flies = [];
      for (let i = 0; i < FLIES; i++) {
        const anchor = { x: box.x + rng() * box.width, y: box.y + rng() * box.height };
        flies.push({ x: anchor.x, y: anchor.y, anchor, phase: rng() * 6.28, speed: between(2.5, 4.5) });
      }
    }

    function spawnWisp() {
      wisps.push({
        x: box.x + rng() * box.width,
        y: box.y + between(0, 3),
        phase: rng() * 6.28,
        life: between(1.2, 2.2),
        age: 0
      });
    }

    /**
     * Begin the mess under a box (logical px), or under the default band.
     * Idempotent while running: restarts.
     */
    function start(textBox) {
      active = true;
      elapsed = 0;
      dripDebt = 0;
      wispTimer = 0;
      drips = [];
      wisps = [];
      flies = [];
      box = textBox && textBox.width > 0 ? textBox : defaultBox();
      if (reducedMotion()) return; // the words alone are the shaming
      spawnDrips(16);
      spawnFlies();
      for (let i = 0; i < 3; i++) spawnWisp();
    }

    function stop() {
      active = false;
      drips = [];
      flies = [];
      wisps = [];
      if (w && h) ctx.clearRect(0, 0, w, h);
    }

    function update(dt) {
      if (!active) return;
      elapsed += dt;
      if (reducedMotion()) return;

      const rate = rates(elapsed);
      dripDebt += rate.dripsPerSec * dt;
      const due = Math.floor(dripDebt);
      if (due > 0) {
        spawnDrips(due);
        dripDebt -= due;
      }
      wispTimer += dt;
      if (wispTimer >= rate.wispEvery) {
        wispTimer = 0;
        spawnWisp();
      }

      for (const d of drips) {
        d.age += dt;
        if (!d.falling) {
          d.len += d.speed * dt;
          if (d.len >= d.maxLen) {
            // Let go: the blob falls, the streak recedes.
            d.falling = true;
            d.blobY = d.top + d.len;
            d.vy = between(0, 12);
          }
        } else {
          d.vy += GRAVITY * dt;
          d.blobY += d.vy * dt;
          d.len = Math.max(0, d.len - 10 * dt);
        }
      }
      // Gone once the blob is off the bottom and the streak has receded.
      drips = drips.filter((d) => !d.falling || d.blobY < h + 4 || d.len > 0);

      for (const f of flies) {
        f.phase += dt * f.speed;
        // A jittery loop around the anchor, never far from the words.
        f.x += Math.cos(f.phase * 3.1) * 18 * dt + (rng() - 0.5) * 30 * dt + (f.anchor.x - f.x) * 0.9 * dt;
        f.y += Math.sin(f.phase * 2.3) * 12 * dt + (rng() - 0.5) * 30 * dt + (f.anchor.y - f.y) * 0.9 * dt;
      }

      for (const s of wisps) {
        s.age += dt;
        s.y -= 9 * dt;
      }
      wisps = wisps.filter((s) => s.age < s.life);
    }

    function draw() {
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);
      if (!active) return;

      for (const s of wisps) {
        // A wobbling 1px wisp that thins to nothing: sick air.
        if (Math.floor(s.age * 10) % 3 === 2) continue;
        ctx.fillStyle = WISP;
        const wobble = Math.round(Math.sin(s.age * 7 + s.phase) * 2);
        ctx.fillRect(Math.round(s.x + wobble), Math.round(s.y), 1, 2);
      }

      for (const d of drips) {
        ctx.fillStyle = d.colour;
        // The streak, hanging from the words.
        if (d.len > 0) ctx.fillRect(d.x, Math.round(d.top), d.width, Math.round(d.len));
        // The blob at the end: fatter, and fatter still as it stretches.
        const blobSize = d.width + (d.len > d.maxLen * 0.6 ? 3 : 2);
        const by = d.falling ? d.blobY : d.top + d.len;
        ctx.fillRect(d.x - Math.floor((blobSize - d.width) / 2), Math.round(by), blobSize, blobSize);
      }

      for (const f of flies) {
        const x = Math.round(f.x);
        const y = Math.round(f.y);
        ctx.fillStyle = FLY;
        ctx.fillRect(x, y, 2, 2);
        // Wings flicker on alternate frames.
        if (Math.floor(elapsed * 30) % 2 === 0) {
          ctx.fillStyle = WING;
          ctx.fillRect(x - 1, y - 1, 1, 1);
          ctx.fillRect(x + 2, y - 1, 1, 1);
        }
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
      get dripCount() { return drips.length; },
      get flyCount() { return flies.length; },
      get wispCount() { return wisps.length; }
    };
  }

  return { DUD_RARITY, HOLD_SECONDS, createDrip };
});
