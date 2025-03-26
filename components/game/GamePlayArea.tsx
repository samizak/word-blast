import WordAlien from "../WordAlien";
import Player from "../Player";
import GameInput from "./GameInput";
import GameEffects from "./GameEffects";
import GameStats from "./GameStats";
import { Alien, Effect } from "../../types/game";

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
}: GamePlayAreaProps) {
  return (
    <>
      <GameStats level={level} score={score} lives={lives} />
      {aliens.map((alien) => (
        <WordAlien
          key={alien.id}
          word={alien.word}
          x={alien.x}
          y={alien.y}
          currentInput={currentInput}
        />
      ))}
      <GameEffects effects={effects} />
      <div ref={playerRef}>
        <Player />
      </div>
      <GameInput
        currentInput={currentInput}
        onInputChange={onInputChange}
        inputRef={inputRef}
      />
    </>
  );
}
