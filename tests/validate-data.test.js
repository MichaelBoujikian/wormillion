const test = require('node:test');
const assert = require('node:assert');

// validate-data.mjs is ESM; pull it in with a dynamic import.
const load = () => import('../scripts/validate-data.mjs');

test('the shipped content bank passes validation', async () => {
  const { validate, loadDataFiles } = await load();
  const files = await loadDataFiles();
  const { errors } = validate(files);
  assert.deepStrictEqual(errors, [], `validation errors:\n${errors.join('\n')}`);
});

test('every category meets its target entry count (Spec 6)', async () => {
  const { validate, loadDataFiles, TARGETS } = await load();
  const { counts, warnings } = validate(await loadDataFiles());
  for (const [category, target] of Object.entries(TARGETS)) {
    assert.ok(counts[category] >= target, `${category}: ${counts[category]} < ${target}`);
  }
  assert.deepStrictEqual(warnings, []);
});

test('the validator actually catches the things it claims to', async () => {
  const { validate } = await load();
  const entry = {
    id: 'lake-a', category: 'lake', name: 'Lake A', aliases: [],
    magnitude: 1200, magnitudeUnit: 'pageviews_monthly', wikiTitle: 'Lake A',
    size: 10, sizeUnit: 'area_km2', source: 'fixture'
  };
  const good = { 'a.json': [entry] };
  assert.deepStrictEqual(validate(good).errors, []);

  const duplicateId = { 'a.json': [entry], 'b.json': [entry] };
  assert.ok(validate(duplicateId).errors.some((e) => e.includes('duplicate id')));

  const badMagnitude = { 'a.json': [{ ...entry, magnitude: 0 }] };
  assert.ok(validate(badMagnitude).errors.some((e) => e.includes('magnitude')));

  const collidingAlias = {
    'a.json': [entry, { ...entry, id: 'lake-b', name: 'Lake B', aliases: ['lake a'] }]
  };
  assert.ok(validate(collidingAlias).errors.some((e) => e.includes('claimed by both')));

  // Two aliases that reduce to the same bare form, with no name to settle it.
  const deadLooseForm = {
    'a.json': [
      { ...entry, id: 'lake-a', name: 'Lake A', aliases: ['Great Salt Lake'] },
      { ...entry, id: 'lake-b', name: 'Lake B', aliases: ['Great Salt Sea'] }
    ]
  };
  assert.ok(validate(deadLooseForm).errors.some((e) => e.includes('identifies nobody')));
  // ...but a name beats an alias, so this one is fine.
  const settledLooseForm = {
    'a.json': [
      { ...entry, id: 'lake-a', name: 'Great Salt Lake', aliases: [] },
      { ...entry, id: 'lake-b', name: 'Lake B', aliases: ['Great Salt Sea'] }
    ]
  };
  assert.deepStrictEqual(validate(settledLooseForm).errors, []);

  const badRegion = {
    'a.json': [{ ...entry, id: 'country-x', category: 'country', name: 'X', region: ['Middle Earth'], flag: ['red'] }]
  };
  assert.ok(validate(badRegion).errors.some((e) => e.includes('unknown region')));

  const country = { ...entry, id: 'country-x', category: 'country', name: 'X', region: ['Europe'] };
  assert.deepStrictEqual(validate({ 'a.json': [{ ...country, flag: ['red', 'white'] }] }).errors, []);
  assert.ok(validate({ 'a.json': [country] }).errors.some((e) => e.includes('flag colour array')));
  assert.ok(validate({ 'a.json': [{ ...country, flag: ['maroon'] }] }).errors.some((e) => e.includes('unknown flag colour')));
  assert.ok(validate({ 'a.json': [{ ...country, flag: ['red', 'red'] }] }).errors.some((e) => e.includes('repeated flag colour')));

  // A size range is optional, but must be ordered and start at the size.
  assert.deepStrictEqual(validate({ 'a.json': [{ ...entry, size: 10, sizeRange: [10, 40] }] }).errors, []);
  assert.ok(validate({ 'a.json': [{ ...entry, size: 10, sizeRange: [40, 10] }] }).errors.some((e) => e.includes('sizeRange')));
  assert.ok(validate({ 'a.json': [{ ...entry, size: 12, sizeRange: [10, 40] }] }).errors.some((e) => e.includes('sizeRange')));

  // A city must belong to a country and must not be that country's capital.
  const paris = { ...entry, id: 'capital-paris', category: 'capital', name: 'Paris', region: ['Europe'], country: 'France' };
  const lyon = { ...entry, id: 'city-lyon', category: 'city', name: 'Lyon', region: ['Europe'], country: 'France', flag: ['blue', 'white', 'red'] };
  assert.deepStrictEqual(validate({ 'a.json': [paris, lyon] }).errors, []);
  assert.ok(validate({ 'a.json': [paris, { ...lyon, id: 'city-paris', name: 'Paris' }] }).errors.some((e) => e.includes('excludes capitals')));
  assert.ok(validate({ 'a.json': [{ ...lyon, country: undefined }] }).errors.some((e) => e.includes('needs a country')));
  assert.ok(validate({ 'a.json': [{ ...lyon, region: [] }] }).errors.some((e) => e.includes('region')));

  // A capital's flag is optional, but wrong if present.
  const capital = { ...entry, id: 'capital-x', category: 'capital', name: 'X City', region: ['Europe'] };
  assert.deepStrictEqual(validate({ 'a.json': [capital] }).errors, []);
  assert.deepStrictEqual(validate({ 'a.json': [{ ...capital, flag: ['blue'] }] }).errors, []);
  assert.ok(validate({ 'a.json': [{ ...capital, flag: ['teal'] }] }).errors.some((e) => e.includes('unknown flag colour')));
});

test('bank.js and the JSON files hold the same entries', async () => {
  const { loadDataFiles } = await load();
  const files = await loadDataFiles();
  const bundle = require('node:fs').readFileSync(
    require('node:path').join(__dirname, '..', 'src', 'data', 'bank.js'),
    'utf8'
  );

  const globalStub = {};
  new Function('globalThis', bundle)(globalStub);
  const bank = globalStub.WORMILLION_BANK;

  const jsonTotal = Object.values(files).reduce((n, entries) => n + entries.length, 0);
  const bankTotal = Object.values(bank).reduce((n, entries) => n + entries.length, 0);
  assert.strictEqual(bankTotal, jsonTotal, 'bank.js is stale - run `npm run build-data`');

  const jsonIds = new Set(Object.values(files).flat().map((e) => e.id));
  for (const entry of Object.values(bank).flat()) {
    assert.ok(jsonIds.has(entry.id), `${entry.id} is in bank.js but not in the JSON files`);
  }
});

test('every entry scores on monthly Wikipedia pageviews', async () => {
  const { loadDataFiles } = await load();
  const files = await loadDataFiles();
  const entries = Object.values(files).flat();
  for (const entry of entries) {
    assert.strictEqual(entry.magnitudeUnit, 'pageviews_monthly', entry.id);
    assert.ok(entry.magnitude > 0, `${entry.id} has no pageviews`);
    assert.ok(entry.wikiTitle, `${entry.id} has no wikiTitle`);
  }
  // The famous end of the scale really is far above the obscure end, or the
  // rarity curve would be meaningless.
  const views = entries.map((e) => e.magnitude).sort((a, b) => a - b);
  assert.ok(views[views.length - 1] / views[0] > 100, 'pageview spread is too narrow to score on');
});
