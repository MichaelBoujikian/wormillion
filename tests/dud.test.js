const test = require('node:test');
const assert = require('node:assert');
const dud = require('../src/js/dud.js');
const worldRender = require('../src/js/worldRender.js');

/** Same no-op 2d context stand-in the renderer tests use: no DOM needed. */
function stubCanvas() {
  const ctx = new Proxy(
    {},
    {
      get(target, prop) {
        if (prop === 'createImageData') {
          return (w, h) => ({ data: new Uint8ClampedArray(w * h * 4), width: w, height: h });
        }
        if (prop in target) return target[prop];
        return () => {};
      },
      set(target, prop, value) {
        target[prop] = value;
        return true;
      }
    }
  );
  return { width: 0, height: 0, getContext: () => ctx };
}

function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function drip(options = {}) {
  const d = dud.createDrip({ canvas: stubCanvas(), rng: seeded(7), ...options });
  d.resize(480, 520, 3);
  return d;
}

test('0% is the bar, held for ten seconds like the jackpot', () => {
  assert.strictEqual(dud.DUD_RARITY, 0.005);
  assert.strictEqual(dud.HOLD_SECONDS, 10);
});

test('starting the mess hangs drips from the words and brings the flies', () => {
  const d = drip();
  assert.strictEqual(d.active, false);
  d.start({ x: 30, y: 60, width: 100, height: 40 });
  assert.strictEqual(d.active, true);
  assert.ok(d.dripCount >= 16, `opening gush: ${d.dripCount} drips`);
  assert.strictEqual(d.flyCount, 5);
  assert.ok(d.wispCount >= 3);
});

test('drips stretch, let go and fall off the bottom; the ooze keeps up through the hold', () => {
  const d = drip();
  d.start();
  const opening = d.dripCount;
  let seen = 0;
  for (let i = 0; i < 600; i++) {
    d.update(1 / 60);
    d.draw();
    if (i % 60 === 0 && d.dripCount > 0) seen += 1;
  }
  assert.ok(d.elapsed >= 9.9, `simulated ${d.elapsed.toFixed(1)}s`);
  assert.ok(d.dripCount > 0, 'still oozing at the end of the hold');
  assert.ok(d.dripCount < opening + 40, `the opening gush has fallen away (${d.dripCount} left)`);
  assert.strictEqual(seen, 10, 'something dripping at every checkpoint');
  assert.strictEqual(d.flyCount, 5, 'the flies never leave');

  d.stop();
  assert.strictEqual(d.active, false);
  assert.strictEqual(d.dripCount, 0);
  assert.strictEqual(d.flyCount, 0);
});

test('reduced motion shows the words alone: nothing drips, nothing buzzes', () => {
  const d = drip({ reducedMotion: () => true });
  d.start();
  for (let i = 0; i < 120; i++) d.update(1 / 60);
  assert.strictEqual(d.active, true, 'still counts as showing');
  assert.strictEqual(d.dripCount, 0);
  assert.strictEqual(d.flyCount, 0);
});

test('a mess that was never sized draws nothing and does not throw', () => {
  const d = dud.createDrip({ canvas: stubCanvas() });
  d.start();
  d.update(0.1);
  d.draw();
  d.stop();
});

test('the worm can be left rotten and comes back on reset', () => {
  const r = worldRender.createRenderer({
    canvas: stubCanvas(),
    terrainCanvas: stubCanvas(),
    carveCanvas: stubCanvas(),
    rng: seeded(3)
  });
  r.resize(480, 520, 3);
  r.reset();
  assert.strictEqual(r.rotten, false);
  r.setRotten(true);
  assert.strictEqual(r.rotten, true);
  // It still digs, still draws.
  r.diveTo(40, {});
  for (let i = 0; i < 90; i++) r.update(1 / 30);
  r.draw();
  assert.ok(r.depth > 39);
  r.setRotten(false);
  assert.strictEqual(r.rotten, false);
  r.setRotten(true);
  r.reset();
  assert.strictEqual(r.rotten, false, 'a new run starts with a healthy worm');
});
