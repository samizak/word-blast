import { useEffect } from "react";
import { GameState } from "../types/game";

export function useGameSound(isMuted: boolean, gameState: GameState) {
  useEffect(() => {
    if (gameState === "playing") {
      if (isMuted) {
        window.stopLoopingSound?.("atmosphere");
      } else {
        window.playLoopingSound?.("atmosphere");
      }
    }
  }, [isMuted, gameState]);

  const playSound = (soundName: string) => {
    if (!isMuted) {
      window.playSound?.(soundName);
    }
  };

  const playLoopingSound = (soundName: string) => {
    if (!isMuted) {
      window.playLoopingSound?.(soundName);
    }
  };

  return { playSound, playLoopingSound };
} 