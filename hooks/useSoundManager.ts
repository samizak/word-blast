import { useState, useEffect } from 'react';
import { GameState } from './useGameState';

export function useSoundManager(gameState: GameState) {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);

    if (!newMuteState && gameState === "playing") {
      window.playLoopingSound?.("atmosphere");
    }
  };

  useEffect(() => {
    if (gameState === "playing") {
      if (isMuted) {
        window.stopLoopingSound?.("atmosphere");
      } else {
        window.playLoopingSound?.("atmosphere");
      }
    }
  }, [isMuted, gameState]);

  useEffect(() => {
    if (gameState === "gameOver") {
      window.stopLoopingSound?.("atmosphere");
      setTimeout(() => {
        window.playSound?.("gameOver");
      }, 100);
    }
  }, [gameState]);

  useEffect(() => {
    return () => {
      window.stopLoopingSound?.("atmosphere");
    };
  }, []);

  return {
    isMuted,
    setIsMuted,
    toggleMute,
  };
} 