/**
 * Depth -> stratum lookup (Spec 5.2). Pure; no DOM.
 *
 * Seven equal-width bands over the 700-unit depth budget. The palette lives here
 * too because the renderer and the HUD must agree on what "Clay" looks like.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else (root.Wormillion = root.Wormillion || {}).strata = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const BAND_HEIGHT = 100;

  const STRATA = [
    {
      name: 'Topsoil',
      from: 0,
      to: 100,
      base: '#6d4a2c',
      dark: '#573921',
      light: '#845c36',
      grit: '#3f2716',
      speck: '#9a7346',
      accent: '#4f7a34'
    },
    {
      name: 'Subsoil',
      from: 100,
      to: 200,
      base: '#7d5227',
      dark: '#64401d',
      light: '#956533',
      grit: '#472c13',
      speck: '#b08343',
      accent: '#8c6b3f'
    },
    {
      name: 'Clay',
      from: 200,
      to: 300,
      base: '#9c5333',
      dark: '#7e3f27',
      light: '#b56743',
      grit: '#5c2c1b',
      speck: '#d08b5f',
      accent: '#c97a4c'
    },
    {
      name: 'Bedrock',
      from: 300,
      to: 400,
      base: '#6a625c',
      dark: '#524b47',
      light: '#837a72',
      grit: '#3b3532',
      speck: '#a49a90',
      accent: '#9fb0bd'
    },
    {
      name: 'Deep Rock',
      from: 400,
      to: 500,
      base: '#474559',
      dark: '#343343',
      light: '#5b596f',
      grit: '#262532',
      speck: '#7d7b95',
      accent: '#6de3d0'
    },
    {
      name: 'Mantle',
      from: 500,
      to: 600,
      base: '#5c2320',
      dark: '#431716',
      light: '#7a3227',
      grit: '#2d0f0f',
      speck: '#a5482c',
      accent: '#ff8a2b'
    },
    {
      name: 'Core',
      from: 600,
      to: Infinity,
      base: '#8f2417',
      dark: '#6c1810',
      light: '#b03a1d',
      grit: '#4a0f0a',
      speck: '#e0682a',
      accent: '#ffd451'
    }
  ];

  /** The band containing `depth`. Depth below 0 clamps to Topsoil. */
  function strataFor(depth) {
    const d = Number.isFinite(depth) ? Math.max(0, depth) : 0;
    for (const band of STRATA) {
      if (d >= band.from && d < band.to) return band;
    }
    return STRATA[STRATA.length - 1];
  }

  /** Just the name, for HUD/summary/history text. */
  function stratumName(depth) {
    return strataFor(depth).name;
  }

  /** 0..1 progress through the band containing `depth` (Core reports 1). */
  function bandProgress(depth) {
    const band = strataFor(depth);
    if (!Number.isFinite(band.to)) return 1;
    return (Math.max(0, depth) - band.from) / (band.to - band.from);
  }

  return { STRATA, BAND_HEIGHT, strataFor, stratumName, bandProgress };
});
