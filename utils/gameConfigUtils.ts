/**
 * Game Configuration Utilities
 * Contains all game configuration settings and helper functions for calculations
 */

// Alien configuration
export const ALIEN_CONFIG = {
  baseSpawnInterval: 2000,
  minSpawnInterval: 600,
  baseWordsPerLevel: 10,
  wordsPerLevelIncrease: 5,
  baseAlienSpeed: 0.5,
  speedIncreasePerLevel: 0.15,
  maxSimultaneousWords: 8,
  pointsPerLevel: 250,
};

// Power-up configuration
export const POWER_UP_CONFIG = {
  shield: {
    duration: 10000,
    word: "SHIELD",
    color: "#00ffff",
    probability: 0.1,
  },
  slowTime: {
    duration: 8000,
    word: "SLOW",
    color: "#9933ff",
    probability: 0.1,
    slowFactor: 0.1,
  },
  spawnInterval: 15000,
};

// Game settings
export const GAME_CONFIG = {
  initialLives: 3,
  scoreMultiplier: 10,
  levelUpDelay: 2000,
};

/**
 * Calculate the maximum number of words for a given level
 * @param level Current game level
 * @returns Maximum number of words for the level
 */
export function getMaxWordsForLevel(level: number): number {
  return (
    ALIEN_CONFIG.baseWordsPerLevel +
    (level - 1) * ALIEN_CONFIG.wordsPerLevelIncrease
  );
}

/**
 * Calculate the spawn interval for a given level
 * @param level Current game level
 * @returns Spawn interval in milliseconds
 */
export function getSpawnIntervalForLevel(level: number): number {
  const interval = ALIEN_CONFIG.baseSpawnInterval - (level - 1) * 200;
  return Math.max(interval, ALIEN_CONFIG.minSpawnInterval);
}

/**
 * Calculate the alien speed for a given level
 * @param level Current game level
 * @returns Speed value for aliens at this level
 */
export function getAlienSpeedForLevel(level: number): number {
  return (
    ALIEN_CONFIG.baseAlienSpeed +
    (level - 1) * ALIEN_CONFIG.speedIncreasePerLevel
  );
}

/**
 * Calculate score for destroying an alien
 * @param wordLength Length of the word
 * @returns Score value
 */
export function calculateWordScore(wordLength: number): number {
  return wordLength * GAME_CONFIG.scoreMultiplier;
}

/**
 * Check if level should increase based on words destroyed
 * @param wordsInLevel Current words destroyed in level
 * @param level Current level
 * @returns Boolean indicating if level should increase
 */
export function shouldLevelUp(wordsInLevel: number, level: number): boolean {
  return wordsInLevel >= getMaxWordsForLevel(level);
}
