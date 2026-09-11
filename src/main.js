/* Entry point: hand the bundled bank to the prompt bank, then start the UI. */
(function () {
  'use strict';

  function boot() {
    const W = globalThis.Wormillion;
    try {
      const bank = W.promptBank.loadBank(globalThis);
      W.ui.start(bank);
    } catch (error) {
      console.error(error);
      const el = document.getElementById('screen-title');
      if (el) {
        el.innerHTML =
          '<h2 class="screen-title">Could not load</h2>' +
          '<p class="lede">The content bank failed to load: ' +
          String(error && error.message ? error.message : error) +
          '</p>';
        el.hidden = false;
      }
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
