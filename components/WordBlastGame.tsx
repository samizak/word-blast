"use client";

import { useState, useRef, useEffect, RefObject } from "react";
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
import PowerUp from "./PowerUp";
import ActivePowerUps from "./game/ActivePowerUps";
import { usePowerUps } from "../hooks/usePowerUps";
import { PowerUp as PowerUpType, ActivePowerUp } from "../types/PowerUp";

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

export default function WordBlastGame() {
  const gameContainerRef = useRef<HTMLDivElement>(
    null
  ) as RefObject<HTMLDivElement>;
  const inputRef = useRef<HTMLInputElement>(
    null
  ) as RefObject<HTMLInputElement>;
  const playerRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
  const gameAreaRef = useRef<HTMLDivElement>(null);
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

  const { effects, setEffects, createEffects } = useEffects();
  const { isMuted, setIsMuted, toggleMute } = useSoundManager(gameState);
  const { powerUps, activePowerUps, activatePowerUp, resetPowerUps } =
    usePowerUps(gameState, gameContainerRef);

  // Then in handleRestartGame:
  const handleRestartGame = () => {
    startGame();
    setGameState("countdown");
    setScore(0);
    setLevel(1);
    setLives(3);
    setWordsInLevel(0);
    setShowLevelUp(false);

    // Clear any active effects or aliens
    setAliens([]);
    setEffects([]);

    // Reset power-ups
    resetPowerUps();

    // Reset input
    setCurrentInput("");

    // Focus the input field
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

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
    wordsInLevel,
    activePowerUps
  );

  // Use the countdown hook
  useCountdown(
    gameState,
    countdown,
    setCountdown,
    setGameState,
    generateAlien,
    inputRef
  );

  // Handle input changes with power-up support
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.toLowerCase();
    setCurrentInput(inputValue);

    // Check for power-up words
    const matchingPowerUp = powerUps.find(
      (powerUp: PowerUpType) => powerUp.word.toLowerCase() === inputValue
    );

    if (matchingPowerUp) {
      activatePowerUp(matchingPowerUp);
      setCurrentInput("");
      e.target.value = "";
      window.playSound?.("powerUp");
      return;
    }

    // Check for alien words
    const matchingAlien = aliens.find(
      (alien) => alien.word.toLowerCase() === inputValue
    );

    if (matchingAlien) {
      // Create laser and explosion effects
      createEffects(matchingAlien, playerRef, gameContainerRef);

      // Mark the alien as completed and trigger explosion
      markAlienAsCompleted(matchingAlien.id);

      // Remove the alien after explosion animation
      setTimeout(() => {
        removeAlien(matchingAlien.id);
      }, 1000);

      // Update score and check level completion
      incrementScore(matchingAlien.word.length * 10);

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

      // Apply slow time effect to alien speed
      const hasSlowTime = activePowerUps.some(
        (p: ActivePowerUp) => p.type === "slowTime"
      );
      if (hasSlowTime) {
        matchingAlien.speed *= 0.1; // Slow the alien down to 10% (90% reduction)
      }

      setCurrentInput("");
      e.target.value = "";
    }
  };

  const handleAlienExploded = (id: number) => {
    setAliens((prevAliens) => prevAliens.filter((alien) => alien.id !== id));
    setScore(score + 10);
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
      if (
        e.key === "Escape" &&
        (gameState === "playing" || gameState === "paused")
      ) {
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
            playerRef={playerRef}
            aliens={aliens}
            currentInput={currentInput}
            onInputChange={handleInputChange}
            inputRef={inputRef}
            effects={effects}
            level={level}
            score={score}
            lives={lives}
            onAlienExploded={handleAlienExploded}
            activePowerUps={activePowerUps}
            gameAreaRef={gameAreaRef}
          />
          {powerUps.map((powerUp) => (
            <PowerUp key={powerUp.id} powerUp={powerUp} />
          ))}
          <ActivePowerUps activePowerUps={activePowerUps} />
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
          onRestart={handleRestartGame}
          onQuit={() => setGameState("start")}
        />
      )}

      {gameState === "gameOver" && (
        <GameOver level={level} score={score} onPlayAgain={handleRestartGame} />
      )}
    </div>
  );
}
