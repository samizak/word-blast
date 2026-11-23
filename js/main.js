(function (WB) {
  "use strict";

  const {
    ALIEN_CONFIG,
    POWER_UP_CONFIG,
    GAME_CONFIG,
    TICKS_PER_SECOND,
    getMaxWordsForLevel,
    getSpawnIntervalForLevel,
    getAlienSpeedForLevel,
    getHighestScore,
    saveHighScore,
    ICONS,
    createStars,
    renderHearts,
    createAlienElement,
    highlightLetters,
    createParticles,
    stepParticles,
    createLaser,
    createPowerUpElement,
    renderActivePowerUps,
    buildSlowTimeEffect,
    replay,
    wordLists,
    sound,
  } = WB;

  const $ = (id) => document.getElementById(id);

  const ui = {
    game: $("game"),
    muteButton: $("mute-button"),
    pauseButton: $("pause-button"),
    startScreen: $("start-screen"),
    startHighScore: $("start-high-score"),
    startHighScoreValue: $("start-high-score-value"),
    startHighScoreLevel: $("start-high-score-level"),
    countdown: $("countdown"),
    countdownNumber: $("countdown-number"),
    playArea: $("play-area"),
    statLevel: $("stat-level"),
    statScore: $("stat-score"),
    statHighScoreWrap: $("stat-high-score-wrap"),
    statHighScore: $("stat-high-score"),
    statLives: $("stat-lives"),
    activePowerUps: $("active-power-ups"),
    aliens: $("aliens"),
    powerUps: $("power-ups"),
    lasers: $("lasers"),
    player: $("player"),
    shield: $("shield-effect"),
    input: $("game-input"),
    slowTime: $("slow-time-effect"),
    levelUp: $("level-up"),
    levelUpLevel: $("level-up-level"),
    pauseMenu: $("pause-menu"),
    gameOver: $("game-over"),
    finalScore: $("final-score"),
    finalLevel: $("final-level"),
    finalHighScore: $("final-high-score"),
    errorScreen: $("error-screen"),
  };

  // "start" | "countdown" | "playing" | "paused" | "gameOver"
  let phase = "start";
  let nextId = 1;
  let countdownRun = 0;
  let playerPosition = 50;

  const state = {
    level: 1,
    score: 0,
    lives: GAME_CONFIG.initialLives,
    // Counts both spawns and kills, so a level ends after roughly half its
    // word quota has been destroyed. This matches the original game's pacing.
    wordsInLevel: 0,
    levelingUp: false,
    spawnInterval: ALIEN_CONFIG.baseSpawnInterval,
    spawnTimer: 0,
    powerUpTimer: 0,
    // Milliseconds of actual play. Pausing stops it, so power-up durations and
    // delayed actions do not run down while the game is paused.
    clock: 0,
    timers: [],
    aliens: [],
    powerUps: [],
    active: {}, // power-up type -> clock time at which it ends
  };

  /* ---------- Phase and screen switching ---------- */

  function setPhase(next) {
    phase = next;
    const inGame = next === "playing" || next === "paused";

    ui.startScreen.hidden = next !== "start";
    ui.countdown.hidden = next !== "countdown";
    ui.playArea.hidden = next !== "playing" && next !== "countdown";
    ui.pauseMenu.hidden = next !== "paused";
    ui.gameOver.hidden = next !== "gameOver";
    if (next === "start" || next === "gameOver") ui.levelUp.hidden = true;

    ui.pauseButton.hidden = !inGame;
    ui.pauseButton.innerHTML = next === "paused" ? ICONS.play : ICONS.pause;
    ui.pauseButton.setAttribute(
      "aria-label",
      next === "paused" ? "Resume game" : "Pause game"
    );

    sound.setAtmosphere(next === "playing");

    if (next === "start") renderStartHighScore();
    if (next === "playing") ui.input.focus();
  }

  function renderStartHighScore() {
    const best = getHighestScore();
    ui.startHighScore.hidden = !best;
    if (!best) return;
    ui.startHighScoreValue.textContent = best.score;
    ui.startHighScoreLevel.textContent = `Level ${best.level}`;
  }

  function renderStats() {
    ui.statLevel.textContent = state.level;
    ui.statScore.textContent = state.score.toLocaleString();
    renderHearts(ui.statLives, state.lives, GAME_CONFIG.initialLives);
  }

  function renderMuteButton() {
    const muted = sound.isMuted();
    ui.muteButton.innerHTML = muted ? ICONS.volumeOff : ICONS.volumeOn;
    ui.muteButton.setAttribute("aria-label", muted ? "Unmute" : "Mute");
  }

  /* ---------- Starting, pausing and ending ---------- */

  function resetGame() {
    ui.aliens.replaceChildren();
    ui.powerUps.replaceChildren();
    ui.lasers.replaceChildren();
    ui.input.value = "";
    ui.levelUp.hidden = true;

    Object.assign(state, {
      level: 1,
      score: 0,
      lives: GAME_CONFIG.initialLives,
      wordsInLevel: 0,
      levelingUp: false,
      spawnInterval: ALIEN_CONFIG.baseSpawnInterval,
      spawnTimer: 0,
      powerUpTimer: 0,
      clock: 0,
      timers: [],
      aliens: [],
      powerUps: [],
      active: {},
    });

    const best = getHighestScore();
    ui.statHighScoreWrap.hidden = !best;
    if (best) ui.statHighScore.textContent = best.score.toLocaleString();

    renderStats();
    renderPowerUpEffects();
  }

  function startGame() {
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
          if (run === countdownRun && phase === "countdown") setPhase("playing");
        }, 1000);
      }
    }, 1000);
  }

  function togglePause() {
    if (phase === "playing") setPhase("paused");
    else if (phase === "paused") setPhase("playing");
  }

  function quitToStart() {
    resetGame();
    setPhase("start");
  }

  function endGame() {
    setPhase("gameOver");

    const best = getHighestScore();
    if (!best || state.score > best.score) {
      saveHighScore(state.score, state.level);
    }

    ui.finalScore.textContent = `Final Score: ${state.score}`;
    ui.finalLevel.textContent = `Level: ${state.level}`;
    ui.finalHighScore.textContent = `High Score: ${Math.max(
      state.score,
      best?.score ?? 0
    )}`;

    setTimeout(() => sound.play("gameOver"), 100);
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

  /* ---------- Aliens ---------- */

  function spawnAlien() {
    if (state.wordsInLevel >= getMaxWordsForLevel(state.level)) return;
    if (state.aliens.length >= ALIEN_CONFIG.maxSimultaneousWords) return;

    const wordList = wordLists[Math.min(state.level - 1, wordLists.length - 1)];
    const activeWords = new Set(state.aliens.map((alien) => alien.word));
    const available = wordList.filter((word) => !activeWords.has(word));
    if (available.length === 0) return;

    const word = available[Math.floor(Math.random() * available.length)];
    const { root, letters, size } = createAlienElement(word);

    const width = ui.game.clientWidth;
    const margin = Math.max(80, word.length * 10 + 40);
    const x = Math.max(
      0,
      Math.min(
        margin + Math.random() * (width - 2 * margin),
        width - size
      )
    );

    const alien = {
      id: nextId++,
      word,
      x,
      y: 0,
      speed: getAlienSpeedForLevel(state.level),
      size,
      completed: false,
      root,
      letters,
      particles: [],
    };

    root.style.translate = `${x}px 0px`;
    highlightLetters(letters, word, ui.input.value);
    ui.aliens.appendChild(root);
    state.aliens.push(alien);
    state.wordsInLevel += 1;
  }

  function explodeAlien(alien) {
    alien.completed = true;
    alien.root.classList.add("exploding");
    alien.particles = createParticles(alien.root, alien.size, alien.word);
    after(GAME_CONFIG.explosionDuration, () => removeAlien(alien));
  }

  function removeAlien(alien) {
    alien.root.remove();
    state.aliens = state.aliens.filter((other) => other !== alien);
    // The original restarted its spawn interval whenever the alien list
    // changed; keeping that preserves the gap between waves.
    state.spawnTimer = 0;

    // If the quota was filled by spawns and the last alien got through, no
    // kill is left to trigger the level-up, so do it here instead of stalling.
    const quotaReached =
      state.wordsInLevel >= getMaxWordsForLevel(state.level);
    if (quotaReached && !state.levelingUp && state.aliens.length === 0) {
      levelUp();
    }
  }

  function destroyAlien(alien) {
    fireLaser(alien);
    explodeAlien(alien);
    sound.play("laser");
    setTimeout(() => sound.play("explosion"), 150);

    state.score += alien.word.length * GAME_CONFIG.scoreMultiplier;
    state.wordsInLevel += 1;
    state.spawnTimer = 0;

    if (
      state.wordsInLevel >= getMaxWordsForLevel(state.level) &&
      !state.levelingUp
    ) {
      levelUp();
    }
    renderStats();
  }

  function missAlien(alien) {
    explodeAlien(alien);
    sound.play("explosion");
    if (!isActive("shield")) state.lives -= 1;
  }

  function fireLaser(alien) {
    const gameRect = ui.game.getBoundingClientRect();
    const playerRect = ui.player.getBoundingClientRect();
    createLaser(
      ui.lasers,
      playerRect.left - gameRect.left + playerRect.width / 2,
      playerRect.top - gameRect.top + playerRect.height / 2,
      alien.x + alien.size / 2,
      alien.y + alien.size / 2
    );
  }

  function levelUp() {
    state.levelingUp = true;
    sound.play("levelUp");

    ui.levelUpLevel.textContent = `Level ${state.level + 1}`;
    replay(ui.levelUp);

    after(GAME_CONFIG.levelUpDelay, () => {
      state.level += 1;
      state.wordsInLevel = 0;
      state.spawnInterval = getSpawnIntervalForLevel(state.level);
      state.spawnTimer = 0;
      renderStats();
      replay(ui.statLevel, "pop");
    });

    after(GAME_CONFIG.levelUpDuration, () => {
      state.levelingUp = false;
      ui.levelUp.hidden = true;
    });
  }

  /* ---------- Power-ups ---------- */

  function isActive(type) {
    return state.active[type] !== undefined;
  }

  function spawnPowerUp() {
    const type = Math.random() < 0.5 ? "slowTime" : "shield";
    const root = createPowerUpElement(type);
    const powerUp = {
      id: nextId++,
      type,
      word: POWER_UP_CONFIG[type].word,
      x: Math.random() * (ui.game.clientWidth - 100) + 50,
      y: -50,
      root,
    };
    root.style.translate = `${powerUp.x}px ${powerUp.y}px`;
    ui.powerUps.appendChild(root);
    state.powerUps.push(powerUp);
  }

  function removePowerUp(powerUp) {
    powerUp.root.remove();
    state.powerUps = state.powerUps.filter((other) => other !== powerUp);
  }

  function activatePowerUp(powerUp) {
    const { duration } = POWER_UP_CONFIG[powerUp.type];
    // Collecting a second one of the same type extends the time remaining.
    const base = Math.max(state.active[powerUp.type] ?? 0, state.clock);
    state.active[powerUp.type] = base + duration;
    removePowerUp(powerUp);
    renderPowerUpEffects();
  }

  function renderPowerUpEffects() {
    ui.shield.hidden = !isActive("shield");
    ui.slowTime.hidden = !isActive("slowTime");
    document.body.classList.toggle("slow-time", isActive("slowTime"));
    renderActivePowerUps(
      ui.activePowerUps,
      Object.entries(state.active).map(([type, endTime]) => ({
        type,
        seconds: Math.ceil((endTime - state.clock) / 1000),
      }))
    );
  }

  /* ---------- Input ---------- */

  function handleInput() {
    const value = ui.input.value.toLowerCase().trim();
    ui.input.value = value;

    if (phase === "playing" && value) {
      const powerUp = state.powerUps.find(
        (candidate) => candidate.word.toLowerCase() === value
      );
      const alien = state.aliens.find(
        (candidate) => !candidate.completed && candidate.word === value
      );

      if (powerUp) {
        activatePowerUp(powerUp);
        ui.input.value = "";
      } else if (alien) {
        destroyAlien(alien);
        ui.input.value = "";
      }
    }

    for (const alien of state.aliens) {
      highlightLetters(alien.letters, alien.word, ui.input.value);
    }
  }

  function movePlayer(delta) {
    playerPosition = Math.max(0, Math.min(100, playerPosition + delta));
    ui.player.style.left = `calc(${playerPosition}% - 100px)`;
  }

  /* ---------- Main loop ---------- */

  function update(dt) {
    state.clock += dt;
    runTimers();

    state.spawnTimer += dt;
    if (state.spawnTimer >= state.spawnInterval) {
      state.spawnTimer = 0;
      spawnAlien();
    }

    state.powerUpTimer += dt;
    if (state.powerUpTimer >= POWER_UP_CONFIG.spawnInterval) {
      state.powerUpTimer = 0;
      spawnPowerUp();
    }

    for (const type of Object.keys(state.active)) {
      if (state.active[type] <= state.clock) delete state.active[type];
    }
    renderPowerUpEffects();

    const ticks = (dt / 1000) * TICKS_PER_SECOND;
    const slow = isActive("slowTime") ? POWER_UP_CONFIG.slowTime.slowFactor : 1;
    const bottom = ui.game.clientHeight - ALIEN_CONFIG.bottomMargin;
    const livesBefore = state.lives;

    for (const alien of state.aliens) {
      if (alien.completed) {
        stepParticles(alien.particles, dt);
        continue;
      }
      alien.y += alien.speed * slow * ticks;
      alien.root.style.translate = `${alien.x}px ${alien.y}px`;
      if (alien.y > bottom) missAlien(alien);
    }

    for (const powerUp of [...state.powerUps]) {
      powerUp.y += POWER_UP_CONFIG.fallSpeed * ticks;
      powerUp.root.style.translate = `${powerUp.x}px ${powerUp.y}px`;
      if (powerUp.y >= window.innerHeight) removePowerUp(powerUp);
    }

    if (state.lives !== livesBefore) {
      renderStats();
      if (state.lives <= 0) endGame();
    }
  }

  let lastFrame = performance.now();

  function frame(now) {
    // Cap the step so a background tab or a long stall does not teleport aliens.
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

  /* ---------- Wiring ---------- */

  createStars($("stars"));
  buildSlowTimeEffect(ui.slowTime);
  renderMuteButton();
  resetGame();
  setPhase("start");

  $("start-button").addEventListener("click", startGame);
  $("play-again-button").addEventListener("click", startGame);
  $("restart-button").addEventListener("click", startGame);
  $("resume-button").addEventListener("click", togglePause);
  $("quit-button").addEventListener("click", quitToStart);
  $("reload-button").addEventListener("click", () => location.reload());

  ui.pauseButton.addEventListener("click", togglePause);
  ui.muteButton.addEventListener("click", () => {
    sound.setMuted(!sound.isMuted());
    renderMuteButton();
    if (phase === "playing") ui.input.focus();
  });

  ui.input.addEventListener("input", handleInput);

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") togglePause();
    else if (event.key === "ArrowLeft") movePlayer(-2);
    else if (event.key === "ArrowRight") movePlayer(2);
  });

  requestAnimationFrame(frame);
})((window.WordBlast = window.WordBlast || {}));
