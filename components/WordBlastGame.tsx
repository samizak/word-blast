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
  const { isMuted, toggleMute } = useSoundManager(gameState);
  const { powerUps, activePowerUps, activatePowerUp, resetPowerUps } =
    usePowerUps(gameState, gameContainerRef);

  const handleRestartGame = () => {
    startGame();
    setGameState("countdown");
    setScore(0);
    setLevel(1);
    setLives(3);
    setWordsInLevel(0);
    setShowLevelUp(false);

    setAliens([]);
    setEffects([]);

    resetPowerUps();

    setCurrentInput("");

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const {
    aliens,
    setAliens,
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

  useCountdown(
    gameState,
    countdown,
    setCountdown,
    setGameState,
    generateAlien,
    inputRef
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.toLowerCase();
    setCurrentInput(inputValue);

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

    const matchingAlien = aliens.find(
      (alien) => alien.word.toLowerCase() === inputValue
    );

    if (matchingAlien) {
      createEffects(matchingAlien, playerRef, gameContainerRef);

      markAlienAsCompleted(matchingAlien.id);

      setTimeout(() => {
        removeAlien(matchingAlien.id);
      }, 1000);

      incrementScore(matchingAlien.word.length * 10);

      const newWordsInLevel = wordsInLevel + 1;
      const maxWords = getMaxWordsForLevel(level);

      if (newWordsInLevel >= maxWords && !showLevelUp) {
        window.playSound?.("levelUp");

        setShowLevelUp(true);

        setTimeout(() => {
          setLevel(level + 1);
          setWordsInLevel(0);
          setGameSpeed(getSpawnIntervalForLevel(level + 1));
        }, 500);
      } else {
        setWordsInLevel(newWordsInLevel);
      }

      const hasSlowTime = activePowerUps.some(
        (p: ActivePowerUp) => p.type === "slowTime"
      );
      if (hasSlowTime) {
        matchingAlien.speed *= 0.1;
      }

      setCurrentInput("");
      e.target.value = "";
    }
  };

  const handleAlienExploded = (id: number) => {
    setAliens((prevAliens) => prevAliens.filter((alien) => alien.id !== id));
    setScore(score + 10);
  };

  useEffect(() => {
    if (lives <= 0) {
      setGameState("gameOver");
    }
  }, [lives, setGameState]);

  useEffect(() => {
    if (gameState === "playing" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);

  useEffect(() => {
    if (showLevelUp) {
      const timer = setTimeout(() => {
        setShowLevelUp(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showLevelUp, setShowLevelUp]);

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
