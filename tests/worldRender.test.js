const test = require('node:test');
const assert = require('node:assert');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const worldRender = require('../src/js/worldRender.js');
const promptBank = require('../src/js/promptBank.js');
const runner = require('../src/js/run.js');

/**
 * The renderer draws to canvases it is handed and never touches `document`, so
 * a stand-in with a no-op 2d context is enough to drive its state machine.
 */
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

function renderer(options = {}) {
  const r = worldRender.createRenderer({
    canvas: stubCanvas(),
    terrainCanvas: stubCanvas(),
    carveCanvas: stubCanvas(),
    ...options
  });
  r.resize(600, 600, 3);
  r.reset();
  return r;
}

/** Pump frames until the dive reports arrival, or give up after ~10 s of game time. */
function diveAndWait(r, depth) {
  let arrived = false;
  r.diveTo(depth, { onArrive: () => { arrived = true; } });
  for (let i = 0; i < 600 && !arrived; i++) r.update(1 / 60);
  return arrived;
}

test('a normal dive reports arrival', () => {
  const r = renderer();
  assert.strictEqual(diveAndWait(r, 30), true);
  assert.strictEqual(r.depth, 30);
});

test('a zero-distance dive still reports arrival', () => {
  // Regression: the most-viewed entry in a cohort has rarity 0 and digs 0.
  // The dive used to complete only inside `if (depth < target)`, so the
  // round-advance callback never fired and the game sat locked forever.
  const r = renderer();
  assert.strictEqual(diveAndWait(r, 0), true, 'from the surface');

  diveAndWait(r, 40);
  assert.strictEqual(diveAndWait(r, 40), true, 'to the depth it is already at');
});

test('a dive past the depth cap still reports arrival', () => {
  const r = renderer();
  diveAndWait(r, worldRender.MAX_UNITS);
  assert.strictEqual(diveAndWait(r, worldRender.MAX_UNITS + 50), true);
});

test('reduced motion arrives synchronously, distance or no distance', () => {
  const r = renderer({ reducedMotion: () => true });
  let arrived = false;
  r.diveTo(0, { onArrive: () => { arrived = true; } });
  assert.strictEqual(arrived, true);
  arrived = false;
  r.diveTo(25, { onArrive: () => { arrived = true; } });
  assert.strictEqual(arrived, true);
  assert.strictEqual(r.depth, 25);
});

// --- the exact answers that froze the game -----------------------------------

function loadShippedBank() {
  const scope = {};
  for (const file of ['bank.js', 'themes.js']) {
    new Function('globalThis', readFileSync(path.join(__dirname, '..', 'src', 'data', file), 'utf8'))(scope);
  }
  return promptBank.createBank(scope.WORMILLION_BANK, scope.WORMILLION_THEMES, scope.WORMILLION_THEME_PROMPTS);
}

test('"everest" and "caspian" are accepted and the round advances', () => {
  const bank = loadShippedBank();
  for (const [category, typed, expected] of [
    ['mountain', 'everest', 'Mount Everest'],
    ['lake', 'caspian', 'Caspian Sea']
  ]) {
    const run = runner.createRun(bank, { rounds: 1 });
    run.state.slots[0] = { category };
    const result = run.submit(typed);
    assert.strictEqual(result.status, 'accepted', typed);
    assert.strictEqual(result.entry.name, expected);
    assert.strictEqual(result.dig, 0, `${expected} is the cohort's most-viewed entry, so it digs nothing`);

    // ...and the dig the UI would start on that result must still complete.
    const r = renderer();
    assert.strictEqual(diveAndWait(r, result.depthAfter), true, `${typed}: onArrive never fired`);
  }
});
