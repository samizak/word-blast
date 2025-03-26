import React from "react";
import WordAlien from "../WordAlien";
import Player from "../Player";
import GameInput from "./GameInput";
import GameStats from "./GameStats";
import Laser from "../Laser";

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
}

export default function GamePlayArea({
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
}: GamePlayAreaProps) {
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
      <GameInput
        currentInput={currentInput}
        onInputChange={onInputChange}
        inputRef={inputRef}
      />
    </div>
  );
}
