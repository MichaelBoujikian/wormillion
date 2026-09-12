const test = require('node:test');
const assert = require('node:assert');
const jackpot = require('../src/js/jackpot.js');

/** Same no-op 2d context stand-in the renderer tests use: no DOM needed. */
function stubCanvas() {
  const ctx = new Proxy(
    {},
    {
      get(target, prop) {
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

function burst(options = {}) {
  const b = jackpot.createBurst({ canvas: stubCanvas(), rng: seeded(7), ...options });
  b.resize(480, 520, 3);
  return b;
}

test('85% obscure is the bar, held for ten seconds', () => {
  assert.strictEqual(jackpot.JACKPOT_RARITY, 0.85);
  assert.strictEqual(jackpot.HOLD_SECONDS, 10);
});

test('starting a burst throws confetti and lightning out of the text', () => {
  const b = burst();
  assert.strictEqual(b.active, false);
  b.start();
  assert.strictEqual(b.active, true);
  assert.ok(b.particleCount > 100, `opening salvo: ${b.particleCount} confetti`);
  assert.ok(b.boltCount >= 5, `opening salvo: ${b.boltCount} bolts`);
});

test('the burst keeps going for the whole hold, then stops on demand', () => {
  const b = burst();
  b.start();
  // Bolts are short-lived, so seeing one at several points across the hold
  // proves they keep being re-spawned rather than just lingering.
  let boltsSeen = 0;
  for (let i = 0; i < 600; i++) {
    b.update(1 / 60);
    b.draw();
    if (i % 60 === 0 && b.boltCount > 0) boltsSeen += 1;
  }
  assert.ok(b.elapsed >= 9.9, `simulated ${b.elapsed.toFixed(1)}s`);
  assert.ok(b.particleCount > 0, 'confetti still drizzling at the end of the hold');
  assert.ok(boltsSeen >= 3, `lightning through the hold (${boltsSeen}/10 checkpoints)`);

  b.stop();
  assert.strictEqual(b.active, false);
  assert.strictEqual(b.particleCount, 0);
  assert.strictEqual(b.boltCount, 0);
});

test('confetti falls and is cleared once it leaves the scene', () => {
  const b = burst();
  b.start();
  for (let i = 0; i < 60 * 8; i++) b.update(1 / 60);
  // After eight seconds the opening 150 have long fallen off or blinked out;
  // only the drizzle remains.
  assert.ok(b.particleCount < 60, `${b.particleCount} particles left after 8s`);
});

test('reduced motion shows the text alone: nothing is thrown', () => {
  const b = burst({ reducedMotion: () => true });
  b.start();
  for (let i = 0; i < 120; i++) b.update(1 / 60);
  assert.strictEqual(b.active, true, 'still counts as showing');
  assert.strictEqual(b.particleCount, 0);
  assert.strictEqual(b.boltCount, 0);
});

test('a burst that was never sized draws nothing and does not throw', () => {
  const b = jackpot.createBurst({ canvas: stubCanvas() });
  b.start();
  b.update(0.1);
  b.draw();
  b.stop();
});
