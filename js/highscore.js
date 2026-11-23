(function (WB) {
  "use strict";

  const HIGH_SCORES_KEY = "wordBlastHighScores";
  const SETTINGS_KEY = "wordBlastSettings";
  const MAX_HIGH_SCORES = 10;

  function getHighScores() {
    try {
      const stored = JSON.parse(localStorage.getItem(HIGH_SCORES_KEY));
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  }

  /**
   * Add a result to the table.
   * Returns its zero-based rank, or -1 if it did not make the top ten.
   */
  function saveHighScore(result) {
    const entry = { ...result, date: new Date().toLocaleDateString() };
    const highScores = getHighScores();
    highScores.push(entry);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(MAX_HIGH_SCORES);
    try {
      localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(highScores));
    } catch (error) {
      console.error("Failed to save high score:", error);
    }
    return highScores.indexOf(entry);
  }

  function getHighestScore() {
    return getHighScores()[0] || null;
  }

  function loadSettings() {
    const defaults = {
      volume: 0.8,
      muted: false,
      difficulty: "normal",
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches,
    };
    try {
      return { ...defaults, ...JSON.parse(localStorage.getItem(SETTINGS_KEY)) };
    } catch {
      return defaults;
    }
  }

  function saveSettings(settings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  }

  Object.assign(WB, {
    getHighScores,
    getHighestScore,
    saveHighScore,
    loadSettings,
    saveSettings,
  });
})((window.WordBlast = window.WordBlast || {}));
