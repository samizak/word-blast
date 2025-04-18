import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { GameState } from "./useGameState";
import wordLists from "../data/wordLists";
import { ActivePowerUp } from "../types/PowerUp";
import {
  ALIEN_CONFIG,
  getMaxWordsForLevel,
  getSpawnIntervalForLevel,
  getAlienSpeedForLevel,
} from "../utils/gameConfigUtils";

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
  decrementLives: (amount: number) => void,
  gameContainerRef: React.RefObject<HTMLDivElement>,
  setWordsInLevel: (amount: number) => void,
  wordsInLevel: number,
  activePowerUps: ActivePowerUp[]
) {
  const [aliens, setAliens] = useState<Alien[]>([]);
  const [gameSpeed, setGameSpeed] = useState(ALIEN_CONFIG.baseSpawnInterval);
  const processedBottomAliensRef = useRef<Set<number>>(new Set());
  const explodingAliensRef = useRef<Set<number>>(new Set());

  const generateAlien = useCallback(() => {
    if (gameState !== "playing") return;

    const maxWords = getMaxWordsForLevel(level);
    if (wordsInLevel >= maxWords) {
      return;
    }

    if (aliens.length >= ALIEN_CONFIG.maxSimultaneousWords) {
      return;
    }

    const currentWordList =
      wordLists[Math.min(level - 1, wordLists.length - 1)];
    const activeWords = aliens.map((alien) => alien.word.toLowerCase());
    const availableWords = currentWordList.filter(
      (word) => !activeWords.includes(word.toLowerCase())
    );

    if (availableWords.length === 0) {
      console.warn("No available words to spawn.");
      return;
    }

    const word =
      availableWords[Math.floor(Math.random() * availableWords.length)];
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
    setWordsInLevel(wordsInLevel + 1);
  }, [
    gameState,
    level,
    wordsInLevel,
    aliens.length,
    gameContainerRef,
    setWordsInLevel,
  ]);

  const removeAlien = useCallback((alienId: number) => {
    setAliens((prev) => prev.filter((alien) => alien.id !== alienId));
  }, []);

  const markAlienAsCompleted = useCallback((alienId: number) => {
    setAliens((prev) =>
      prev.map((alien) =>
        alien.id === alienId ? { ...alien, isCompleted: true } : alien
      )
    );
  }, []);

  const updateAlienPositions = useCallback(() => {
    if (gameState !== "playing") return;

    setAliens((prevAliens) => {
      const updatedAliens = prevAliens.map((alien: Alien) => {
        const hasSlowTime = activePowerUps.some((p) => p.type === "slowTime");

        const speedMultiplier = hasSlowTime ? 0.1 : 1;

        return {
          ...alien,
          y: alien.y + alien.speed * speedMultiplier,
        };
      });

      const bottomAliens = updatedAliens.filter(
        (alien: Alien) =>
          alien.y > (gameContainerRef.current?.clientHeight || 600) - 100 &&
          !alien.isCompleted &&
          !processedBottomAliensRef.current.has(alien.id)
      );

      if (bottomAliens.length > 0) {
        bottomAliens.forEach((alien: Alien) => {
          processedBottomAliensRef.current.add(alien.id);
          markAlienAsCompleted(alien.id);
        });

        const hasShield = activePowerUps.some((p) => p.type === "shield");
        if (!hasShield) {
          decrementLives(bottomAliens.length);
        }

        setTimeout(() => {
          setAliens((current) =>
            current.filter(
              (alien) =>
                !bottomAliens.some(
                  (bottomAlien: Alien) => bottomAlien.id === alien.id
                )
            )
          );
        }, 1000);
      }

      return updatedAliens;
    });
  }, [
    gameState,
    activePowerUps,
    gameContainerRef,
    markAlienAsCompleted,
    decrementLives,
  ]);

  useEffect(() => {
    processedBottomAliensRef.current.clear();
    explodingAliensRef.current.clear();
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "playing") {
      return;
    }

    const spawnInterval = setInterval(generateAlien, gameSpeed);
    return () => clearInterval(spawnInterval);
  }, [gameState, gameSpeed, generateAlien]);

  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = setInterval(updateAlienPositions, 50);
    return () => clearInterval(interval);
  }, [gameState, updateAlienPositions]);

  return {
    aliens,
    setAliens,
    setGameSpeed,
    generateAlien,
    removeAlien,
    markAlienAsCompleted,
    getMaxWordsForLevel,
    getSpawnIntervalForLevel,
    getAlienSpeedForLevel,
    updatePositions: updateAlienPositions,
  };
}
