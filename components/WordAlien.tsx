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
      // Play explosion sound
      window.playSound?.("explosion");
    }
  }, [isCompleted, showExplosion]);

  // Array of planet types
  const planetTypes = [
    "rocky",
    "gas",
    "ice",
    "lava",
    "earth",
    "ringed",
  ] as const;

  // Use the word's first character to deterministically select a planet type
  // This ensures the same word always gets the same planet
  const planetIndex = word.charCodeAt(0) % planetTypes.length;
  const planetType = planetTypes[planetIndex];

  // Base size is 80, but we'll let PlanetShape component handle the dynamic sizing
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
