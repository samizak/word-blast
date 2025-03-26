"use client";

import { useState, useEffect, useRef } from "react";
import SoundManager from "./SoundManager";
import StartScreen from "./game/StartScreen";
import Countdown from "./game/Countdown";
import GamePlayArea from "./game/GamePlayArea";
import GameOver from "./game/GameOver";
import MuteButton from "./game/MuteButton";
import wordLists from "../data/wordLists";
import LevelUpEffect from "./game/LevelUpEffect";

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

// Define types for the alien object
interface Alien {
  id: number;
  word: string;
  x: number;
  y: number;
  speed: number;
  isCompleted?: boolean;
}

// Define types for visual effects
interface Effect {
  id: string;
  type: "laser" | "explosion";
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  x?: number;
  y?: number;
}

export default function WordBlastGame() {
  const [gameState, setGameState] = useState<
    "start" | "countdown" | "playing" | "gameOver"
  >("start");
  const [countdown, setCountdown] = useState<number>(3);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [aliens, setAliens] = useState<Alien[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [gameSpeed, setGameSpeed] = useState(GAME_CONFIG.baseSpawnInterval);
  const [effects, setEffects] = useState<Effect[]>([]);
  const [wordsInLevel, setWordsInLevel] = useState(0);
  const gameContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const playerRef = useRef<HTMLDivElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const canPlayCountdownSound = useRef(true);
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Calculate level-specific values
  const getMaxWordsForLevel = (currentLevel: number) => {
    return (
      GAME_CONFIG.baseWordsPerLevel +
      (currentLevel - 1) * GAME_CONFIG.wordsPerLevelIncrease
    );
  };

  const getSpawnIntervalForLevel = (currentLevel: number) => {
    const interval = GAME_CONFIG.baseSpawnInterval - (currentLevel - 1) * 200;
    return Math.max(interval, GAME_CONFIG.minSpawnInterval);
  };

  const getAlienSpeedForLevel = (currentLevel: number) => {
    return (
      GAME_CONFIG.baseAlienSpeed +
      (currentLevel - 1) * GAME_CONFIG.speedIncreasePerLevel
    );
  };

  // Start the game
  const startGame = () => {
    setGameState("countdown");
    setCountdown(3);
    setLevel(1);
    setScore(0);
    setLives(3);
    setAliens([]);
    setCurrentInput("");
    setGameSpeed(GAME_CONFIG.baseSpawnInterval);
    setEffects([]);
    setWordsInLevel(0);
    canPlayCountdownSound.current = true;
  };

  // Handle countdown
  useEffect(() => {
    if (gameState === "countdown") {
      if (countdown > 0) {
        if (canPlayCountdownSound.current) {
          window.playSound?.("countdown");
          canPlayCountdownSound.current = false;
        }

        const timer = setTimeout(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
      } else {
        window.playSound?.("levelUp");
        window.playLoopingSound?.("atmosphere");

        const startGameTimer = setTimeout(() => {
          setGameState("playing");
          generateAlien();
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 800);

        return () => clearTimeout(startGameTimer);
      }
    }
  }, [gameState, countdown]);

  // Generate a new alien with a word
  const generateAlien = () => {
    if (gameState !== "playing") return;

    // Check if we've reached the maximum words for this level
    const maxWords = getMaxWordsForLevel(level);
    if (wordsInLevel >= maxWords) {
      return;
    }

    // Check if we've reached the maximum simultaneous words
    if (aliens.length >= GAME_CONFIG.maxSimultaneousWords) {
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
    setWordsInLevel((prev) => prev + 1);
  };

  // Create visual effects
  const createEffects = (targetAlien: Alien) => {
    const playerElement =
      playerRef.current?.querySelector<HTMLDivElement>(":scope > div");
    if (!playerElement) return;

    const gameRect = gameContainerRef.current?.getBoundingClientRect();
    const playerRect = playerElement.getBoundingClientRect();

    if (!gameRect) return;

    const playerX = playerRect.left - gameRect.left + playerRect.width / 2;
    const playerY = gameRect.bottom - playerRect.height;
    const targetX = targetAlien.x + gameRect.left;
    const targetY = targetAlien.y + gameRect.top;

    const laserId = `laser-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const explosionId = `explosion-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    window.playSound?.("laser");

    setEffects((prev) => [
      ...prev,
      {
        id: laserId,
        type: "laser",
        startX: playerX,
        startY: playerY,
        endX: targetX,
        endY: targetY,
      },
    ]);

    setTimeout(() => {
      window.playSound?.("explosion");

      setEffects((prev) => [
        ...prev,
        {
          id: explosionId,
          type: "explosion",
          x: targetX,
          y: targetY,
        },
      ]);
    }, 200);

    setTimeout(() => {
      setEffects((prev) =>
        prev.filter(
          (effect) => effect.id !== laserId && effect.id !== explosionId
        )
      );
    }, 800);
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.toLowerCase();
    setCurrentInput(inputValue);

    aliens.forEach((alien) => {
      if (alien.word.toLowerCase() === inputValue) {
        // Create laser and explosion effects
        createEffects(alien);

        // Mark the alien as completed and trigger explosion
        setAliens((prev) =>
          prev.map((a) => (a.id === alien.id ? { ...a, isCompleted: true } : a))
        );

        // Remove the alien after explosion animation
        setTimeout(() => {
          setAliens((prev) => prev.filter((a) => a.id !== alien.id));
        }, 1000);

        // Update score and check level completion
        setScore((prev) => prev + alien.word.length * 10);

        // Calculate new words in level before checking completion
        const newWordsInLevel = wordsInLevel + 1;
        const maxWords = getMaxWordsForLevel(level);

        // Check if this word completes the level
        if (newWordsInLevel >= maxWords && !showLevelUp) {
          // Play level up sound without stopping atmosphere
          window.playSound?.("levelUp");

          // Show level up animation
          setShowLevelUp(true);

          // Update game state for next level
          setTimeout(() => {
            setLevel((prev) => prev + 1);
            setWordsInLevel(0);
            setGameSpeed(getSpawnIntervalForLevel(level + 1));
          }, 500); // Slight delay to ensure animation plays smoothly
        } else {
          // If level isn't complete, just increment words in level
          setWordsInLevel(newWordsInLevel);
        }

        setCurrentInput("");
        e.target.value = "";
      }
    });
  };

  // Start atmosphere sound when countdown reaches "GO!"
  useEffect(() => {
    if (countdown === "GO!") {
      window.playLoopingSound?.("atmosphere");
    }
  }, [countdown]);

  // Stop atmosphere sound when game is over
  useEffect(() => {
    if (gameState === "gameOver") {
      window.stopLoopingSound?.("atmosphere");
    }
  }, [gameState]);

  // Add an effect to handle level changes
  useEffect(() => {
    if (showLevelUp) {
      const timer = setTimeout(() => {
        setShowLevelUp(false);
      }, 2000); // Match this with the LevelUpEffect duration
      return () => clearTimeout(timer);
    }
  }, [showLevelUp]);

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
            alien.y > (gameContainerRef.current?.clientHeight || 600) - 100
        );
        if (bottomAliens.length > 0) {
          setLives((prev) => prev - bottomAliens.length);
          return updated.filter(
            (alien) =>
              alien.y <= (gameContainerRef.current?.clientHeight || 600) - 100
          );
        }

        return updated;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [gameState]);

  // Spawn new aliens
  useEffect(() => {
    if (gameState !== "playing") {
      return;
    }

    const spawnInterval = setInterval(generateAlien, gameSpeed);
    return () => clearInterval(spawnInterval);
  }, [gameState, gameSpeed, level]);

  // Check for game over
  useEffect(() => {
    if (lives <= 0) {
      setGameState("gameOver");
      window.playSound?.("gameOver");
      window.stopLoopingSound?.("atmosphere");
    }
  }, [lives]);

  // Focus input when game starts
  useEffect(() => {
    if (gameState === "playing" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);

  // Handle mute functionality
  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);

    if (!newMuteState && gameState === "playing") {
      window.playLoopingSound?.("atmosphere");
    }
  };

  useEffect(() => {
    if (gameState === "playing") {
      if (isMuted) {
        window.stopLoopingSound?.("atmosphere");
      } else {
        window.playLoopingSound?.("atmosphere");
      }
    }
  }, [isMuted, gameState]);

  return (
    <div className="game-container" ref={gameContainerRef}>
      <SoundManager isMuted={isMuted} />
      <MuteButton isMuted={isMuted} onToggleMute={toggleMute} />

      {gameState === "start" && <StartScreen onStartGame={startGame} />}
      {gameState === "countdown" && <Countdown countdown={countdown} />}

      {(gameState === "playing" || gameState === "countdown") && (
        <>
          <GamePlayArea
            aliens={aliens}
            currentInput={currentInput}
            onInputChange={handleInputChange}
            inputRef={inputRef}
            playerRef={playerRef}
            effects={effects}
            level={level}
            score={score}
            lives={lives}
          />
          {showLevelUp && (
            <LevelUpEffect
              level={level}
              onComplete={() => setShowLevelUp(false)}
            />
          )}
        </>
      )}

      {gameState === "gameOver" && (
        <GameOver level={level} score={score} onPlayAgain={startGame} />
      )}
    </div>
  );
}
