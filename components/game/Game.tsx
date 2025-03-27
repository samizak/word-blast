"use client";

import React, { useRef } from "react";
import GameController, { useGameContext } from "./GameController";
import StartScreen from "./StartScreen";
import Countdown from "./Countdown";
import GamePlayArea from "./GamePlayArea";
import GameOver from "./GameOver";
import MuteButton from "./MuteButton";
import LevelUpEffect from "./LevelUpEffect";
import SoundManager from "../SoundManager";

function GameContent() {
  const {
    gameState,
    setGameState,
    score,
    level,
    lives,
    isMuted,
    toggleMute,
    startGame,
    aliens,
    effects,
    currentInput,
    setCurrentInput,
    activePowerUps,
  } = useGameContext();

  const inputRef = useRef<HTMLInputElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const handleStartGame = () => {
    setGameState("countdown");
    setTimeout(() => {
      setGameState("playing");
    }, 3000);
  };

  const handlePlayAgain = () => {
    startGame();
  };

  const handleLevelUpComplete = () => {
    setGameState("playing");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
  };

  const handleAlienExploded = (id: number) => {
    console.log(`Alien ${id} exploded`);
  };

  return (
    <div className="relative w-full h-full" ref={gameAreaRef}>
      <SoundManager />
      <MuteButton isMuted={isMuted} onToggleMute={toggleMute} />

      {gameState === "start" && <StartScreen onStartGame={handleStartGame} />}

      {gameState === "countdown" && <Countdown countdown={3} />}

      {gameState === "playing" && (
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
          onAlienExploded={handleAlienExploded}
          activePowerUps={activePowerUps}
          gameAreaRef={gameAreaRef}
        />
      )}

      {gameState === "levelUp" && (
        <LevelUpEffect level={level} onComplete={handleLevelUpComplete} />
      )}

      {gameState === "gameOver" && (
        <GameOver score={score} level={level} onPlayAgain={handlePlayAgain} />
      )}
    </div>
  );
}

export default function Game() {
  return (
    <GameController>
      <GameContent />
    </GameController>
  );
}
