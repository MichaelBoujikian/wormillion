/**
 * 12x12 pixel-art category icons, authored as character maps. Pure drawing on a
 * supplied 2d context - no DOM lookups here.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else (root.Wormillion = root.Wormillion || {}).icons = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const PALETTE = {
    '.': null,
    k: '#2b1c12', // outline
    w: '#ffffff',
    r: '#c8503f',
    o: '#e2913c',
    y: '#ffd451',
    g: '#4e8f3c',
    G: '#7cc25a',
    b: '#3f86c4',
    B: '#7cc7e8',
    s: '#d8b981', // sand
    n: '#7b6b5c', // stone
    N: '#a99885',
    p: '#6b4a2c' // soil
  };

  const ICONS = {
    country: [
      '............',
      '..kkkkkk....',
      '..krrrrrk...',
      '..krwrrwrk..',
      '..krrrrrk...',
      '..kkkkkk....',
      '..kk........',
      '..kk........',
      '..kk........',
      '.kkkkk......',
      '.kpppk......',
      '............'
    ],
    capital: [
      '.....y......',
      '....yyy.....',
      '.....y......',
      '....kkk.....',
      '...kwwwk....',
      '..kwwwwwk...',
      '..kwkwkwk...',
      '..kwwwwwk...',
      '..kwkwkwk...',
      '..kwwwwwk...',
      '.kkkkkkkkk..',
      '............'
    ],
    lake: [
      '............',
      '...kkkkkk...',
      '..kbbbbbbk..',
      '.kbbBbbBbbk.',
      '.kbbbbbbbbk.',
      '.kbBbbbbBbk.',
      '.kbbbbbbbbk.',
      '..kbbbbbbk..',
      '...kkkkkk...',
      '............',
      '............',
      '............'
    ],
    river: [
      '.....kk.....',
      '....kbbk....',
      '....kbbk....',
      '...kbbk.....',
      '..kbbk......',
      '..kbBk......',
      '...kbbk.....',
      '....kbbk....',
      '.....kbbk...',
      '.....kbbk...',
      '....kbbbk...',
      '............'
    ],
    mountain: [
      '............',
      '.....k......',
      '....kwk.....',
      '...kwwwk....',
      '...knnnk....',
      '..knnnnnk...',
      '.knnk.knnk..',
      '.kn.k.k.nk..',
      'knnnnnnnnnk.',
      'kNNNNNNNNNk.',
      '.kkkkkkkkk..',
      '............'
    ],
    desert: [
      '..y.........',
      '.yyy...k....',
      '..y...kgk...',
      '.....k.g.k..',
      '.....kkgkk..',
      '.......g....',
      '.....k.g....',
      '.....kkg....',
      '.......g....',
      '..sssssgsss.',
      '.ssssssssss.',
      '............'
    ],
    island: [
      '.....k......',
      '...kGkGk....',
      '..kGGkGGk...',
      '.....k......',
      '.....k......',
      '....sks.....',
      '..ssssssss..',
      '.ssssssssss.',
      'kbbbbbbbbbbk',
      '.bBbbbbbBbb.',
      '.bbbbbbbbbb.',
      '............'
    ],
    sea_ocean: [
      '............',
      '............',
      '.kbbbbbbbbk.',
      'kbbbBbbbbbbk',
      'kbbbbbbBbbbk',
      'kbBbbbbbbbbk',
      'kbbbbbBbbbbk',
      'kbbbBbbbbbbk',
      'kbbbbbbbBbbk',
      '.kbbbbbbbbk.',
      '............',
      '............'
    ]
  };

  /** Draw a category icon with its top-left at (x, y), one art pixel per cell. */
  function drawIcon(ctx, category, x, y) {
    const rows = ICONS[category];
    if (!rows) return;
    for (let row = 0; row < rows.length; row++) {
      for (let col = 0; col < rows[row].length; col++) {
        const color = PALETTE[rows[row][col]];
        if (!color) continue;
        ctx.fillStyle = color;
        ctx.fillRect(x + col, y + row, 1, 1);
      }
    }
  }

  return { ICONS, PALETTE, drawIcon, SIZE: 12 };
});
