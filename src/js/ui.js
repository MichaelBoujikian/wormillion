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
      dud: $('dud'),
      dudFx: $('dud-fx'),
      dudText: $('dud-text'),
      best: $('best-score'),
      screens: {
        title: $('screen-title'),
        play: $('screen-play'),
        summary: $('screen-summary'),
        stats: $('screen-stats'),
        review: $('screen-review')
      },
      bankCount: $('bank-count'),
      dailyBtn: $('daily-btn'),
      dailyNote: $('daily-note'),
      dailyCountdown: $('daily-countdown'),
      dailyDoneRow: $('daily-done-row'),
      dailyShareBtn: $('daily-share-btn'),
      dailyReviewBtn: $('daily-review-btn'),
      endlessBtn: $('endless-btn'),
      statsBtn: $('stats-btn'),
      round: $('round-label'),
      modeLabel: $('mode-label'),
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
      sumMode: $('summary-mode'),
      sumScore: $('summary-score'),
      sumDepth: $('summary-depth'),
      sumAvg: $('summary-avg'),
      sumStratum: $('summary-stratum'),
      sumBest: $('summary-best'),
      sumRounds: $('summary-rounds'),
      shareBtn: $('share-btn'),
      reviewBtn: $('review-btn'),
      againBtn: $('again-btn'),
      sumStatsBtn: $('summary-stats-btn'),
      sumHomeBtn: $('summary-home-btn'),
      dstatPlayed: $('dstat-played'),
      dstatStreak: $('dstat-streak'),
      dstatBestStreak: $('dstat-best-streak'),
      dstatAvg: $('dstat-avg'),
      dstatBest: $('dstat-best'),
      dstatObscurity: $('dstat-obscurity'),
      dstatSpread: $('dstat-spread'),
      statRuns: $('stat-runs'),
      statAvg: $('stat-avg'),
      statBest: $('stat-best'),
      statDeepest: $('stat-deepest'),
      statList: $('stat-list'),
      statsBack: $('stats-back'),
      reviewTitle: $('review-title'),
      reviewSub: $('review-sub'),
      reviewList: $('review-list'),
      reviewBack: $('review-back'),
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

    // "0% OBSCURITY? DIG DEEPER NEXT TIME" - the opposite: blood and worse
    // dripping off the words, flies, and a worm gone rotten, for an answer
    // that reads as 0%. Same hold as the jackpot.
    const drip = W.dud.createDrip({ canvas: els.dudFx, reducedMotion });
    let dudHold = null;
    let scenePx = 3; // CSS px per logical px, so the overlay text can be measured for the drips

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
      scenePx = rect.width / targetW;
      renderer.resize(rect.width, rect.height, scenePx);
      burst.resize(rect.width, rect.height, scenePx);
      drip.resize(rect.width, rect.height, scenePx);
      // "WORMILLION" is ten monospace characters; keep it inside the scene.
      // "DIG DEEPER" / "NEXT TIME" are ten and nine, so they share the size.
      const bigWord = `${Math.max(22, Math.min(64, Math.round(rect.width * 0.13)))}px`;
      els.jackpot.style.setProperty('--jackpot-size', bigWord);
      els.dud.style.setProperty('--dud-size', bigWord);
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
      if (drip.active) {
        drip.update(dt);
        drip.draw();
      }
      requestAnimationFrame(frame);
    }

    // ---- screens ------------------------------------------------------------
    function show(name) {
      for (const [key, el] of Object.entries(els.screens)) {
        el.hidden = key !== name;
      }
      els.app.dataset.screen = name;
      if (name === 'title') refreshTitle();
      else if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
      }
    }

    function refreshBest() {
      const best = W.persistence.read().bestDive;
      els.best.textContent = best ? `${fmt(best.score)} · ${best.deepestStratum}` : '—';
    }

    /** "Sep 12" from a daily's YYYY-MM-DD key (local, like the key itself). */
    function dailyDate(key) {
      const [y, m, d] = key.split('-').map(Number);
      return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    /** What a run is called on the statusline and the summary (3.15): "Dig #2 · Sep 13". */
    function modeText(mode, dailyKey) {
      return mode === 'daily' ? `Dig #${W.seed.dailyNumber(dailyKey)} · ${dailyDate(dailyKey)}` : 'Endless';
    }

    /** "06:12:33" until the next local midnight. */
    function countdownText() {
      const total = Math.ceil(W.seed.msUntilNextDaily() / 1000);
      const pad = (n) => String(n).padStart(2, '0');
      return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`;
    }

    /**
     * The daily is one dig per day: once today's is in the history the button
     * locks and shows the result, the streak and a countdown, and unlocks by
     * itself at local midnight because the key changes. Endless is never
     * locked.
     */
    let countdownTimer = null;
    function refreshTitle() {
      const today = W.seed.dailyKey();
      const done = W.persistence.dailyResult(today);
      const number = W.seed.dailyNumber(today);
      els.dailyBtn.disabled = Boolean(done);
      els.dailyBtn.textContent = done ? `Dig #${number} — done` : `Today's dig #${number}`;
      els.dailyNote.classList.toggle('played', Boolean(done));
      if (done) {
        const streak = W.persistence.dailyStreak(today).current;
        const streakText = streak > 1 ? ` · ${streak}-day streak` : '';
        els.dailyNote.textContent = `You dug ${fmt(done.score)} · ${done.deepestStratum} today${streakText}`;
      } else {
        els.dailyNote.textContent = 'Same fifteen prompts for everyone today';
      }
      els.dailyDoneRow.hidden = !done;
      els.dailyShareBtn.onclick = done ? () => copyShare(done, els.dailyShareBtn) : null;
      els.dailyReviewBtn.hidden = !(done && done.rounds);
      els.dailyReviewBtn.onclick = done ? () => reviewRecord(done, 'title') : null;

      // The title re-reads itself when the key turns over at midnight - the
      // locked one unlocks, an unlocked one starts saying the new number -
      // and the countdown ticks while it is locked. The timer runs only
      // while the title is on screen (show() clears it).
      clearInterval(countdownTimer);
      els.dailyCountdown.hidden = !done;
      const tick = () => {
        if (W.seed.dailyKey() !== today) {
          refreshTitle();
          return;
        }
        if (done) els.dailyCountdown.textContent = `Next dig in ${countdownText()}`;
      };
      tick();
      countdownTimer = setInterval(tick, 1000);
    }

    // ---- share ------------------------------------------------------------
    /** The address a shared link points at: this host, or the canonical one off the web. */
    function shareUrl() {
      const loc = root.location;
      if (loc && /^https?:$/.test(loc.protocol)) return loc.origin + loc.pathname;
      return W.share.CANONICAL_URL;
    }

    /**
     * Put a record's share text on the clipboard and say so on the button.
     * Falls back to a selected textarea + execCommand where the async
     * clipboard is unavailable (file://, older mobile browsers), and to
     * showing the text where even that fails.
     */
    function copyShare(record, button) {
      const text = W.share.shareText(record, { url: shareUrl() });
      // The resting label is remembered once, so a second click while the
      // button reads "Copied!" doesn't make "Copied!" the label for good.
      if (!button.dataset.label) button.dataset.label = button.textContent;
      const said = (what) => {
        clearTimeout(button._labelTimer);
        button.textContent = what;
        announce('Result copied to clipboard');
        button._labelTimer = setTimeout(() => {
          button.textContent = button.dataset.label;
        }, 2000);
      };
      const fallback = () => {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.top = '-1000px';
        document.body.append(ta);
        ta.select();
        let ok = false;
        try {
          ok = document.execCommand('copy');
        } catch {
          ok = false;
        }
        ta.remove();
        if (ok) {
          said('Copied!');
          return;
        }
        // Last resort: show the text to copy by hand. Some webviews have no
        // prompt() at all; then there is nothing more to do.
        try {
          root.prompt('Copy your result:', text);
        } catch {
          announce('Could not copy the result');
        }
      };
      if (root.navigator && root.navigator.clipboard && root.navigator.clipboard.writeText) {
        root.navigator.clipboard.writeText(text).then(() => said('Copied!'), fallback);
      } else {
        fallback();
      }
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

    function showDud() {
      hideDud();
      els.dud.hidden = false;
      // Tell the drips where the words are, in the canvas's logical pixels,
      // so they hang from the letters rather than from thin air. Layout
      // offsets, not getBoundingClientRect: the drop-in animation has the
      // words translated half a screen up at this instant.
      drip.start({
        x: els.dudText.offsetLeft / scenePx,
        y: els.dudText.offsetTop / scenePx,
        width: els.dudText.offsetWidth / scenePx,
        height: els.dudText.offsetHeight / scenePx
      });
      renderer.setRotten(true);
      dudHold = setTimeout(hideDud, W.dud.HOLD_SECONDS * 1000);
    }

    function hideDud() {
      if (dudHold) clearTimeout(dudHold);
      dudHold = null;
      els.dud.hidden = true;
      drip.stop();
      renderer.setRotten(false);
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
      hideDud(); // ...and so has the shaming
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
        const dud = W.rarity.isDud(result.rarity);
        if (dud) showDud();
        announce(
          `${jackpot ? 'One in Wormillion! ' : dud ? 'Zero percent obscure - dig deeper next time. ' : ''}` +
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
      } else if (result.status === 'wrong-scope' && result.length) {
        // "Kilimanjaro is 11 letters - this round wants 12 or more."
        setFeedback(`${result.length.typed} is ${result.length.letters} letters — this round wants ${result.length.need}.`, 'warn');
      } else if (result.status === 'wrong-scope') {
        const placeScope = result.scopeName && result.scopeName !== 'that pattern';
        // "Japan" on "Name an island in Japan": the country is in the bank as
        // an island, and "Japan isn't in Japan" is not the hint.
        const isTheScope = placeScope && W.matching.normalize(result.entry.name) === W.matching.normalize(result.scopeName);
        // A letter rule says which letter: "Lake Erie has no double letter"
        // (a typo corrected to a real place is judged as that place).
        const letterRule = run.prompt().letter;
        setFeedback(
          isTheScope
            ? `${result.entry.name} is all of it — this round wants a single ${W.promptBank.NOUN[run.prompt().category]} in ${result.scopeName}.`
            : placeScope
              ? `${result.entry.name} isn't in ${result.scopeName} — try another.`
              : letterRule
                ? `${W.promptBank.letterMissText(result.entry.name, letterRule)} — try another.`
                : `${result.entry.name} doesn't fit this one — try another.`,
          'warn'
        );
      } else if (result.elsewhere) {
        const { NOUN, ARTICLE, wantsPhrase } = W.promptBank;
        const is = NOUN[result.elsewhere.category];
        const wants = wantsPhrase(run.prompt().category);
        setFeedback(
          `${result.elsewhere.entry.name} is ${ARTICLE(is)} ${is} — this round wants ${ARTICLE(wants)} ${wants}.`,
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

      els.sumMode.hidden = summary.mode !== 'daily';
      els.sumMode.textContent = modeText(summary.mode, summary.dailyKey);
      const record = W.persistence.toRecord(summary);
      els.shareBtn.textContent = 'Share';
      els.shareBtn.onclick = () => copyShare(record, els.shareBtn);
      els.reviewBtn.onclick = () => showReview(run.review(), record, 'summary');
      // A daily can't be dug twice, so its "again" is an endless dig.
      els.againBtn.textContent = summary.mode === 'daily' ? 'Keep digging — endless' : 'Dive again';

      els.sumScore.textContent = fmt(summary.score);
      els.sumDepth.textContent = `${summary.finalDepth.toFixed(1)} deep`;
      const avg = W.persistence.averageRarity(record);
      els.sumAvg.textContent = avg === null ? '' : `${Math.round(avg * 100)}% avg obscurity`;
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

    /** The daily block: streaks, averages, and a bar per stratum for where the dailies ended. */
    function renderDailyStats() {
      const today = W.seed.dailyKey();
      const d = W.persistence.dailyStats(today);
      const todays = W.persistence.dailyResult(today);
      els.dstatPlayed.textContent = fmt(d.played);
      els.dstatStreak.textContent = fmt(d.streak);
      els.dstatBestStreak.textContent = fmt(d.bestStreak);
      els.dstatAvg.textContent = fmt(d.averageScore);
      els.dstatBest.textContent = fmt(d.bestScore);
      els.dstatObscurity.textContent = d.averageRarity === null ? '—' : `${Math.round(d.averageRarity * 100)}%`;

      els.dstatSpread.innerHTML = '';
      const most = Math.max(1, ...Object.values(d.byStratum));
      for (const band of W.strata.STRATA) {
        const count = d.byStratum[band.name] || 0;
        const li = document.createElement('li');
        li.className = [count === 0 && 'none', todays && todays.deepestStratum === band.name && 'today']
          .filter(Boolean)
          .join(' ');
        const name = document.createElement('span');
        name.className = 's-name';
        name.textContent = band.name;
        const bar = document.createElement('span');
        bar.className = 's-bar';
        bar.setAttribute('aria-hidden', 'true');
        const fill = document.createElement('i');
        fill.style.width = `${(count / most) * 100}%`;
        fill.style.setProperty('--band', band.accent);
        bar.append(fill);
        const n = document.createElement('span');
        n.className = 's-count';
        n.textContent = String(count);
        li.title = `${count} ${count === 1 ? 'daily' : 'dailies'} ended in ${band.name}`;
        li.append(name, bar, n);
        els.dstatSpread.append(li);
      }
    }

    function showStats() {
      renderDailyStats();
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
        const whenText = Number.isNaN(when.getTime())
          ? ''
          : when.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        // A daily is named by its puzzle day, not by when the record was written.
        const isDaily = r.mode === 'daily' && typeof r.dailyKey === 'string';
        mid.textContent = isDaily ? `Dig #${W.seed.dailyNumber(r.dailyKey)} · ${dailyDate(r.dailyKey)}` : whenText;
        const right = document.createElement('span');
        right.className = 'r-points';
        right.textContent = fmt(r.score);
        li.append(left, mid, right);
        // A daily can be reviewed any time: its prompts come back from its key.
        if (isDaily && Array.isArray(r.rounds)) {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'r-review';
          btn.textContent = 'Review';
          btn.setAttribute('aria-label', `Review dig #${W.seed.dailyNumber(r.dailyKey)}`);
          btn.addEventListener('click', () => reviewRecord(r, 'stats'));
          li.append(btn);
        }
        els.statList.append(li);
      }
      show('stats');
      els.statsBack.focus();
    }

    // ---- review -----------------------------------------------------------
    let reviewReturn = 'title';

    /**
     * A stored daily: regenerate its prompts from the key and line up its
     * rounds. If the draw no longer matches the record's fingerprint (the
     * bank was reordered, drawSlots changed) the answers are still shown,
     * but not against prompts they weren't given for.
     */
    function reviewRecord(record, returnTo) {
      const slots = W.run.createRun(bank, { mode: 'daily', dailyKey: record.dailyKey }).state.slots;
      let rows = W.run.reviewRun(bank, slots, record.rounds);
      if (record.draw && record.draw !== W.run.drawId(bank, slots)) {
        rows = rows.map((row) => ({ ...row, prompt: null, rarest: null, foundRarest: false }));
      }
      showReview(rows, record, returnTo);
    }

    /**
     * Every prompt in round order: what was answered (and how obscure it
     * was) and the rarest answer the prompt would have accepted - the reveal
     * a -dle gives after the day's puzzle.
     */
    function showReview(rows, record, returnTo) {
      reviewReturn = returnTo || 'title';
      const daily = record.mode === 'daily' && record.dailyKey;
      els.reviewTitle.textContent = daily ? `Dig #${W.seed.dailyNumber(record.dailyKey)}` : 'This dive';
      els.reviewSub.textContent = daily
        ? `${dailyDate(record.dailyKey)} · ${fmt(record.score)} pts · ${record.deepestStratum}`
        : `Endless · ${fmt(record.score)} pts · ${record.deepestStratum}`;

      els.reviewList.innerHTML = '';
      const line = (className, label, text) => {
        const el = document.createElement('span');
        el.className = `rv-line ${className}`;
        const b = document.createElement('b');
        b.textContent = label;
        el.append(b, text);
        return el;
      };
      for (const row of rows) {
        const li = document.createElement('li');
        if (row.foundRarest) li.className = 'found';
        const n = document.createElement('span');
        n.className = 'rv-n';
        n.textContent = String(row.round);
        const body = document.createElement('span');
        body.className = 'rv-body';
        const prompt = document.createElement('span');
        prompt.className = row.prompt === null ? 'rv-prompt changed' : 'rv-prompt';
        prompt.textContent = row.prompt === null ? 'The prompts have changed since this dig' : row.prompt;
        body.append(prompt);
        body.append(
          row.answer
            ? line('', 'You', `${row.answer.a} · ${Math.round(row.answer.r * 100)}%`)
            : line('missed', 'You', 'missed this one')
        );
        if (row.rarest) {
          body.append(
            row.foundRarest
              ? line('rarest', '★', 'You found the rarest answer there was')
              : line('rarest', 'Rarest', `${row.rarest.name} · ${Math.round(row.rarest.rarity * 100)}% · ${fmtViews(row.rarest.views)} views/mo`)
          );
        }
        li.append(n, body);
        els.reviewList.append(li);
      }
      show('review');
      els.reviewBack.focus();
    }

    function startRun(mode) {
      if (mode === 'daily' && W.persistence.dailyResult(W.seed.dailyKey())) {
        show('title'); // already dug today; the title says so
        return;
      }
      run = W.run.createRun(bank, { mode });
      els.modeLabel.textContent = modeText(run.mode, run.dailyKey);
      renderer.reset();
      hideJackpot();
      hideDud();
      setFeedback('');
      els.lastAnswer.textContent = '';
      els.timerBar.style.width = '100%';
      show('play');
      startRound();
    }

    // ---- wiring -------------------------------------------------------------
    els.dailyBtn.addEventListener('click', () => startRun('daily'));
    els.endlessBtn.addEventListener('click', () => startRun('endless'));
    els.againBtn.addEventListener('click', () => startRun('endless'));
    els.statsBtn.addEventListener('click', showStats);
    els.sumStatsBtn.addEventListener('click', showStats);
    els.sumHomeBtn.addEventListener('click', () => show('title'));
    els.reviewBack.addEventListener('click', () => {
      if (reviewReturn === 'stats') showStats();
      else show(reviewReturn);
    });
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
        drip,
        currentRun: () => run,
        start: startRun,
        diveTo: (d, tier) => renderer.diveTo(d, { tier }),
        celebrate: showJackpot,
        shame: showDud
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
    // `?daily` (for the aggregator link) goes straight into today's dig - or,
    // if it's already been dug, lands on the title showing the result.
    if (root.location && /[?&]daily\b/.test(root.location.search)) startRun('daily');
    requestAnimationFrame(frame);
  }

  return { start };
});
