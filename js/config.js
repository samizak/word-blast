(function (WB) {
  "use strict";

  // Game tuning values and the level-scaling formulas.

  const ALIEN_CONFIG = {
    maxSimultaneousWords: 8,
    baseWordsPerLevel: 10,
    wordsPerLevelIncrease: 2,
    minSpawnDelay: 450,
    bossEvery: 5,
    // Special planets: the level they first appear, how often they are
    // rolled, and how their fall time compares with a normal planet.
    kinds: {
      fast: { fromLevel: 2, chance: 0.15, fallTimeFactor: 0.55 },
      armoured: { fromLevel: 3, chance: 0.12, fallTimeFactor: 1.15 },
      splitter: { fromLevel: 4, chance: 0.1, fallTimeFactor: 1 },
    },
  };

  const POWER_UP_CONFIG = {
    spawnInterval: 12000,
    fallSpeed: 60, // pixels per second
    maxLives: 5,
    types: {
      shield: { word: "SHIELD", color: "#00ffff", icon: "🛡️", duration: 10000, weight: 3 },
      slowTime: { word: "SLOW", color: "#9933ff", icon: "⏰", duration: 8000, weight: 3, factor: 0.4 },
      freeze: { word: "FREEZE", color: "#8fd3ff", icon: "❄️", duration: 4000, weight: 2 },
      double: { word: "DOUBLE", color: "#ffd000", icon: "✨", duration: 10000, weight: 2 },
      bomb: { word: "BOMB", color: "#ff7a1a", icon: "💣", weight: 2 },
      life: { word: "LIFE", color: "#ff0066", icon: "❤️", weight: 1 },
    },
  };

  // cps is the typing speed (characters per second) the spawn rate demands;
  // it grows every level. fallTime is the seconds a planet takes to reach
  // the ship.
  const DIFFICULTIES = {
    easy: {
      label: "Easy",
      hint: "Five lives and a gentle pace.",
      lives: 5,
      cpsBase: 1.4,
      cpsGrowth: 0.2,
      fallTime: 20,
      fallTimeMin: 11,
      scoreMultiplier: 0.75,
    },
    normal: {
      label: "Normal",
      hint: "Three lives. The standard game.",
      lives: 3,
      cpsBase: 2.0,
      cpsGrowth: 0.3,
      fallTime: 16,
      fallTimeMin: 8,
      scoreMultiplier: 1,
    },
    hard: {
      label: "Hard",
      hint: "Faster planets, more of them, 1.5× score.",
      lives: 3,
      cpsBase: 3.0,
      cpsGrowth: 0.4,
      fallTime: 12,
      fallTimeMin: 6,
      scoreMultiplier: 1.5,
    },
    zen: {
      label: "Zen",
      hint: "No lives, no game over. Practice at your own pace.",
      lives: Infinity,
      cpsBase: 1.6,
      cpsGrowth: 0.15,
      fallTime: 20,
      fallTimeMin: 12,
      scoreMultiplier: 1,
      zen: true,
    },
  };

  const GAME_CONFIG = {
    scorePerLetter: 10,
    bossBonus: 1000,
    bossLifeCost: 2,
    comboStep: 5, // kills in a row per multiplier step
    maxMultiplier: 5,
    bannerDuration: 2000,
    explosionDuration: 1000,
  };

  function getWordsForLevel(level) {
    return (
      ALIEN_CONFIG.baseWordsPerLevel +
      (level - 1) * ALIEN_CONFIG.wordsPerLevelIncrease
    );
  }

  function getCharsPerSecond(mode, level) {
    return mode.cpsBase + (level - 1) * mode.cpsGrowth;
  }

  function getFallTime(mode, level) {
    return Math.max(mode.fallTimeMin, mode.fallTime - (level - 1) * 0.5);
  }

  function getComboMultiplier(combo) {
    return Math.min(
      GAME_CONFIG.maxMultiplier,
      1 + Math.floor(combo / GAME_CONFIG.comboStep)
    );
  }

  Object.assign(WB, {
    ALIEN_CONFIG,
    POWER_UP_CONFIG,
    DIFFICULTIES,
    GAME_CONFIG,
    getWordsForLevel,
    getCharsPerSecond,
    getFallTime,
    getComboMultiplier,
  });
})((window.WordBlast = window.WordBlast || {}));
