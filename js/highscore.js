(function (WB) {
  "use strict";

  const HIGH_SCORES_KEY = "wordBlastHighScores";
  const MAX_HIGH_SCORES = 10;

  function getHighScores() {
    try {
      const stored = localStorage.getItem(HIGH_SCORES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  function saveHighScore(score, level) {
    try {
      const highScores = getHighScores();
      highScores.push({ score, level, date: new Date().toLocaleDateString() });
      highScores.sort((a, b) => b.score - a.score);
      highScores.splice(MAX_HIGH_SCORES);
      localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(highScores));
    } catch (error) {
      console.error("Failed to save high score:", error);
    }
  }

  function getHighestScore() {
    return getHighScores()[0] || null;
  }

  Object.assign(WB, { getHighestScore, saveHighScore });
})((window.WordBlast = window.WordBlast || {}));
