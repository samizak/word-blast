import { useState } from 'react';
import { Alien } from './useAliens';

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

  const createEffects = (targetAlien: Alien, playerRef: React.RefObject<HTMLDivElement>, gameContainerRef: React.RefObject<HTMLDivElement>) => {
    const playerElement = playerRef.current?.querySelector<HTMLDivElement>(":scope > div");
    if (!playerElement) return;

    const gameRect = gameContainerRef.current?.getBoundingClientRect();
    const playerRect = playerElement.getBoundingClientRect();

    if (!gameRect) return;

    const playerX = playerRect.left - gameRect.left + playerRect.width / 2;
    const playerY = gameRect.bottom - playerRect.height;
    const targetX = targetAlien.x + gameRect.left;
    const targetY = targetAlien.y + gameRect.top;

    const laserId = `laser-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const explosionId = `explosion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

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
        prev.filter((effect) => effect.id !== laserId && effect.id !== explosionId)
      );
    }, 800);
  };

  return {
    effects,
    setEffects,
    createEffects,
  };
} 