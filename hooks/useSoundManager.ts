import { useState, useEffect, useCallback, useRef } from "react";
import { GameState } from "./useGameState";

export function useSoundManager(gameState: GameState) {
  const [isMuted, setIsMuted] = useState(false);
  const atmosphereTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const gameOverTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const isPlayingRef = useRef(false);
  const soundTransitionRef = useRef(false);

  const playAtmosphereSound = useCallback(async () => {
    if (soundTransitionRef.current) return;

    try {
      soundTransitionRef.current = true;
      if (!isMuted && !isPlayingRef.current) {
        await window.stopLoopingSound?.("atmosphere");
        await new Promise((resolve) => setTimeout(resolve, 50));
        isPlayingRef.current = true;
        await window.playLoopingSound?.("atmosphere");
      }
    } catch (error) {
      console.warn("Error playing atmosphere sound:", error);
      isPlayingRef.current = false;
    } finally {
      soundTransitionRef.current = false;
    }
  }, [isMuted]);

  const stopAtmosphereSound = useCallback(async () => {
    if (soundTransitionRef.current) return;

    try {
      soundTransitionRef.current = true;
      if (isPlayingRef.current) {
        isPlayingRef.current = false;
        await window.stopLoopingSound?.("atmosphere");
      }
    } catch (error) {
      console.warn("Error stopping atmosphere sound:", error);
    } finally {
      soundTransitionRef.current = false;
    }
  }, []);

  const playGameOverSound = useCallback(async () => {
    try {
      await window.playSound?.("gameOver");
    } catch (error) {
      console.warn("Error playing game over sound:", error);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);

    if (!newMuteState && gameState === "playing") {
      setTimeout(() => {
        playAtmosphereSound();
      }, 50);
    } else {
      stopAtmosphereSound();
    }
  }, [isMuted, gameState, playAtmosphereSound, stopAtmosphereSound]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (gameState === "playing") {
      if (isMuted) {
        stopAtmosphereSound();
      } else {
        timeoutId = setTimeout(() => {
          playAtmosphereSound();
        }, 50);
      }
    } else {
      stopAtmosphereSound();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isMuted, gameState, playAtmosphereSound, stopAtmosphereSound]);

  useEffect(() => {
    if (gameState === "gameOver") {
      stopAtmosphereSound();
      gameOverTimeoutRef.current = setTimeout(() => {
        playGameOverSound();
      }, 100);
    }

    return () => {
      if (gameOverTimeoutRef.current) {
        clearTimeout(gameOverTimeoutRef.current);
      }
    };
  }, [gameState, stopAtmosphereSound, playGameOverSound]);

  useEffect(() => {
    return () => {
      stopAtmosphereSound();
      if (atmosphereTimeoutRef.current) {
        clearTimeout(atmosphereTimeoutRef.current);
      }
      if (gameOverTimeoutRef.current) {
        clearTimeout(gameOverTimeoutRef.current);
      }
    };
  }, [stopAtmosphereSound]);

  return {
    isMuted,
    setIsMuted,
    toggleMute,
  };
}
