/**
 * Would a real player's first guesses actually work?
 *
 * Runs a list of answers people obviously reach for through the same matcher the
 * game uses, and reports the ones the bank can't accept. This is the check that
 * catches "I typed Seychelles for an island and it said no".
 *
 *   node scripts/gap-check.mjs
 */
import { createRequire } from 'node:module';
import { buildFiles } from './build-data.mjs';

const require = createRequire(import.meta.url);
const matching = require('../src/js/matching.js');

// Deliberately the obvious stuff, not the obscure stuff.
const EXPECTED = {
  country: ['France', 'Japan', 'Brazil', 'Egypt', 'Kenya', 'Chile', 'Nepal', 'Fiji', 'USA', 'UK', 'Vietnam', 'Peru', 'Iceland', 'Morocco', 'Thailand'],
  capital: ['Paris', 'Tokyo', 'Cairo', 'Ottawa', 'Lima', 'Oslo', 'Doha', 'Hanoi', 'Rome', 'Madrid', 'Seoul', 'Nairobi', 'Havana', 'Athens'],
  lake: ['Lake Superior', 'Lake Victoria', 'Baikal', 'Loch Ness', 'Lake Tahoe', 'Dead Sea', 'Lake Como', 'Crater Lake', 'Lake Titicaca', 'Great Salt Lake'],
  river: ['Nile', 'Amazon', 'Mississippi', 'Thames', 'Danube', 'Ganges', 'Volga', 'Indus', 'Rhine', 'Seine', 'Yangtze', 'Congo', 'Tigris', 'Euphrates', 'Jordan', 'Colorado'],
  mountain: ['Everest', 'K2', 'Kilimanjaro', 'Matterhorn', 'Mount Fuji', 'Denali', 'Ben Nevis', 'Mont Blanc', 'Uluru', 'Aconcagua', 'Mount Rainier', 'Vesuvius', 'Etna'],
  desert: ['Sahara', 'Gobi', 'Mojave', 'Atacama', 'Kalahari', 'Namib', 'Sonoran', 'Thar Desert', 'Arabian Desert', 'Antarctic Desert'],
  island: ['Maui', 'Oahu', 'Seychelles', 'Bali', 'Sicily', 'Greenland', 'Madagascar', 'Cuba', 'Hawaii', 'Manhattan', 'Iceland', 'Tasmania', 'Crete', 'Santorini', 'Fiji', 'Maldives', 'Galapagos', 'Isle of Skye', 'Long Island', 'Corfu', 'Phuket', 'Ibiza', 'Jamaica', 'Bora Bora', 'Aruba', 'Zanzibar'],
  sea_ocean: ['Pacific Ocean', 'Atlantic', 'Mediterranean', 'Red Sea', 'Black Sea', 'Caribbean Sea', 'Dead Sea', 'North Sea', 'Baltic Sea', 'Arabian Sea', 'Bering Sea', 'Coral Sea', 'Gulf of Mexico']
};

const byCategory = new Map();
for (const entries of Object.values(buildFiles())) {
  for (const entry of entries) {
    if (!byCategory.has(entry.category)) byCategory.set(entry.category, []);
    byCategory.get(entry.category).push(entry);
  }
}

let missing = 0;
let corrected = 0;
for (const [category, answers] of Object.entries(EXPECTED)) {
  const lookup = matching.buildLookup(byCategory.get(category) || []);
  const gaps = [];
  for (const answer of answers) {
    const result = matching.matchAnswer(answer, lookup, new Set());
    if (result.status === 'unrecognized') gaps.push(answer);
    else if (result.status === 'corrected') corrected += 1;
  }
  missing += gaps.length;
  console.log(
    `${category.padEnd(10)} ${String(answers.length - gaps.length).padStart(3)}/${answers.length}` +
      (gaps.length ? `   MISSING: ${gaps.join(', ')}` : '')
  );
}

console.log(
  missing
    ? `\n${missing} obvious answer(s) the bank cannot accept.`
    : `\nEvery obvious answer lands (${corrected} via spelling correction).`
);
process.exit(missing ? 1 : 0);
