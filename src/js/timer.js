/**
 * 30-second round countdown. Callback-based; makes no DOM assumptions, and
 * takes its clock and scheduler by injection so tests can drive it by hand.
 */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else (root.Wormillion = root.Wormillion || {}).timer = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';

  const ROUND_SECONDS = 30;

  /**
   * @param {object} opts
   * @param {number} [opts.seconds]      round length
   * @param {(remaining:number)=>void} [opts.onTick]    remaining seconds, integer, counts down
   * @param {()=>void} [opts.onExpire]
   * @param {()=>number} [opts.now]      clock, ms
   * @param {(fn:Function,ms:number)=>any} [opts.setIntervalFn]
   * @param {(handle:any)=>void} [opts.clearIntervalFn]
   */
  function createTimer(opts = {}) {
    const seconds = opts.seconds || ROUND_SECONDS;
    const now = opts.now || (() => Date.now());
    const setIntervalFn = opts.setIntervalFn || ((fn, ms) => setInterval(fn, ms));
    const clearIntervalFn = opts.clearIntervalFn || ((h) => clearInterval(h));

    let handle = null;
    let endsAt = 0;
    let lastReported = null;

    function remaining() {
      return Math.max(0, (endsAt - now()) / 1000);
    }

    function poll() {
      const left = remaining();
      const shown = Math.ceil(left);
      if (shown !== lastReported) {
        lastReported = shown;
        if (opts.onTick) opts.onTick(shown);
      }
      if (left <= 0) {
        stop();
        if (opts.onExpire) opts.onExpire();
      }
    }

    function start() {
      stop();
      endsAt = now() + seconds * 1000;
      lastReported = null;
      poll();
      handle = setIntervalFn(poll, 100);
    }

    function stop() {
      if (handle !== null) {
        clearIntervalFn(handle);
        handle = null;
      }
    }

    return { start, stop, poll, remaining, running: () => handle !== null, seconds };
  }

  return { ROUND_SECONDS, createTimer };
});
