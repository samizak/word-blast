(function (WB) {
  "use strict";

  const {
    ALIEN_CONFIG,
    POWER_UP_CONFIG,
    DIFFICULTIES,
    GAME_CONFIG,
    getWordsForLevel,
    getCharsPerSecond,
    getFallTime,
    getComboMultiplier,
    getHighScores,
    getHighestScore,
    saveHighScore,
    loadSettings,
    saveSettings,
    ICONS,
    createStars,
    renderHearts,
    createAlienView,
    highlightLetters,
    createParticles,
    stepParticles,
    createLaser,
    createPowerUpView,
    renderActivePowerUps,
    buildSlowTimeEffect,
    renderResults,
    renderScoresTable,
    replay,
    wordLists,
    bossPhrases,
    sound,
  } = WB;

  const $ = (id) => document.getElementById(id);
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  const ui = {
    game: $("game"),
    muteButton: $("mute-button"),
    pauseButton: $("pause-button"),
    startScreen: $("start-screen"),
    startHighScore: $("start-high-score"),
    startHighScoreValue: $("start-high-score-value"),
    startHighScoreLevel: $("start-high-score-level"),
    difficulty: $("difficulty"),
    difficultyHint: $("difficulty-hint"),
    countdown: $("countdown"),
    countdownNumber: $("countdown-number"),
    playArea: $("play-area"),
    statLevel: $("stat-level"),
    statScore: $("stat-score"),
    statCombo: $("stat-combo"),
    statLives: $("stat-lives"),
    activePowerUps: $("active-power-ups"),
    aliens: $("aliens"),
    powerUps: $("power-ups"),
    lasers: $("lasers"),
    player: $("player"),
    ship: $("ship"),
    shield: $("shield-effect"),
    input: $("game-input"),
    slowTime: $("slow-time-effect"),
    flash: $("flash"),
    banner: $("banner"),
    bannerTitle: $("banner-title"),
    bannerText: $("banner-text"),
    pauseMenu: $("pause-menu"),
    gameOver: $("game-over"),
    gameOverTitle: $("game-over-title"),
    newRecord: $("new-record"),
    results: $("results"),
    scoresModal: $("scores-modal"),
    scoresTable: $("scores-table"),
    settingsModal: $("settings-modal"),
    volume: $("volume"),
    reducedMotion: $("reduced-motion"),
    errorScreen: $("error-screen"),
  };

  const settings = loadSettings();
  if (!DIFFICULTIES[settings.difficulty]) settings.difficulty = "normal";

  // "start" | "countdown" | "playing" | "paused" | "gameOver"
  let phase = "start";
  let mode = DIFFICULTIES[settings.difficulty];
  let nextId = 1;
  let countdownRun = 0;
  let bannerRun = 0;
  let playerPosition = 50;
  let lastSavedRank = -1;
  let state = createState();

  function createState() {
    return {
      level: 1,
      score: 0,
      lives: mode.lives,
      kills: 0, // planets destroyed in the current level
      combo: 0,
      bestCombo: 0,
      words: 0,
      correctKeys: 0,
      wrongKeys: 0,
      // Milliseconds of actual play. Pausing stops it, so power-up durations
      // and delayed actions do not run down while the game is paused.
      clock: 0,
      timers: [],
      spawnIn: 0,
      powerUpTimer: 0,
      aliens: [],
      powerUps: [],
      active: {}, // timed power-up type -> clock time at which it ends
      boss: null,
      bossPending: false,
      typed: "",
      locked: null,
    };
  }

  /* ---------- Phase and screen switching ---------- */

  function setPhase(next) {
    phase = next;
    const inGame = next === "playing" || next === "paused";

    ui.startScreen.hidden = next !== "start";
    ui.countdown.hidden = next !== "countdown";
    ui.playArea.hidden = next !== "playing" && next !== "countdown";
    ui.pauseMenu.hidden = next !== "paused";
    ui.gameOver.hidden = next !== "gameOver";
    if (next === "start" || next === "gameOver") ui.banner.hidden = true;

    ui.pauseButton.hidden = !inGame;
    ui.pauseButton.innerHTML = next === "paused" ? ICONS.play : ICONS.pause;
    ui.pauseButton.setAttribute(
      "aria-label",
      next === "paused" ? "Resume game" : "Pause game"
    );

    sound.setAtmosphere(next === "playing");

    if (next === "start") renderStartScreen();
    if (next === "playing") ui.input.focus();
  }

  function renderStartScreen() {
    const best = getHighestScore();
    ui.startHighScore.hidden = !best;
    if (best) {
      ui.startHighScoreValue.textContent = Number(best.score).toLocaleString();
      ui.startHighScoreLevel.textContent = `Level ${best.level}`;
    }

    for (const button of ui.difficulty.children) {
      const selected = button.dataset.mode === settings.difficulty;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-checked", selected);
    }
    ui.difficultyHint.textContent = mode.hint;
  }

  function renderStats() {
    ui.statLevel.textContent = state.level;
    ui.statScore.textContent = state.score.toLocaleString();
    ui.statCombo.textContent = `×${getComboMultiplier(state.combo)}`;
    ui.statCombo.title = `${state.combo} in a row`;
    renderHearts(ui.statLives, state.lives, Math.min(mode.lives, 5));
  }

  function renderMuteButton() {
    const muted = sound.isMuted();
    ui.muteButton.innerHTML = muted ? ICONS.volumeOff : ICONS.volumeOn;
    ui.muteButton.setAttribute("aria-label", muted ? "Unmute" : "Mute");
  }

  /** Big centred announcement: level up, boss warning. */
  function showBanner(title, text, variant = "") {
    const run = ++bannerRun;
    ui.banner.className = `banner ${variant}`;
    ui.bannerTitle.textContent = title;
    ui.bannerText.textContent = text;
    replay(ui.banner);
    setTimeout(() => {
      if (run === bannerRun) ui.banner.hidden = true;
    }, GAME_CONFIG.bannerDuration);
  }

  /** Screen shake and coloured flash; skipped when motion is reduced. */
  function impact(variant) {
    if (settings.reducedMotion) return;
    ui.flash.className = `flash ${variant}`;
    replay(ui.flash, "active");
    replay(ui.game, "shake");
  }

  /* ---------- Starting, pausing and ending ---------- */

  function resetGame() {
    ui.aliens.replaceChildren();
    ui.powerUps.replaceChildren();
    ui.lasers.replaceChildren();
    ui.input.value = "";
    ui.banner.hidden = true;
    ui.ship.style.rotate = "0deg";

    state = createState();
    renderStats();
    renderPowerUpEffects();
  }

  function startGame() {
    closeModals();
    resetGame();
    setPhase("countdown");
    ui.input.focus();

    const run = ++countdownRun;
    let count = 3;
    ui.countdownNumber.textContent = count;
    sound.play("countdown");

    const interval = setInterval(() => {
      if (run !== countdownRun || phase !== "countdown") {
        clearInterval(interval);
        return;
      }
      count -= 1;
      ui.countdownNumber.textContent = count === 0 ? "GO!" : count;
      if (count === 0) {
        clearInterval(interval);
        setTimeout(() => {
          if (run === countdownRun && phase === "countdown") {
            setPhase("playing");
          }
        }, 1000);
      }
    }, 1000);
  }

  function togglePause() {
    if (phase === "playing") setPhase("paused");
    else if (phase === "paused") setPhase("playing");
  }

  function quit() {
    // Zen has no game over, so quitting is how a session gets its summary.
    if (mode.zen && state.words > 0) {
      endGame("Session Over");
    } else {
      resetGame();
      setPhase("start");
    }
  }

  function endGame(title = "Game Over") {
    setPhase("gameOver");

    const minutes = state.clock / 60000;
    const keys = state.correctKeys + state.wrongKeys;
    const wpm = minutes > 0 ? Math.round(state.correctKeys / 5 / minutes) : 0;
    const accuracy = keys > 0 ? Math.round((state.correctKeys / keys) * 100) : 100;

    lastSavedRank = -1;
    if (!mode.zen && state.score > 0) {
      lastSavedRank = saveHighScore({
        score: state.score,
        level: state.level,
        wpm,
        accuracy,
        mode: settings.difficulty,
      });
    }

    ui.gameOverTitle.textContent = title;
    ui.newRecord.hidden = lastSavedRank !== 0;
    renderResults(ui.results, [
      ["Score", state.score.toLocaleString()],
      ["Level", state.level],
      ["WPM", wpm],
      ["Accuracy", `${accuracy}%`],
      ["Best combo", state.bestCombo],
      ["Words", state.words],
    ]);

    if (!mode.zen) setTimeout(() => sound.play("gameOver"), 100);
  }

  /* ---------- Menus ---------- */

  function openScores(highlightIndex = -1) {
    renderScoresTable(ui.scoresTable, getHighScores(), highlightIndex);
    ui.scoresModal.hidden = false;
  }

  function openSettings() {
    ui.volume.value = Math.round(settings.volume * 100);
    ui.reducedMotion.checked = settings.reducedMotion;
    ui.settingsModal.hidden = false;
  }

  /** Returns true if a modal was open. */
  function closeModals() {
    const wasOpen = !ui.scoresModal.hidden || !ui.settingsModal.hidden;
    ui.scoresModal.hidden = true;
    ui.settingsModal.hidden = true;
    if (wasOpen && phase === "playing") ui.input.focus();
    return wasOpen;
  }

  function applySettings() {
    sound.setVolume(settings.volume);
    sound.setMuted(settings.muted);
    document.body.classList.toggle("reduced-motion", settings.reducedMotion);
    renderMuteButton();
  }

  function selectDifficulty(name) {
    if (!DIFFICULTIES[name]) return;
    settings.difficulty = name;
    mode = DIFFICULTIES[name];
    saveSettings(settings);
    renderStartScreen();
  }

  /* ---------- Game-clock timers ---------- */

  /** Run fn after ms of play time (not wall-clock time). */
  function after(ms, fn) {
    state.timers.push({ at: state.clock + ms, fn });
  }

  function runTimers() {
    const due = state.timers.filter((timer) => timer.at <= state.clock);
    if (due.length === 0) return;
    state.timers = state.timers.filter((timer) => timer.at > state.clock);
    for (const timer of due) timer.fn();
  }

  /* ---------- Words ---------- */

  const RESERVED_WORDS = new Set(
    Object.values(POWER_UP_CONFIG.types).map((type) => type.word.toLowerCase())
  );

  /** Everything on screen that can currently be typed. */
  function getTargets() {
    return [
      ...state.aliens.filter((alien) => !alien.completed),
      ...state.powerUps,
    ];
  }

  /**
   * Pick a word from a tier. Words that share a first letter with something
   * already on screen are avoided, so one keystroke selects one target.
   */
  function pickWord(tier, exclude = []) {
    const list = wordLists[clamp(tier, 0, wordLists.length - 1)];
    const active = [...getTargets().map((target) => target.word), ...exclude];
    const usable = list.filter((word) => !RESERVED_WORDS.has(word));

    const distinct = usable.filter(
      (word) => !active.some((other) => other[0] === word[0])
    );
    if (distinct.length > 0) return pick(distinct);

    const unambiguous = usable.filter(
      (word) =>
        !active.some(
          (other) => other.startsWith(word) || word.startsWith(other)
        )
    );
    return unambiguous.length > 0 ? pick(unambiguous) : null;
  }

  /* ---------- Aliens ---------- */

  function rollKind() {
    const roll = Math.random();
    let threshold = 0;
    for (const [kind, config] of Object.entries(ALIEN_CONFIG.kinds)) {
      if (state.level < config.fromLevel) continue;
      threshold += config.chance;
      if (roll < threshold) return kind;
    }
    return "normal";
  }

  function addAlien({ kind, words, x, y, fallTime, size }) {
    const view = createAlienView({ kind, words, size });
    const alien = {
      id: nextId++,
      kind,
      words,
      wordIndex: 0,
      word: words[0],
      x: clamp(x ?? Infinity, 8, Math.max(8, ui.game.clientWidth - view.size - 8)),
      y: y ?? -view.size,
      size: view.size,
      fallTime,
      completed: false,
      view,
      particles: [],
    };
    alien.view.root.style.translate = `${alien.x}px ${alien.y}px`;
    ui.aliens.appendChild(alien.view.root);
    state.aliens.push(alien);
    return alien;
  }

  function spawnAlien(forcedKind) {
    const alive = state.aliens.filter((alien) => !alien.completed).length;
    if (
      state.boss ||
      state.bossPending ||
      alive >= ALIEN_CONFIG.maxSimultaneousWords
    ) {
      state.spawnIn = 500;
      return;
    }

    const tier = Math.min(state.level, wordLists.length) - 1;
    const kind = forcedKind || rollKind();
    let words;
    if (kind === "fast") {
      words = [pickWord(tier - 2)];
    } else if (kind === "armoured") {
      const first = pickWord(tier - 1);
      words = [first, first && pickWord(tier - 1, [first])];
    } else {
      // A share of easier words keeps each level from feeling uniform.
      words = [pickWord(Math.random() < 0.3 ? tier - 1 : tier)];
    }
    if (words.includes(null)) {
      state.spawnIn = 500;
      return;
    }

    const factor = ALIEN_CONFIG.kinds[kind]?.fallTimeFactor ?? 1;
    const width = ui.game.clientWidth;
    addAlien({
      kind,
      words,
      x: Math.random() * (width - 200) + 20,
      fallTime: getFallTime(mode, state.level) * factor,
    });

    // The next planet arrives once a typist at this level's pace would have
    // had time to finish this one.
    const letters = words.reduce((sum, word) => sum + word.length, 0);
    state.spawnIn = Math.max(
      ALIEN_CONFIG.minSpawnDelay,
      ((letters + 1) / getCharsPerSecond(mode, state.level)) * 1000
    );
  }

  function spawnSplitterChildren(parent) {
    const centerX = parent.x + parent.size / 2;
    const exclude = [];
    for (const direction of [-1, 1]) {
      const word = pickWord(0, exclude);
      if (!word) continue;
      exclude.push(word);
      const child = addAlien({
        kind: "mini",
        words: [word],
        x: centerX + direction * 70 - 40,
        y: parent.y,
        fallTime: getFallTime(mode, state.level),
      });
      child.view.root.classList.add("spawned");
    }
  }

  function spawnBoss() {
    const words = pick(bossPhrases);
    const letters = words.reduce((sum, word) => sum + word.length, 0);
    const size = Math.min(220, ui.game.clientWidth * 0.5);
    state.bossPending = false;
    state.boss = addAlien({
      kind: "boss",
      words,
      size,
      x: (ui.game.clientWidth - size) / 2,
      // Slow enough to finish the phrase at a little under this level's pace.
      fallTime: Math.max(
        25,
        letters / (getCharsPerSecond(mode, state.level) * 0.7)
      ),
    });
  }

  function explodeAlien(alien) {
    alien.completed = true;
    alien.view.root.classList.add("exploding");
    const isBoss = alien.kind === "boss";
    alien.particles = createParticles(
      alien.view.root,
      alien.size,
      isBoss ? 14 : alien.word.length,
      isBoss ? 60 : Math.min(alien.word.length * 8, 40),
      isBoss ? 1.8 : 1
    );
    if (state.locked === alien) clearTyped();
    after(GAME_CONFIG.explosionDuration, () => {
      alien.view.root.remove();
      state.aliens = state.aliens.filter((other) => other !== alien);
    });
  }

  function addScore(base) {
    const doubled = isActive("double") ? 2 : 1;
    state.score += Math.round(
      base * getComboMultiplier(state.combo) * doubled * mode.scoreMultiplier
    );
  }

  /** The player finished typing the alien's current word. */
  function completeWord(alien) {
    const previousMultiplier = getComboMultiplier(state.combo);
    state.combo += 1;
    state.bestCombo = Math.max(state.bestCombo, state.combo);
    state.words += 1;
    addScore(alien.word.length * GAME_CONFIG.scorePerLetter);

    fireLaser(alien);
    sound.play("laser");
    if (getComboMultiplier(state.combo) > previousMultiplier) {
      sound.play("combo");
      replay(ui.statCombo, "pop");
    }

    if (alien.wordIndex < alien.words.length - 1) damageAlien(alien);
    else destroyAlien(alien);
    renderStats();
  }

  /** Knock one word off a multi-word alien (armoured planets, bosses). */
  function damageAlien(alien) {
    alien.wordIndex += 1;
    alien.word = alien.words[alien.wordIndex];
    alien.view.showWord(alien.wordIndex);
    alien.view.root.classList.remove("armoured");
    replay(alien.view.root, "damaged");
    sound.play("hit");
  }

  function destroyAlien(alien) {
    explodeAlien(alien);
    setTimeout(() => sound.play("explosion"), 150);

    if (alien.kind === "splitter") spawnSplitterChildren(alien);

    if (alien.kind === "boss") {
      state.boss = null;
      addScore(
        GAME_CONFIG.bossBonus * (state.level / ALIEN_CONFIG.bossEvery)
      );
      impact("bomb");
      after(1200, levelUp);
    } else {
      state.kills += 1;
      checkLevelProgress();
    }
  }

  function checkLevelProgress() {
    if (state.boss || state.bossPending) return;
    if (state.kills < getWordsForLevel(state.level)) return;

    if (state.level % ALIEN_CONFIG.bossEvery === 0) {
      state.bossPending = true;
      showBanner("Warning", "Boss approaching", "boss");
      sound.play("warning");
      after(GAME_CONFIG.bannerDuration, spawnBoss);
    } else {
      levelUp();
    }
  }

  function levelUp() {
    state.level += 1;
    state.kills = 0;
    state.spawnIn = Math.min(state.spawnIn, 1000);
    sound.play("levelUp");
    showBanner("Level Up!", `Level ${state.level}`);
    renderStats();
    replay(ui.statLevel, "pop");
  }

  /** An alien reached the ship. */
  function missAlien(alien) {
    const isBoss = alien.kind === "boss";
    explodeAlien(alien);
    sound.play("explosion");

    if (!isActive("shield")) {
      state.combo = 0;
      if (!mode.zen) {
        state.lives -= isBoss ? GAME_CONFIG.bossLifeCost : 1;
      }
      impact("miss");
    }

    if (isBoss) {
      state.boss = null;
      after(1200, levelUp);
    }
    renderStats();
  }

  function fireLaser(target) {
    const gameRect = ui.game.getBoundingClientRect();
    const playerRect = ui.player.getBoundingClientRect();
    createLaser(
      ui.lasers,
      playerRect.left - gameRect.left + playerRect.width / 2,
      playerRect.top - gameRect.top + playerRect.height / 2,
      target.x + target.size / 2,
      target.y + target.size / 2
    );
  }

  /* ---------- Power-ups ---------- */

  function isActive(type) {
    return state.active[type] !== undefined;
  }

  function spawnPowerUp(forcedType) {
    const onScreen = new Set(state.powerUps.map((powerUp) => powerUp.type));
    const choices = Object.entries(POWER_UP_CONFIG.types).filter(
      ([type]) =>
        !onScreen.has(type) &&
        !(
          type === "life" &&
          (mode.zen || state.lives >= POWER_UP_CONFIG.maxLives)
        )
    );
    if (choices.length === 0) return;

    let type = forcedType;
    if (!type) {
      const total = choices.reduce((sum, [, config]) => sum + config.weight, 0);
      let roll = Math.random() * total;
      for (const [name, config] of choices) {
        roll -= config.weight;
        if (roll < 0) {
          type = name;
          break;
        }
      }
    }

    const view = createPowerUpView(type);
    const powerUp = {
      id: nextId++,
      isPowerUp: true,
      type,
      word: POWER_UP_CONFIG.types[type].word.toLowerCase(),
      x: Math.random() * Math.max(0, ui.game.clientWidth - 160) + 40,
      y: -80,
      size: 80,
      view,
    };
    view.root.style.translate = `${powerUp.x}px ${powerUp.y}px`;
    ui.powerUps.appendChild(view.root);
    state.powerUps.push(powerUp);
  }

  function removePowerUp(powerUp) {
    powerUp.view.root.remove();
    state.powerUps = state.powerUps.filter((other) => other !== powerUp);
    if (state.locked === powerUp) clearTyped();
  }

  function activatePowerUp(powerUp) {
    const config = POWER_UP_CONFIG.types[powerUp.type];
    removePowerUp(powerUp);
    sound.play("powerUp");

    if (powerUp.type === "bomb") {
      detonateBomb();
    } else if (powerUp.type === "life") {
      state.lives = Math.min(POWER_UP_CONFIG.maxLives, state.lives + 1);
    } else {
      // Collecting a second one of the same type extends the time remaining.
      const base = Math.max(state.active[powerUp.type] ?? 0, state.clock);
      state.active[powerUp.type] = base + config.duration;
    }

    renderStats();
    renderPowerUpEffects();
  }

  /** Destroy every planet on screen; a boss loses one word instead. */
  function detonateBomb() {
    impact("bomb");
    sound.play("explosion");
    for (const alien of [...state.aliens]) {
      if (alien.completed) continue;
      if (alien.kind === "boss" && alien.wordIndex < alien.words.length - 1) {
        damageAlien(alien);
      } else {
        addScore(alien.word.length * GAME_CONFIG.scorePerLetter);
        destroyAlien(alien);
      }
    }
  }

  function renderPowerUpEffects() {
    ui.shield.hidden = !isActive("shield");
    ui.slowTime.hidden = !isActive("slowTime");
    document.body.classList.toggle("slow-time", isActive("slowTime"));
    ui.playArea.classList.toggle("frozen", isActive("freeze"));
    ui.playArea.classList.toggle("double-score", isActive("double"));
    renderActivePowerUps(
      ui.activePowerUps,
      Object.entries(state.active).map(([type, endTime]) => ({
        type,
        seconds: Math.ceil((endTime - state.clock) / 1000),
      }))
    );
  }

  /* ---------- Typing ---------- */

  /**
   * The target the typed text points at. The locked target is kept while it
   * still matches; otherwise the matching target closest to the ship wins.
   */
  function findTarget(text) {
    if (!text) return null;
    const matches = getTargets().filter((target) =>
      target.word.startsWith(text)
    );
    if (matches.includes(state.locked)) return state.locked;
    return matches.reduce(
      (lowest, target) =>
        !lowest || target.y + target.size > lowest.y + lowest.size
          ? target
          : lowest,
      null
    );
  }

  function setTyped(text, target) {
    if (state.locked && state.locked !== target) {
      state.locked.view.root.classList.remove("locked");
      highlightLetters(state.locked.view.letters, 0);
    }
    state.typed = text;
    state.locked = target;
    ui.input.value = text;
    if (target) {
      target.view.root.classList.add("locked");
      highlightLetters(target.view.letters, text.length);
    }
  }

  function clearTyped() {
    setTyped("", null);
  }

  function handleInput() {
    const raw = ui.input.value.toLowerCase();
    // Space lets go of the current target.
    if (phase !== "playing" || /\s/.test(raw)) {
      clearTyped();
      return;
    }

    const text = raw.replace(/[^a-z]/g, "");
    const previous = state.typed;
    if (text === previous) {
      ui.input.value = text;
      return;
    }

    const target = findTarget(text);

    // Deleting is always allowed; a new letter must match something.
    if (text.length <= previous.length) {
      setTyped(target ? text : "", target);
      return;
    }
    if (!target) {
      state.wrongKeys += 1;
      state.combo = 0;
      ui.input.value = previous;
      sound.play("typo");
      replay(ui.input, "typo");
      renderStats();
      return;
    }

    state.correctKeys += text.length - previous.length;
    setTyped(text, target);

    if (target.word === text) {
      clearTyped();
      if (target.isPowerUp) activatePowerUp(target);
      else completeWord(target);
    }
  }

  function movePlayer(delta) {
    playerPosition = clamp(playerPosition + delta, 0, 100);
    ui.player.style.left = `${playerPosition}%`;
  }

  /** Lean the ship toward whatever is locked. */
  function aimShip() {
    let angle = 0;
    const target = state.locked;
    if (target) {
      const gameRect = ui.game.getBoundingClientRect();
      const playerRect = ui.player.getBoundingClientRect();
      const dx =
        target.x +
        target.size / 2 -
        (playerRect.left - gameRect.left + playerRect.width / 2);
      const dy =
        playerRect.top -
        gameRect.top +
        playerRect.height / 2 -
        (target.y + target.size / 2);
      angle = clamp((Math.atan2(dx, Math.max(dy, 1)) * 180) / Math.PI, -30, 30);
    }
    ui.ship.style.rotate = `${angle}deg`;
  }

  /* ---------- Main loop ---------- */

  function update(dt) {
    state.clock += dt;
    runTimers();

    state.spawnIn -= dt;
    if (state.spawnIn <= 0) spawnAlien();

    state.powerUpTimer += dt;
    if (state.powerUpTimer >= POWER_UP_CONFIG.spawnInterval) {
      state.powerUpTimer = 0;
      spawnPowerUp();
    }

    for (const type of Object.keys(state.active)) {
      if (state.active[type] <= state.clock) delete state.active[type];
    }
    renderPowerUpEffects();

    const seconds = dt / 1000;
    const timeScale = isActive("freeze")
      ? 0
      : isActive("slowTime")
      ? POWER_UP_CONFIG.types.slowTime.factor
      : 1;
    // Planets are lost when their centre reaches the middle of the ship.
    const shipLine = ui.player.offsetTop + ui.player.offsetHeight / 2;
    const livesBefore = state.lives;

    for (const alien of [...state.aliens]) {
      if (alien.completed) {
        stepParticles(alien.particles, dt);
        continue;
      }
      alien.y += (shipLine / alien.fallTime) * seconds * timeScale;
      alien.view.root.style.translate = `${alien.x}px ${alien.y}px`;
      if (alien.y + alien.size / 2 >= shipLine) missAlien(alien);
    }

    for (const powerUp of [...state.powerUps]) {
      powerUp.y += POWER_UP_CONFIG.fallSpeed * seconds;
      powerUp.view.root.style.translate = `${powerUp.x}px ${powerUp.y}px`;
      if (powerUp.y >= ui.game.clientHeight) removePowerUp(powerUp);
    }

    aimShip();

    if (state.lives !== livesBefore && state.lives <= 0) endGame();
  }

  let lastFrame = performance.now();

  function frame(now) {
    // Cap the step so a background tab or a long stall does not teleport
    // aliens.
    const dt = Math.min(now - lastFrame, 100);
    lastFrame = now;

    try {
      if (phase === "playing") update(dt);
    } catch (error) {
      console.error("Uncaught error:", error);
      for (const child of ui.game.children) child.hidden = true;
      ui.errorScreen.hidden = false;
      sound.setAtmosphere(false);
      return;
    }

    requestAnimationFrame(frame);
  }

  /** Keep the game inside the visible area when a phone keyboard opens. */
  function syncViewport() {
    const viewport = window.visualViewport;
    const height = viewport ? viewport.height : window.innerHeight;
    document.documentElement.style.setProperty("--app-height", `${height}px`);
    if (viewport) window.scrollTo(0, 0);
  }

  /* ---------- Wiring ---------- */

  createStars($("stars"));
  buildSlowTimeEffect(ui.slowTime);
  applySettings();
  syncViewport();
  resetGame();
  setPhase("start");

  $("start-button").addEventListener("click", startGame);
  $("play-again-button").addEventListener("click", startGame);
  $("restart-button").addEventListener("click", startGame);
  $("resume-button").addEventListener("click", togglePause);
  $("quit-button").addEventListener("click", quit);
  $("menu-button").addEventListener("click", () => {
    resetGame();
    setPhase("start");
  });
  $("reload-button").addEventListener("click", () => location.reload());

  $("scores-button").addEventListener("click", () => openScores());
  $("game-over-scores-button").addEventListener("click", () =>
    openScores(lastSavedRank)
  );
  $("settings-button").addEventListener("click", openSettings);
  $("pause-settings-button").addEventListener("click", openSettings);
  for (const modal of [ui.scoresModal, ui.settingsModal]) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal || event.target.closest("[data-close]")) {
        closeModals();
      }
    });
  }

  ui.difficulty.addEventListener("click", (event) => {
    const button = event.target.closest("[data-mode]");
    if (button) selectDifficulty(button.dataset.mode);
  });

  ui.volume.addEventListener("input", () => {
    settings.volume = ui.volume.value / 100;
    applySettings();
    saveSettings(settings);
  });
  ui.volume.addEventListener("change", () => sound.play("powerUp"));
  ui.reducedMotion.addEventListener("change", () => {
    settings.reducedMotion = ui.reducedMotion.checked;
    applySettings();
    saveSettings(settings);
  });

  ui.pauseButton.addEventListener("click", togglePause);
  ui.muteButton.addEventListener("click", () => {
    settings.muted = !settings.muted;
    applySettings();
    saveSettings(settings);
    if (phase === "playing") ui.input.focus();
  });

  ui.input.addEventListener("input", handleInput);

  // Tapping the play field must not take focus (and the phone keyboard) away.
  ui.playArea.addEventListener("pointerdown", (event) => {
    if (event.target !== ui.input) {
      event.preventDefault();
      ui.input.focus();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (!closeModals()) togglePause();
    } else if (event.key === "Enter" && phase === "playing") {
      clearTyped();
    } else if (event.key === "ArrowLeft") {
      movePlayer(-2);
    } else if (event.key === "ArrowRight") {
      movePlayer(2);
    }
  });

  window.addEventListener("resize", syncViewport);
  window.visualViewport?.addEventListener("resize", syncViewport);

  // Hooks for the browser console and automated tests.
  WB.debug = {
    get state() {
      return state;
    },
    spawnAlien,
    spawnPowerUp,
    checkLevelProgress,
  };

  requestAnimationFrame(frame);
})((window.WordBlast = window.WordBlast || {}));
