/**
 * The dig scene: procedural pixel-art strata, a segmented worm, a tunnel that
 * accumulates across a run, and dirt particles.
 *
 * Everything is drawn at a low internal resolution and upscaled by CSS with
 * image-rendering: pixelated, which is what gives the retro look without
 * shipping a single sprite sheet. This module never touches `document` - ui.js
 * creates the canvases and hands them in.
 */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else (root.Wormillion = root.Wormillion || {}).worldRender = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';

  const isNode = typeof module === 'object' && module.exports;
  const strata = isNode ? require('./strata.js') : root.Wormillion.strata;

  const PX_PER_UNIT = 4; // art pixels per depth unit
  const SKY_H = 112; // art pixels of sky above depth 0
  const MAX_UNITS = 760; // a little headroom past the 700 budget
  const WORLD_H = SKY_H + MAX_UNITS * PX_PER_UNIT;
  const TUNNEL_R = 6;

  // ---- tiny 3x5 bitmap font, so labels stay crisp at 1:1 art pixels ---------
  const GLYPHS = {
    A: [2, 5, 7, 5, 5], B: [6, 5, 6, 5, 6], C: [3, 4, 4, 4, 3], D: [6, 5, 5, 5, 6],
    E: [7, 4, 6, 4, 7], F: [7, 4, 6, 4, 4], G: [3, 4, 5, 5, 3], H: [5, 5, 7, 5, 5],
    I: [7, 2, 2, 2, 7], J: [1, 1, 1, 5, 2], K: [5, 5, 6, 5, 5], L: [4, 4, 4, 4, 7],
    M: [5, 7, 7, 5, 5], N: [5, 7, 7, 7, 5], O: [2, 5, 5, 5, 2], P: [6, 5, 6, 4, 4],
    Q: [2, 5, 5, 7, 3], R: [6, 5, 6, 5, 5], S: [3, 4, 2, 1, 6], T: [7, 2, 2, 2, 2],
    U: [5, 5, 5, 5, 7], V: [5, 5, 5, 5, 2], W: [5, 5, 7, 7, 5], X: [5, 5, 2, 5, 5],
    Y: [5, 5, 2, 2, 2], Z: [7, 1, 2, 4, 7],
    0: [7, 5, 5, 5, 7], 1: [2, 6, 2, 2, 7], 2: [7, 1, 7, 4, 7], 3: [7, 1, 7, 1, 7],
    4: [5, 5, 7, 1, 1], 5: [7, 4, 7, 1, 7], 6: [7, 4, 7, 5, 7], 7: [7, 1, 1, 1, 1],
    8: [7, 5, 7, 5, 7], 9: [7, 5, 7, 1, 7],
    ' ': [0, 0, 0, 0, 0], '-': [0, 0, 7, 0, 0], '.': [0, 0, 0, 0, 2], '/': [1, 1, 2, 4, 4]
  };

  function drawText(ctx, text, x, y, color) {
    ctx.fillStyle = color;
    let cx = x;
    for (const raw of String(text).toUpperCase()) {
      const glyph = GLYPHS[raw] || GLYPHS[' '];
      for (let row = 0; row < 5; row++) {
        const bits = glyph[row];
        for (let col = 0; col < 3; col++) {
          if (bits & (4 >> col)) ctx.fillRect(cx + col, y + row, 1, 1);
        }
      }
      cx += 4;
    }
    return cx - x;
  }

  // ---- deterministic value noise -------------------------------------------
  function hash2(x, y, seed) {
    let h = (x | 0) * 374761393 + (y | 0) * 668265263 + (seed | 0) * 1442695040;
    h = (h ^ (h >>> 13)) * 1274126177;
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }

  const hex = (c) => [
    parseInt(c.slice(1, 3), 16),
    parseInt(c.slice(3, 5), 16),
    parseInt(c.slice(5, 7), 16)
  ];

  const mix = (a, b, t) => [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t)
  ];

  /**
   * @param {object} opts
   * @param {HTMLCanvasElement} opts.canvas         visible canvas
   * @param {HTMLCanvasElement} opts.terrainCanvas  offscreen, pre-rendered strata
   * @param {HTMLCanvasElement} opts.carveCanvas    offscreen, accumulated tunnel
   * @param {() => boolean} [opts.reducedMotion]
   */
  function createRenderer(opts) {
    const canvas = opts.canvas;
    const terrain = opts.terrainCanvas;
    const carve = opts.carveCanvas;
    const reducedMotion = opts.reducedMotion || (() => false);

    const ctx = canvas.getContext('2d');
    const tctx = terrain.getContext('2d');
    const cctx = carve.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    let W = 0;
    let H = 0;
    let depth = 0; // rendered depth (animates toward target)
    let target = 0;
    let diveFrom = 0;
    let diveElapsed = 0;
    let diveDuration = 0;
    // True from diveTo() until arrival. Deliberately NOT derived from
    // `depth < target`: a zero-distance dive (the cohort's most famous entry
    // digs nothing) still has to run its beat and fire onArrive, or the round
    // never advances.
    let diving = false;
    let path = []; // depths already carved, in dig order
    let particles = [];
    let time = 0;
    let shake = 0;
    let onArrive = null;

    // Horizontal wander is stored as a FRACTION of the canvas width and the
    // tunnel is stored as a list of depths, so a resize re-carves a tunnel that
    // still lines up with the worm.
    const wormFrac = (d) => 0.5 + Math.sin(d * 0.021) * 0.16 + Math.sin(d * 0.077 + 1.3) * 0.05;
    const wormX = (d) => wormFrac(d) * W;
    const worldY = (d) => SKY_H + d * PX_PER_UNIT;

    // ---- terrain pre-render -------------------------------------------------
    function paintSky() {
      const top = hex('#7cc7e8');
      const low = hex('#cfe9f2');
      for (let y = 0; y < SKY_H - 14; y++) {
        const c = mix(top, low, y / (SKY_H - 14));
        tctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
        tctx.fillRect(0, y, W, 1);
      }

      // sun
      tctx.fillStyle = '#ffe9a3';
      tctx.fillRect(W - 26, 14, 12, 12);
      tctx.fillRect(W - 24, 12, 8, 16);
      tctx.fillStyle = '#fff6d0';
      tctx.fillRect(W - 24, 16, 6, 6);

      // clouds
      for (let i = 0; i < 4; i++) {
        const cx = Math.floor(hash2(i, 7, 3) * (W - 40)) + 6;
        const cy = 14 + Math.floor(hash2(i, 11, 5) * 44);
        tctx.fillStyle = '#ffffff';
        tctx.fillRect(cx, cy, 20, 5);
        tctx.fillRect(cx + 4, cy - 3, 12, 4);
        tctx.fillStyle = '#dbeef7';
        tctx.fillRect(cx, cy + 4, 20, 2);
      }

      // distant hills
      tctx.fillStyle = '#5f8f4e';
      for (let x = 0; x < W; x++) {
        const h = 10 + Math.round(Math.sin(x * 0.06) * 4 + Math.sin(x * 0.017 + 2) * 5);
        tctx.fillRect(x, SKY_H - 14 - h, 1, h + 2);
      }

      // grass line + tufts
      tctx.fillStyle = '#4e7f38';
      tctx.fillRect(0, SKY_H - 14, W, 8);
      tctx.fillStyle = '#63a049';
      tctx.fillRect(0, SKY_H - 14, W, 3);
      for (let x = 0; x < W; x += 3) {
        if (hash2(x, 91, 2) > 0.55) {
          const h = 2 + Math.floor(hash2(x, 92, 4) * 3);
          tctx.fillStyle = '#79bd58';
          tctx.fillRect(x, SKY_H - 14 - h, 1, h);
        }
      }
      // a couple of trees, for scale
      for (const tx of [Math.round(W * 0.16), Math.round(W * 0.78)]) {
        tctx.fillStyle = '#4a3220';
        tctx.fillRect(tx, SKY_H - 26, 3, 12);
        tctx.fillStyle = '#3f7a34';
        tctx.fillRect(tx - 5, SKY_H - 38, 13, 8);
        tctx.fillRect(tx - 3, SKY_H - 43, 9, 6);
        tctx.fillStyle = '#4f9440';
        tctx.fillRect(tx - 3, SKY_H - 37, 6, 3);
      }
      // soil lip under the grass
      tctx.fillStyle = '#5b3d23';
      tctx.fillRect(0, SKY_H - 6, W, 6);
    }

    function paintGround() {
      const image = tctx.createImageData(W, WORLD_H - SKY_H);
      const data = image.data;
      const bands = strata.STRATA.map((b) => ({
        base: hex(b.base), dark: hex(b.dark), light: hex(b.light), grit: hex(b.grit)
      }));

      for (let y = 0; y < WORLD_H - SKY_H; y++) {
        const d = y / PX_PER_UNIT;
        const index = Math.min(bands.length - 1, Math.floor(d / strata.BAND_HEIGHT));
        const band = bands[index];
        const next = bands[Math.min(bands.length - 1, index + 1)];
        // dithered 40-unit blend into the next band so boundaries read as
        // geology, not as a stripe
        const into = d - index * strata.BAND_HEIGHT;
        const blend = into > strata.BAND_HEIGHT - 40 ? (into - (strata.BAND_HEIGHT - 40)) / 40 : 0;

        for (let x = 0; x < W; x++) {
          const n = hash2(x, y, 1);
          const patch = 0.9 + hash2(x >> 3, y >> 3, 77) * 0.2;
          const useNext = blend > 0 && hash2(x, y, 9) < blend * 0.85;
          const b = useNext ? next : band;
          let rgb;
          if (n < 0.06) rgb = b.grit;
          else if (n < 0.32) rgb = b.dark;
          else if (n < 0.86) rgb = b.base;
          else rgb = b.light;

          // horizontal sediment banding
          const stripe = Math.sin(y * 0.09 + Math.sin(x * 0.01) * 2) * 0.5 + 0.5;
          const k = (0.9 + stripe * 0.16) * patch;
          const i = (y * W + x) * 4;
          data[i] = Math.min(255, rgb[0] * k);
          data[i + 1] = Math.min(255, rgb[1] * k);
          data[i + 2] = Math.min(255, rgb[2] * k);
          data[i + 3] = 255;
        }
      }
      tctx.putImageData(image, 0, SKY_H);
    }

    function paintFeatures() {
      const bandOf = (d) => strata.strataFor(d);

      // pebbles and boulders
      for (let i = 0; i < Math.round((W * MAX_UNITS) / 620); i++) {
        const x = Math.floor(hash2(i, 1, 21) * W);
        const d = hash2(i, 2, 22) * MAX_UNITS;
        const band = bandOf(d);
        const y = worldY(d);
        const w = 2 + Math.floor(hash2(i, 3, 23) * 4);
        const h = 2 + Math.floor(hash2(i, 4, 24) * 3);
        tctx.fillStyle = band.grit;
        tctx.fillRect(x, y, w + 1, h + 1);
        tctx.fillStyle = band.speck;
        tctx.fillRect(x, y, w, h);
        tctx.fillStyle = band.light;
        tctx.fillRect(x, y, Math.max(1, w - 2), 1);
      }

      // roots, near the surface only
      for (let i = 0; i < Math.round(W / 22); i++) {
        const x = Math.floor(hash2(i, 5, 31) * W);
        let y = SKY_H + Math.floor(hash2(i, 6, 32) * 26);
        const len = 6 + Math.floor(hash2(i, 7, 33) * 22);
        tctx.fillStyle = '#3c5a26';
        let dx = x;
        for (let s = 0; s < len; s++) {
          tctx.fillRect(dx, y, 1, 1);
          if (hash2(dx, y, 34) > 0.72) dx += hash2(dx, y, 35) > 0.5 ? 1 : -1;
          y += 1;
        }
      }

      // ore pockets and crystals, denser with depth
      for (let i = 0; i < Math.round(MAX_UNITS / 3.2); i++) {
        const d = Math.pow(hash2(i, 8, 41), 0.65) * MAX_UNITS;
        const band = bandOf(d);
        const x = Math.floor(hash2(i, 9, 42) * (W - 6)) + 3;
        const y = worldY(d);
        tctx.fillStyle = band.grit;
        tctx.fillRect(x - 1, y - 1, 5, 5);
        tctx.fillStyle = band.accent;
        tctx.fillRect(x, y, 3, 3);
        tctx.fillStyle = '#ffffff';
        tctx.globalAlpha = 0.55;
        tctx.fillRect(x, y, 1, 1);
        tctx.globalAlpha = 1;
      }

      // magma cracks, deep only
      for (let i = 0; i < 90; i++) {
        const d = 470 + hash2(i, 10, 51) * (MAX_UNITS - 470);
        const band = bandOf(d);
        let x = Math.floor(hash2(i, 11, 52) * W);
        let y = worldY(d);
        const len = 8 + Math.floor(hash2(i, 12, 53) * 26);
        for (let s = 0; s < len; s++) {
          tctx.fillStyle = s % 3 === 0 ? '#ffd451' : band.accent;
          tctx.fillRect(x, y, 1, 1 + (s % 2));
          x += hash2(x, y, 54) > 0.5 ? 1 : -1;
          y += hash2(x, y, 55) > 0.35 ? 1 : 0;
        }
      }

      // band boundaries: a rock seam plus a label
      for (const band of strata.STRATA) {
        const y = worldY(band.from);
        if (band.from > 0) {
          tctx.fillStyle = band.grit;
          tctx.fillRect(0, y - 1, W, 2);
          tctx.fillStyle = band.light;
          for (let x = 0; x < W; x += 2) tctx.fillRect(x, y + 1, 1, 1);
        }
        const label = `${band.name} ${band.from}`;
        const width = label.length * 4 + 4;
        tctx.fillStyle = 'rgba(0,0,0,0.62)';
        tctx.fillRect(3, y + 5, width, 9);
        drawText(tctx, label, 5, y + 7, band.accent);
      }
    }

    function rebuildTerrain() {
      terrain.width = W;
      terrain.height = WORLD_H;
      carve.width = W;
      carve.height = WORLD_H;
      tctx.imageSmoothingEnabled = false;
      cctx.imageSmoothingEnabled = false;
      cctx.clearRect(0, 0, W, WORLD_H);
      paintSky();
      paintGround();
      paintFeatures();
      // re-carve whatever tunnel already exists (e.g. after a resize mid-run)
      for (const d of path) stamp(d);
    }

    // ---- tunnel -------------------------------------------------------------
    // Opaque colors, not alpha: the worm stamps the same pixels many times as it
    // moves, and stacked translucent stamps would compound into a black smear.
    const shade = (color, k) => {
      const c = hex(color);
      return `rgb(${Math.round(c[0] * k)},${Math.round(c[1] * k)},${Math.round(c[2] * k)})`;
    };

    function stamp(d) {
      const x = wormX(d);
      const y = worldY(d);
      const band = strata.strataFor(d);
      cctx.globalCompositeOperation = 'source-over';
      cctx.fillStyle = shade(band.grit, 0.85);
      circle(cctx, x, y, TUNNEL_R);
      cctx.fillStyle = shade(band.grit, 0.3);
      circle(cctx, x, y, TUNNEL_R - 2);
    }

    function circle(c, cx, cy, r) {
      for (let dy = -r; dy <= r; dy++) {
        const dx = Math.floor(Math.sqrt(r * r - dy * dy));
        c.fillRect(Math.round(cx - dx), Math.round(cy + dy), dx * 2 + 1, 1);
      }
    }

    function extendPath(toDepth) {
      let d = path.length ? path[path.length - 1] : null;
      if (d === null) {
        d = 0;
        path.push(0);
        stamp(0);
      }
      while (d < toDepth) {
        d = Math.min(toDepth, d + 0.5);
        path.push(d);
        stamp(d);
      }
    }

    // ---- worm ---------------------------------------------------------------
    function drawWorm() {
      const head = { x: wormX(depth), y: worldY(depth) };
      const digging = Math.abs(target - depth) > 0.05;
      const wiggle = reducedMotion() || !digging ? 0 : 1;

      const segments = 13;
      for (let i = segments; i >= 0; i--) {
        const back = i * 3.2;
        const d = Math.max(-1.5, depth - back / PX_PER_UNIT);
        const phase = time * 9 - i * 0.55;
        const x = wormX(d) + Math.sin(phase) * 1.6 * wiggle;
        const y = worldY(d);
        const r = i === 0 ? 4 : Math.max(1.4, 3.7 - i * 0.18);

        // dark outline first, so the worm reads against pale clay and red core alike
        ctx.fillStyle = '#2a0f09';
        circle(ctx, x - camX(), y - camY(), r + 1);
        ctx.fillStyle = i % 2 === 0 ? '#b8412f' : '#d3604a';
        circle(ctx, x - camX(), y - camY(), r);
        if (i % 3 === 0) {
          ctx.fillStyle = 'rgba(255,255,255,0.18)';
          ctx.fillRect(Math.round(x - camX() - r + 1), Math.round(y - camY() - r + 1), 2, 1);
        }
      }

      // head detail
      const hx = Math.round(head.x - camX());
      const hy = Math.round(head.y - camY());
      ctx.fillStyle = '#2a0f09';
      circle(ctx, hx, hy - 1, 4.6);
      ctx.fillStyle = '#f2907c';
      circle(ctx, hx, hy - 1, 3.6);
      ctx.fillStyle = '#3a140f';
      ctx.fillRect(hx - 3, hy - 2, 2, 2);
      ctx.fillRect(hx + 2, hy - 2, 2, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(hx - 3, hy - 2, 1, 1);
      ctx.fillRect(hx + 2, hy - 2, 1, 1);

      if (digging) {
        ctx.fillStyle = '#fff1d6';
        const bob = reducedMotion() ? 0 : Math.round(Math.sin(time * 26) * 1);
        ctx.fillRect(hx - 3, hy + 3 + bob, 1, 2);
        ctx.fillRect(hx, hy + 4 + bob, 1, 2);
        ctx.fillRect(hx + 3, hy + 3 + bob, 1, 2);
      }
    }

    function spawnDirt(x, y) {
      if (reducedMotion()) return;
      const band = strata.strataFor(depth);
      for (let i = 0; i < 3; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 44,
          vy: -18 - Math.random() * 34,
          life: 0.5 + Math.random() * 0.4,
          color: [band.light, band.speck, band.dark][i % 3]
        });
      }
      if (particles.length > 160) particles = particles.slice(-160);
    }

    function camX() {
      return 0;
    }

    let camTop = 0;
    function camY() {
      return Math.round(camTop);
    }

    function updateCamera(instant, dt) {
      const want = Math.max(0, Math.min(WORLD_H - H, worldY(depth) - H * 0.42));
      if (instant || reducedMotion()) camTop = want;
      else camTop += (want - camTop) * (1 - Math.exp(-(dt || 0.016) * 11));
    }

    // ---- public API ---------------------------------------------------------
    function resize(cssW, cssH, scale) {
      const w = Math.max(80, Math.round(cssW / scale));
      const h = Math.max(80, Math.round(cssH / scale));
      if (w === W && h === H) return;
      W = w;
      H = h;
      canvas.width = W;
      canvas.height = H;
      ctx.imageSmoothingEnabled = false;
      rebuildTerrain();
      updateCamera(true);
    }

    /** Dig to a new cumulative depth. */
    function diveTo(newDepth, options = {}) {
      target = Math.min(MAX_UNITS - 6, newDepth);
      onArrive = options.onArrive || null;
      diveFrom = depth;
      diveElapsed = 0;
      // Time-based, so a slow frame rate means fewer frames, not a longer wait.
      diveDuration = Math.min(1.5, 0.45 + Math.max(0, target - depth) * 0.022);
      if (reducedMotion() || options.instant) {
        diving = false;
        depth = Math.max(depth, target);
        extendPath(depth);
        updateCamera(true);
        if (onArrive) {
          const done = onArrive;
          onArrive = null;
          done();
        }
        return;
      }
      diving = true;
    }

    function reset() {
      depth = 0;
      target = 0;
      diving = false;
      onArrive = null;
      path = [];
      particles = [];
      shake = 0;
      cctx.clearRect(0, 0, W, WORLD_H);
      extendPath(0);
      updateCamera(true);
    }

    function update(dt) {
      time += dt;
      if (diving) {
        diveElapsed += dt;
        const t = diveDuration > 0 ? Math.min(1, diveElapsed / diveDuration) : 1;
        const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
        const before = depth;
        // Never move upward: a target at or above the current depth (zero dig,
        // or the depth cap) just plays out the beat in place.
        depth = Math.max(diveFrom, diveFrom + (target - diveFrom) * eased);
        extendPath(depth);
        if (Math.floor(depth * 2) !== Math.floor(before * 2)) {
          spawnDirt(wormX(depth), worldY(depth) + 4);
        }
        if (t >= 1) {
          depth = Math.max(diveFrom, target);
          diving = false;
          shake = reducedMotion() || depth === diveFrom ? 0 : 1.6;
          if (onArrive) {
            const done = onArrive;
            onArrive = null;
            done();
          }
        }
      }

      for (const p of particles) {
        p.life -= dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 150 * dt;
      }
      particles = particles.filter((p) => p.life > 0);
      shake = Math.max(0, shake - dt * 6);
      updateCamera(false, dt);
    }

    function draw() {
      if (!W) return;
      const sx = shake > 0 ? Math.round((Math.random() - 0.5) * shake) : 0;
      const sy = shake > 0 ? Math.round((Math.random() - 0.5) * shake) : 0;

      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(terrain, 0, camY() - sy, W, H, sx, 0, W, H);
      ctx.drawImage(carve, 0, camY() - sy, W, H, sx, 0, W, H);

      // heat glow in the deep bands
      const band = strata.strataFor(depth);
      if (band.name === 'Mantle' || band.name === 'Core') {
        const flicker = reducedMotion() ? 0.07 : 0.06 + Math.sin(time * 3.1) * 0.02;
        ctx.fillStyle = `rgba(255,110,20,${flicker.toFixed(3)})`;
        ctx.fillRect(0, 0, W, H);
      }

      drawWorm();

      for (const p of particles) {
        ctx.fillStyle = p.color;
        ctx.fillRect(Math.round(p.x), Math.round(p.y - camY()), 2, 2);
      }

      // vignette
      ctx.fillStyle = 'rgba(0,0,0,0.20)';
      ctx.fillRect(0, 0, W, 3);
      ctx.fillRect(0, H - 3, W, 3);
      ctx.fillRect(0, 0, 2, H);
      ctx.fillRect(W - 2, 0, 2, H);
    }

    return {
      resize,
      reset,
      diveTo,
      update,
      draw,
      drawText,
      get depth() {
        return depth;
      },
      get animating() {
        return diving;
      }
    };
  }

  return { createRenderer, PX_PER_UNIT, SKY_H, WORLD_H, MAX_UNITS, drawText };
});
