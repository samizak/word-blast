"use client";

import { useState, useRef, useEffect } from "react";
import SoundManager from "./SoundManager";
import StartScreen from "./game/StartScreen";
import Countdown from "./game/Countdown";
import GamePlayArea from "./game/GamePlayArea";
import GameOver from "./game/GameOver";
import MuteButton from "./game/MuteButton";
import LevelUpEffect from "./game/LevelUpEffect";
import { useGameState } from "../hooks/useGameState";
import { useAliens } from "../hooks/useAliens";
import { useEffects } from "../hooks/useEffects";
import { useSoundManager } from "../hooks/useSoundManager";
import { useCountdown } from "../hooks/useCountdown";
import PauseButton from "./game/PauseButton";
import PauseMenu from "./game/PauseMenu";

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
  const gameContainerRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>;
  const inputRef = useRef<HTMLInputElement>(
    null
  ) as React.RefObject<HTMLInputElement>;
  const playerRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>;
  const [currentInput, setCurrentInput] = useState("");

  const {
    gameState,
    setGameState,
    countdown,
    setCountdown,
    level,
    setLevel,
    score,
    setScore,
    lives,
    setLives,
    wordsInLevel,
    setWordsInLevel,
    showLevelUp,
    setShowLevelUp,
    startGame,
    incrementScore,
    decrementLives,
    togglePause,
  } = useGameState();

  const {
    aliens,
    setAliens,
    gameSpeed,
    setGameSpeed,
    generateAlien,
    removeAlien,
    markAlienAsCompleted,
    getSpawnIntervalForLevel,
    getMaxWordsForLevel,
  } = useAliens(
    gameState,
    level,
    decrementLives,
    gameContainerRef,
    setWordsInLevel,
    wordsInLevel
  );

  const { effects, setEffects, createEffects } = useEffects();
  const { isMuted, setIsMuted, toggleMute } = useSoundManager(gameState);

  // Use the countdown hook
  useCountdown(
    gameState,
    countdown,
    setCountdown,
    setGameState,
    generateAlien,
    inputRef
  );

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.toLowerCase();
    setCurrentInput(inputValue);

    aliens.forEach((alien) => {
      if (alien.word.toLowerCase() === inputValue) {
        // Create laser and explosion effects
        createEffects(alien, playerRef, gameContainerRef);

        // Mark the alien as completed and trigger explosion
        markAlienAsCompleted(alien.id);

        // Remove the alien after explosion animation
        setTimeout(() => {
          removeAlien(alien.id);
        }, 1000);

        // Update score and check level completion
        incrementScore(alien.word.length * 10);

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
            setLevel(level + 1);
            setWordsInLevel(0);
            setGameSpeed(getSpawnIntervalForLevel(level + 1));
          }, 500);
        } else {
          // If level isn't complete, just increment words in level
          setWordsInLevel(newWordsInLevel);
        }

        setCurrentInput("");
        e.target.value = "";
      }
    });
  };

  // Check for game over
  useEffect(() => {
    if (lives <= 0) {
      setGameState("gameOver");
    }
  }, [lives, setGameState]);

  // Focus input when game starts
  useEffect(() => {
    if (gameState === "playing" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);

  // Add an effect to handle level changes
  useEffect(() => {
    if (showLevelUp) {
      const timer = setTimeout(() => {
        setShowLevelUp(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showLevelUp]);

  // Add keyboard event handler for pause
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape" && gameState === "playing") {
        togglePause();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState, togglePause]);

  return (
    <div className="game-container" ref={gameContainerRef}>
      <SoundManager isMuted={isMuted} />
      <div className="flex absolute top-4 right-4 z-50 gap-4">
        <MuteButton isMuted={isMuted} onToggleMute={toggleMute} />
        {(gameState === "playing" || gameState === "paused") && (
          <PauseButton
            isPaused={gameState === "paused"}
            onTogglePause={togglePause}
          />
        )}
      </div>

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

      {gameState === "paused" && (
        <PauseMenu
          onResume={togglePause}
          onRestart={startGame}
          onQuit={() => setGameState("start")}
        />
      )}

      {gameState === "gameOver" && (
        <GameOver level={level} score={score} onPlayAgain={startGame} />
      )}
    </div>
  );
}
