(function (WB) {
  "use strict";

  // Game tuning values and the level-scaling formulas.

  const ALIEN_CONFIG = {
    baseSpawnInterval: 2000,
    minSpawnInterval: 600,
    baseWordsPerLevel: 10,
    wordsPerLevelIncrease: 5,
    baseAlienSpeed: 0.5,
    speedIncreasePerLevel: 0.15,
    maxSimultaneousWords: 8,
    // Aliens that get within this many pixels of the bottom count as missed.
    bottomMargin: 100,
  };

  const POWER_UP_CONFIG = {
    shield: { duration: 10000, word: "SHIELD", color: "#00ffff", icon: "🛡️" },
    slowTime: {
      duration: 8000,
      word: "SLOW",
      color: "#9933ff",
      icon: "⏰",
      slowFactor: 0.1,
    },
    spawnInterval: 15000,
    fallSpeed: 2,
  };

  const GAME_CONFIG = {
    initialLives: 3,
    scoreMultiplier: 10,
    levelUpDelay: 500,
    levelUpDuration: 2000,
    explosionDuration: 1000,
  };

  // Speeds are expressed in pixels per 50 ms tick, so 20 ticks make a second.
  const TICKS_PER_SECOND = 20;

  function getMaxWordsForLevel(level) {
    return (
      ALIEN_CONFIG.baseWordsPerLevel +
      (level - 1) * ALIEN_CONFIG.wordsPerLevelIncrease
    );
  }

  function getSpawnIntervalForLevel(level) {
    const interval = ALIEN_CONFIG.baseSpawnInterval - (level - 1) * 200;
    return Math.max(interval, ALIEN_CONFIG.minSpawnInterval);
  }

  function getAlienSpeedForLevel(level) {
    return (
      ALIEN_CONFIG.baseAlienSpeed +
      (level - 1) * ALIEN_CONFIG.speedIncreasePerLevel
    );
  }

  Object.assign(WB, { ALIEN_CONFIG, POWER_UP_CONFIG, GAME_CONFIG, TICKS_PER_SECOND, getMaxWordsForLevel, getSpawnIntervalForLevel, getAlienSpeedForLevel });
})((window.WordBlast = window.WordBlast || {}));
