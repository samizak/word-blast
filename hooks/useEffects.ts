import { useState, useCallback, useMemo } from "react";
import { Alien } from "./useAliens";

export interface Effect {
  id: string;
  type: "laser" | "explosion";
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  x?: number;
  y?: number;
}

export function useEffects() {
  const [effects, setEffects] = useState<Effect[]>([]);

  const createEffects = useCallback(
    (
      targetAlien: Alien,
      playerRef: React.RefObject<HTMLDivElement>,
      gameContainerRef: React.RefObject<HTMLDivElement>
    ) => {
      const playerElement =
        playerRef.current?.querySelector<HTMLDivElement>(":scope > div");
      if (!playerElement) return;

      const gameRect = gameContainerRef.current?.getBoundingClientRect();
      if (!gameRect) return;

      // Get player position (center of the spaceship)
      const playerRect = playerElement.getBoundingClientRect();
      const playerX = playerRect.left - gameRect.left + playerRect.width / 2;
      const playerY = playerRect.top - gameRect.top + playerRect.height / 2;

      // Calculate the planet size based on word length (similar to how it's done in PlanetShape)
      const basePlanetSize = 80;
      const charWidth = 12;
      const wordWidth = targetAlien.word.length * charWidth;
      const padding = 48;
      const planetSize = Math.max(basePlanetSize, wordWidth + padding);
      const planetRadius = planetSize / 2;

      // Calculate the center of the alien planet
      const targetX = targetAlien.x;
      const targetY = targetAlien.y;

      const laserId = `laser-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const explosionId = `explosion-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Play laser sound with slight delay
      setTimeout(() => {
        window.playSound?.("laser");
      }, 50);

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
        // Play explosion sound with slight delay
        setTimeout(() => {
          window.playSound?.("explosion");
        }, 50);

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
    },
    []
  );

  // Memoize the return object to prevent unnecessary re-renders
  const returnValue = useMemo(
    () => ({
      effects,
      setEffects,
      createEffects,
    }),
    [effects, createEffects]
  );

  return returnValue;
}
