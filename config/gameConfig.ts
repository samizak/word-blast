/**
 * Game Configuration
 * Centralized configuration values for the Word Blast game
 */

// Sound settings
export const SOUND_CONFIG = {
  delays: {
    atmosphere: 50,
    gameOver: 100,
    countdown: 300,
  },
};

// Power-up settings
export const POWER_UP_CONFIG = {
  spawnInterval: 20000,
  moveInterval: 50,
  checkInterval: 1000,
  types: {
    slowTime: {
      word: "SLOW",
      duration: 10000,
    },
    shield: {
      word: "SHIELD",
      duration: 15000,
    },
  },
};

// Alien settings
export const ALIEN_CONFIG = {
  baseSpawnInterval: 2000,
  minSpawnInterval: 600,
  baseWordsPerLevel: 10,
  maxWordsPerLevel: 30,
  speedMultiplier: 1.2,
};

// Game settings
export const GAME_CONFIG = {
  initialLives: 3,
  scoreMultiplier: 10,
  levelUpDelay: 2000,
};