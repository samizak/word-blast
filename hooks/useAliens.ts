import { useState, useEffect } from 'react';
import { GameState } from './useGameState';
import wordLists from '../data/wordLists';

// Game configuration
const GAME_CONFIG = {
  baseSpawnInterval: 2000,
  minSpawnInterval: 600,
  baseWordsPerLevel: 10,
  wordsPerLevelIncrease: 5,
  baseAlienSpeed: 0.5,
  speedIncreasePerLevel: 0.15,
  maxSimultaneousWords: 8,
  pointsPerLevel: 250,
};

export interface Alien {
  id: number;
  word: string;
  x: number;
  y: number;
  speed: number;
  isCompleted?: boolean;
}

export function useAliens(
  gameState: GameState,
  level: number,
  setLives: (cb: (prev: number) => number) => void,
  gameContainerRef: React.RefObject<HTMLDivElement>,
  setWordsInLevel: (cb: (prev: number) => number) => void,
  wordsInLevel: number
) {
  const [aliens, setAliens] = useState<Alien[]>([]);
  const [gameSpeed, setGameSpeed] = useState(GAME_CONFIG.baseSpawnInterval);

  const getMaxWordsForLevel = (currentLevel: number) => {
    return GAME_CONFIG.baseWordsPerLevel + (currentLevel - 1) * GAME_CONFIG.wordsPerLevelIncrease;
  };

  const getSpawnIntervalForLevel = (currentLevel: number) => {
    const interval = GAME_CONFIG.baseSpawnInterval - (currentLevel - 1) * 200;
    return Math.max(interval, GAME_CONFIG.minSpawnInterval);
  };

  const getAlienSpeedForLevel = (currentLevel: number) => {
    return GAME_CONFIG.baseAlienSpeed + (currentLevel - 1) * GAME_CONFIG.speedIncreasePerLevel;
  };

  const generateAlien = () => {
    if (gameState !== "playing") return;

    const maxWords = getMaxWordsForLevel(level);
    if (wordsInLevel >= maxWords) {
      return;
    }

    if (aliens.length >= GAME_CONFIG.maxSimultaneousWords) {
      return;
    }

    const currentWordList = wordLists[Math.min(level - 1, wordLists.length - 1)];
    const activeWords = aliens.map((alien) => alien.word.toLowerCase());
    const availableWords = currentWordList.filter(
      (word) => !activeWords.includes(word.toLowerCase())
    );

    if (availableWords.length === 0) {
      console.warn("No available words to spawn.");
      return;
    }

    const word = availableWords[Math.floor(Math.random() * availableWords.length)];
    const containerWidth = gameContainerRef.current?.clientWidth || 800;
    const basePlanetSize = 80;
    const charWidth = 10;
    const wordWidth = word.length * charWidth;
    const padding = 40;
    const planetSize = Math.max(basePlanetSize, wordWidth + padding);
    const safeMargin = planetSize;
    const minPosition = safeMargin;
    const maxPosition = containerWidth - safeMargin;
    const xPosition = Math.random() * (maxPosition - minPosition) + minPosition;

    const newAlien: Alien = {
      id: Date.now(),
      word,
      x: xPosition,
      y: 0,
      speed: getAlienSpeedForLevel(level),
    };

    setAliens((prev) => [...prev, newAlien]);
    setWordsInLevel((prev) => prev + 1);
  };

  // Spawn new aliens
  useEffect(() => {
    if (gameState !== "playing") {
      return;
    }

    const spawnInterval = setInterval(generateAlien, gameSpeed);
    return () => clearInterval(spawnInterval);
  }, [gameState, gameSpeed, level]);

  // Update alien positions
  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = setInterval(() => {
      setAliens((prev) => {
        const updated = prev.map((alien) => ({
          ...alien,
          y: alien.y + alien.speed,
        }));

        const bottomAliens = updated.filter(
          (alien) =>
            alien.y > (gameContainerRef.current?.clientHeight || 600) - 100 &&
            !alien.isCompleted
        );

        if (bottomAliens.length > 0) {
          setLives((prev) => prev - bottomAliens.length);
          return updated.filter(
            (alien) => !bottomAliens.some(bottomAlien => bottomAlien.id === alien.id)
          );
        }

        return updated;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [gameState, setLives]);

  const removeAlien = (alienId: number) => {
    setAliens((prev) => prev.filter((alien) => alien.id !== alienId));
  };

  const markAlienAsCompleted = (alienId: number) => {
    setAliens((prev) =>
      prev.map((alien) =>
        alien.id === alienId ? { ...alien, isCompleted: true } : alien
      )
    );
  };

  return {
    aliens,
    setAliens,
    gameSpeed,
    setGameSpeed,
    generateAlien,
    removeAlien,
    markAlienAsCompleted,
    getSpawnIntervalForLevel,
    getMaxWordsForLevel,
  };
} 