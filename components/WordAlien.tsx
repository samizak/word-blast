import { useState, useEffect } from "react";
import PlanetShape from "./PlanetShape";
import WordExplosion from "./WordExplosion";

export default function WordAlien({
  word,
  x,
  y,
  currentInput = "",
  isCompleted = false,
  onExploded,
}: {
  word: string;
  x: number;
  y: number;
  currentInput?: string;
  isCompleted?: boolean;
  onExploded?: () => void;
}) {
  const [showExplosion, setShowExplosion] = useState(false);

  useEffect(() => {
    if (isCompleted && !showExplosion) {
      setShowExplosion(true);
      window.playSound?.("explosion");
    }
  }, [isCompleted, showExplosion]);

  const planetTypes = [
    "rocky",
    "gas",
    "ice",
    "lava",
    "earth",
    "ringed",
  ] as const;

  const planetIndex = word.charCodeAt(0) % planetTypes.length;
  const planetType = planetTypes[planetIndex];

  const baseSize = 80;

  return (
    <div
      className="word-alien"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        opacity: showExplosion ? 0 : 1,
        transition: "opacity 0.2s ease-out",
      }}
    >
      <PlanetShape
        type={planetType}
        size={baseSize}
        word={word}
        currentInput={currentInput}
      />
      {showExplosion && (
        <WordExplosion
          x={baseSize / 2}
          y={baseSize / 2}
          word={word}
          onComplete={() => {
            onExploded?.();
          }}
        />
      )}
    </div>
  );
}
