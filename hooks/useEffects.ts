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

      const playerRect = playerElement.getBoundingClientRect();
      const playerX = playerRect.left - gameRect.left + playerRect.width / 2;
      const playerY = playerRect.top - gameRect.top + playerRect.height / 2;

      const basePlanetSize = 80;
      const charWidth = 12;
      const wordWidth = targetAlien.word.length * charWidth;
      const padding = 48;
      const planetSize = Math.max(basePlanetSize, wordWidth + padding);
      const planetRadius = planetSize / 2;

      const targetX = targetAlien.x;
      const targetY = targetAlien.y;

      const laserId = `laser-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 11)}`;
      const explosionId = `explosion-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 11)}`;

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
