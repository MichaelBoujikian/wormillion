/**
 * DOM rendering and event wiring. This is the ONLY module allowed to touch
 * `document` (Spec S7) - everything it needs from the engine comes in as plain
 * data or callbacks.
 */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else (root.Wormillion = root.Wormillion || {}).ui = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';

  const W = root.Wormillion;

  const $ = (id) => document.getElementById(id);
  const fmt = (n) => n.toLocaleString('en-US');

  /** Compact pageview counts: 1.2M, 210k, 940. */
  const fmtViews = (n) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(n >= 10000000 ? 0 : 1)}M`;
    if (n >= 1000) return `${Math.round(n / 1000)}k`;
    return String(n);
  };

  function start(bank) {
    const els = {
      app: $('app'),
      scene: $('scene'),
      sceneWrap: $('scene-wrap'),
      hudDepth: $('hud-depth'),
      hudStratum: $('hud-stratum'),
      jackpot: $('jackpot'),
      jackpotFx: $('jackpot-fx'),
      best: $('best-score'),
      screens: {
        title: $('screen-title'),
        play: $('screen-play'),
        summary: $('screen-summary'),
        stats: $('screen-stats')
      },
      bankCount: $('bank-count'),
      startBtn: $('start-btn'),
      statsBtn: $('stats-btn'),
      round: $('round-label'),
      score: $('score-label'),
      timerBar: $('timer-bar'),
      timerNum: $('timer-num'),
      promptIcon: $('prompt-icon'),
      promptCategory: $('prompt-category'),
      promptText: $('prompt-text'),
      form: $('answer-form'),
      input: $('answer-input'),
      feedback: $('feedback'),
      lastAnswer: $('last-answer'),
      sumScore: $('summary-score'),
      sumDepth: $('summary-depth'),
      sumStratum: $('summary-stratum'),
      sumBest: $('summary-best'),
      sumRounds: $('summary-rounds'),
      againBtn: $('again-btn'),
      sumStatsBtn: $('summary-stats-btn'),
      statRuns: $('stat-runs'),
      statAvg: $('stat-avg'),
      statBest: $('stat-best'),
      statDeepest: $('stat-deepest'),
      statList: $('stat-list'),
      statsBack: $('stats-back'),
      announcer: $('announcer')
    };

    const motionQuery = root.matchMedia
      ? root.matchMedia('(prefers-reduced-motion: reduce)')
      : { matches: false };
    const reducedMotion = () => motionQuery.matches;

    const renderer = W.worldRender.createRenderer({
      canvas: els.scene,
      terrainCanvas: document.createElement('canvas'),
      carveCanvas: document.createElement('canvas'),
      reducedMotion
    });

    // "ONE IN WORMILLION" - confetti and lightning over the scene for an
    // answer at JACKPOT_RARITY or better. Held for HOLD_SECONDS or until the
    // player puts in their next answer, whichever comes first.
    const burst = W.jackpot.createBurst({ canvas: els.jackpotFx, reducedMotion });
    let jackpotHold = null;

    const iconCtx = els.promptIcon.getContext('2d');
    iconCtx.imageSmoothingEnabled = false;

    let run = null;
    let timer = null;
    let locked = false; // true while a dig animation or a timeout beat plays

    // ---- scene loop ---------------------------------------------------------
    function fitScene() {
      const rect = els.sceneWrap.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      // Chunky pixels, but not so chunky that a phone only sees three trees:
      // narrow viewports get a smaller scale factor.
      const scale = rect.width < 520 ? 2.1 : 3;
      const targetW = Math.max(150, Math.min(260, Math.round(rect.width / scale)));
      renderer.resize(rect.width, rect.height, rect.width / targetW);
      burst.resize(rect.width, rect.height, rect.width / targetW);
      // "WORMILLION" is ten monospace characters; keep it inside the scene.
      els.jackpot.style.setProperty('--jackpot-size', `${Math.max(22, Math.min(64, Math.round(rect.width * 0.13)))}px`);
    }

    let lastFrame = 0;
    function frame(now) {
      const dt = lastFrame ? Math.min(0.05, (now - lastFrame) / 1000) : 0;
      lastFrame = now;
      renderer.update(dt);
      renderer.draw();
      if (burst.active) {
        burst.update(dt);
        burst.draw();
      }
      requestAnimationFrame(frame);
    }

    // ---- screens ------------------------------------------------------------
    function show(name) {
      for (const [key, el] of Object.entries(els.screens)) {
        el.hidden = key !== name;
      }
      els.app.dataset.screen = name;
    }

    function refreshBest() {
      const best = W.persistence.read().bestDive;
      els.best.textContent = best ? `${fmt(best.score)} · ${best.deepestStratum}` : '—';
    }

    function showJackpot() {
      hideJackpot();
      // Un-hiding restarts the CSS animations on the text from the top.
      els.jackpot.hidden = false;
      burst.start();
      jackpotHold = setTimeout(hideJackpot, W.jackpot.HOLD_SECONDS * 1000);
    }

    function hideJackpot() {
      if (jackpotHold) clearTimeout(jackpotHold);
      jackpotHold = null;
      els.jackpot.hidden = true;
      burst.stop();
    }

    function setHud() {
      const depth = run ? run.depth : 0;
      els.hudDepth.textContent = depth.toFixed(0);
      const band = W.strata.strataFor(depth);
      els.hudStratum.textContent = band.name;
      els.hudStratum.style.setProperty('--band', band.accent);
      els.hudStratum.style.setProperty('--band-bg', band.dark);
    }

    // ---- round flow ---------------------------------------------------------
    function renderPrompt() {
      const prompt = run.prompt();
      iconCtx.clearRect(0, 0, els.promptIcon.width, els.promptIcon.height);
      W.icons.drawIcon(iconCtx, prompt.category, 0, 0);
      els.promptCategory.textContent = prompt.label;
      els.promptText.textContent = prompt.text;
      els.round.textContent = `Round ${run.roundNumber} / ${run.totalRounds}`;
      els.score.textContent = `${fmt(run.score)} pts`;
      setHud();
    }

    function setFeedback(message, kind) {
      els.feedback.textContent = message || '';
      els.feedback.dataset.kind = kind || '';
      if (message) announce(message);
    }

    /**
     * Screen-reader announcements. The countdown lives here rather than in an
     * aria-live timer element, so it announces at two useful moments instead of
     * talking over the player once a second.
     */
    function announce(text) {
      els.announcer.textContent = text;
    }

    function startRound() {
      locked = false;
      renderPrompt();
      // The previous round's result stays on screen beside the new prompt; it
      // is only replaced when the player submits again. A score you never got
      // to read is not much of a reward.
      els.input.value = '';
      els.input.disabled = false;
      els.input.focus();
      const p = run.prompt();
      announce(`Round ${run.roundNumber} of ${run.totalRounds}. ${p.text} 30 seconds.`);

      timer = W.timer.createTimer({
        onTick(remaining) {
          els.timerNum.textContent = remaining;
          const pct = Math.max(0, (remaining / W.timer.ROUND_SECONDS) * 100);
          els.timerBar.style.width = `${pct}%`;
          els.timerBar.dataset.state = remaining <= 5 ? 'critical' : remaining <= 10 ? 'warn' : '';
          if (remaining === 10 || remaining === 5) announce(`${remaining} seconds left`);
        },
        onExpire: handleTimeout
      });
      timer.start();
    }

    function endRoundBeat(result) {
      timer.stop();
      locked = true;
      els.input.disabled = true;

      const finish = () => {
        if (run.finished) showSummary();
        else startRound();
      };

      if (result.status === 'accepted') {
        // One in Wormillion digs a crater, not a tunnel (3.12).
        const tier = result.rarity >= W.rarity.PERFECT_RARITY ? 'perfect' : W.rarity.isJackpot(result.rarity) ? 'jackpot' : null;
        renderer.diveTo(result.depthAfter, { onArrive: finish, tier });
        // the HUD should count up with the worm, not snap ahead of it
        let ticks = 0;
        const tick = setInterval(() => {
          els.hudDepth.textContent = renderer.depth.toFixed(0);
          const band = W.strata.strataFor(renderer.depth);
          els.hudStratum.textContent = band.name;
          els.hudStratum.style.setProperty('--band', band.accent);
          els.hudStratum.style.setProperty('--band-bg', band.dark);
          // Stop chasing the animation if the tab was backgrounded mid-dive
          // (requestAnimationFrame pauses there, so `animating` can stay true).
          if (!renderer.animating || (ticks += 1) > 200) clearInterval(tick);
        }, 60);
      } else {
        setTimeout(finish, reducedMotion() ? 250 : 1100);
      }
    }

    function handleSubmit(event) {
      event.preventDefault();
      if (locked || !run || run.finished) return;
      const raw = els.input.value;
      if (!raw.trim()) return;
      hideJackpot(); // the next entry is in; the celebration has had its turn
      setFeedback('');
      const result = run.submit(raw);

      if (result.status === 'accepted') {
        const pct = Math.round(result.rarity * 100);
        // A fixed-up spelling is shown, not hidden: the player should see what
        // the place is actually called.
        const spelling = result.correctedFrom
          ? `${result.correctedFrom} → ${result.entry.name}`
          : result.entry.name;
        setFeedback(
          `${spelling} · ${fmtViews(result.entry.magnitude)} views/mo · ` +
            `${pct}% obscure · +${fmt(result.points)} · dug ${result.dig.toFixed(1)}`,
          result.correctedFrom ? 'fixed' : 'good'
        );
        els.lastAnswer.textContent = `${result.entry.name} +${fmt(result.points)}`;
        els.score.textContent = `${fmt(run.score)} pts`;
        const jackpot = W.rarity.isJackpot(result.rarity);
        if (jackpot) showJackpot();
        announce(
          `${jackpot ? 'One in Wormillion! ' : ''}` +
            `${result.entry.name} accepted, ${fmt(result.entry.magnitude)} monthly views. ` +
            `Plus ${result.points} points. ` +
            `Now ${result.depthAfter.toFixed(0)} deep in ${W.strata.stratumName(result.depthAfter)}.`
        );
        endRoundBeat(result);
        return;
      }

      // Every other status is a free retry: no penalty, no advance (3.4/3.5).
      els.input.value = '';
      els.input.focus();
      if (result.status === 'duplicate') {
        setFeedback(`You already dug up ${result.entry.name} this run — name another.`, 'warn');
      } else if (result.status === 'wrong-scope') {
        setFeedback(
          result.scopeName && result.scopeName !== 'that pattern'
            ? `${result.entry.name} isn't in ${result.scopeName} — try another.`
            : `${result.entry.name} doesn't fit this one — try another.`,
          'warn'
        );
      } else {
        setFeedback('Not recognized — try another.', 'warn');
      }
    }

    function handleTimeout() {
      if (locked || !run || run.finished) return;
      const result = run.timeout();
      setFeedback("Time's up — no dig this round.", 'bad');
      els.lastAnswer.textContent = 'missed';
      endRoundBeat(result);
    }

    // ---- summary / stats ----------------------------------------------------
    function showSummary() {
      const summary = run.summary();
      const saved = W.persistence.recordRun(summary);

      els.sumScore.textContent = fmt(summary.score);
      els.sumDepth.textContent = `${summary.finalDepth.toFixed(1)} deep`;
      els.sumStratum.textContent = summary.deepestStratum;
      const band = W.strata.strataFor(summary.finalDepth);
      els.sumStratum.style.setProperty('--band', band.accent);
      els.sumStratum.style.setProperty('--band-bg', band.dark);

      els.sumBest.hidden = !saved.isBest;
      els.sumBest.textContent = saved.previousBest
        ? `New best — beat ${fmt(saved.previousBest.score)}`
        : 'New best dive';

      // The ladder: every answer from least to most obscure, each with a bar
      // for its obscurity, so the rarest thing you knew is the last line.
      els.sumRounds.innerHTML = '';
      const span = (className, text) => {
        const el = document.createElement('span');
        el.className = className;
        el.textContent = text;
        return el;
      };
      for (const r of summary.ladder) {
        const missed = r.status === 'timeout';
        const pct = missed ? 0 : Math.round(r.rarity * 100);
        const jackpot = !missed && W.rarity.isJackpot(r.rarity);
        const li = document.createElement('li');
        li.className = [missed && 'miss', jackpot && 'rare', jackpot && pct >= 100 && 'rarest']
          .filter(Boolean)
          .join(' ');
        const bar = document.createElement('span');
        bar.className = 'r-bar';
        bar.setAttribute('aria-hidden', 'true');
        const fill = document.createElement('i');
        fill.style.width = `${pct}%`;
        bar.append(fill);
        li.title = missed ? `${r.prompt} — missed` : `${r.answer}: ${pct}% obscure, ${fmt(r.points)} points`;
        li.append(
          span('r-name', missed ? `${r.prompt} — missed` : r.answer),
          bar,
          span('r-pct', missed ? '—' : `${pct}%`),
          span('r-points', r.points ? `+${fmt(r.points)}` : '0')
        );
        els.sumRounds.append(li);
      }

      refreshBest();
      show('summary');
      els.againBtn.focus();
    }

    function showStats() {
      const stats = W.persistence.stats();
      els.statRuns.textContent = fmt(stats.runs);
      els.statAvg.textContent = fmt(stats.averageScore);
      els.statBest.textContent = fmt(stats.bestScore);
      els.statDeepest.textContent = stats.deepestStratum || '—';

      els.statList.innerHTML = '';
      const recent = stats.history.slice().reverse();
      if (recent.length === 0) {
        const li = document.createElement('li');
        li.className = 'empty';
        li.textContent = 'No dives yet.';
        els.statList.append(li);
      }
      for (const r of recent) {
        const li = document.createElement('li');
        const when = new Date(r.date);
        const left = document.createElement('span');
        left.className = 'r-name';
        left.textContent = `${r.deepestStratum} · ${r.finalDepth.toFixed(0)} deep`;
        const mid = document.createElement('span');
        mid.className = 'r-date';
        mid.textContent = Number.isNaN(when.getTime())
          ? ''
          : when.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const right = document.createElement('span');
        right.className = 'r-points';
        right.textContent = fmt(r.score);
        li.append(left, mid, right);
        els.statList.append(li);
      }
      show('stats');
      els.statsBack.focus();
    }

    function startRun() {
      run = W.run.createRun(bank);
      renderer.reset();
      hideJackpot();
      setFeedback('');
      els.lastAnswer.textContent = '';
      els.timerBar.style.width = '100%';
      show('play');
      startRound();
    }

    // ---- wiring -------------------------------------------------------------
    els.startBtn.addEventListener('click', startRun);
    els.againBtn.addEventListener('click', startRun);
    els.statsBtn.addEventListener('click', showStats);
    els.sumStatsBtn.addEventListener('click', showStats);
    els.statsBack.addEventListener('click', () => show(run && !run.finished ? 'play' : 'title'));
    els.form.addEventListener('submit', handleSubmit);
    // Some mobile keyboards fire Enter without a form submit; catch it directly.
    els.input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') handleSubmit(event);
    });

    // QA hook: `?debug` exposes the renderer so a tester can jump the worm to
    // any depth and eyeball a stratum without playing 15 rounds to reach it.
    if (root.location && root.location.search.indexOf("debug") !== -1) {
      root.__wormillion = {
        renderer,
        burst,
        currentRun: () => run,
        diveTo: (d, tier) => renderer.diveTo(d, { tier }),
        celebrate: showJackpot
      };
    }

    root.addEventListener('resize', fitScene);
    if (root.ResizeObserver) new ResizeObserver(fitScene).observe(els.sceneWrap);

    els.bankCount.textContent = fmt(
      Object.values(bank.counts).reduce((a, b) => a + b, 0)
    );
    refreshBest();
    fitScene();
    renderer.reset();
    setHud();
    show('title');
    requestAnimationFrame(frame);
  }

  return { start };
});
