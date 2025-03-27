import React, { useState, useEffect } from "react";
import WordAlien from "../WordAlien";
import Player from "../Player";
import GameInput from "./GameInput";
import GameStats from "./GameStats";
import Laser from "../Laser";
import PowerUpEffects from "./PowerUpEffects";
import { ActivePowerUp } from "../../types/PowerUp";

interface Alien {
  id: number;
  word: string;
  x: number;
  y: number;
  speed: number;
  isCompleted?: boolean;
}

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

interface GamePlayAreaProps {
  aliens: Alien[];
  currentInput: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  playerRef: React.RefObject<HTMLDivElement | null>;
  effects: Effect[];
  level: number;
  score: number;
  lives: number;
  onAlienExploded?: (id: number) => void;
  activePowerUps: ActivePowerUp[];
  gameAreaRef: React.RefObject<HTMLDivElement | null>;
}

const GamePlayArea: React.FC<GamePlayAreaProps> = ({
  aliens,
  currentInput,
  onInputChange,
  inputRef,
  playerRef,
  effects,
  level,
  score,
  lives,
  onAlienExploded,
  activePowerUps,
  gameAreaRef,
}) => {
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });

  // Update player position for power-up effects
  useEffect(() => {
    const updatePlayerPosition = () => {
      if (playerRef.current && gameAreaRef.current) {
        const playerRect = playerRef.current.getBoundingClientRect();
        const gameAreaRect = gameAreaRef.current.getBoundingClientRect();

        // Calculate position relative to game area
        setPlayerPosition({
          x: playerRect.left - gameAreaRect.left + playerRect.width / 2,
          y: playerRect.top - gameAreaRect.top + playerRect.height / 2,
        });
      }
    };

    updatePlayerPosition();
    const interval = setInterval(updatePlayerPosition, 50); // Update every 50ms
    window.addEventListener("resize", updatePlayerPosition);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", updatePlayerPosition);
    };
  }, []);

  return (
    <div
      className="game-play-area"
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <GameStats level={level} score={score} lives={lives} />

      {/* Render aliens */}
      {aliens.map((alien) => (
        <WordAlien
          key={alien.id}
          word={alien.word}
          x={alien.x}
          y={alien.y}
          currentInput={currentInput}
          isCompleted={alien.isCompleted}
          onExploded={() => onAlienExploded?.(alien.id)}
        />
      ))}

      {/* Render laser effects */}
      {effects.map((effect) => {
        if (
          effect.type === "laser" &&
          effect.startX != null &&
          effect.startY != null &&
          effect.endX != null &&
          effect.endY != null
        ) {
          return (
            <Laser
              key={effect.id}
              startX={effect.startX}
              startY={effect.startY}
              endX={effect.endX}
              endY={effect.endY}
            />
          );
        }
        return null;
      })}

      {/* Render player */}
      <div ref={playerRef}>
        <Player />
      </div>

      {/* Render input */}
      <div className="absolute w-full bottom-0 left-0" style={{ zIndex: 9999 }}>
        <GameInput
          currentInput={currentInput}
          onInputChange={onInputChange}
          inputRef={inputRef}
        />
      </div>

      {/* Power-up effects */}
      <PowerUpEffects
        activePowerUps={activePowerUps}
        playerPosition={playerPosition}
      />
    </div>
  );
};

export default GamePlayArea;
