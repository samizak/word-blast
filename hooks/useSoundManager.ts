import { useState, useEffect, useCallback, useRef } from "react";
import { GameState } from "./useGameState";
import { useSound } from "./useSound";

export function useSoundManager(gameState: GameState) {
  const [isMuted, setIsMuted] = useState(false);
  const { playSound, playLoopingSound, stopLoopingSound } = useSound({ isMuted });
  
  const atmosphereTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const gameOverTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const isPlayingRef = useRef(false);
  const soundTransitionRef = useRef(false);

  const playAtmosphereSound = useCallback(async () => {
    if (soundTransitionRef.current) return;

    try {
      soundTransitionRef.current = true;
      if (!isMuted && !isPlayingRef.current) {
        stopLoopingSound("atmosphere");
        await new Promise((resolve) => setTimeout(resolve, 50));
        isPlayingRef.current = true;
        playLoopingSound("atmosphere");
      }
    } catch (error) {
      console.warn("Error playing atmosphere sound:", error);
      isPlayingRef.current = false;
    } finally {
      soundTransitionRef.current = false;
    }
  }, [isMuted, playLoopingSound, stopLoopingSound]);

  const stopAtmosphereSound = useCallback(async () => {
    if (soundTransitionRef.current) return;

    try {
      soundTransitionRef.current = true;
      if (isPlayingRef.current) {
        isPlayingRef.current = false;
        stopLoopingSound("atmosphere");
      }
    } catch (error) {
      console.warn("Error stopping atmosphere sound:", error);
    } finally {
      soundTransitionRef.current = false;
    }
  }, [stopLoopingSound]);

  const playGameOverSound = useCallback(() => {
    try {
      playSound("gameOver");
    } catch (error) {
      console.warn("Error playing game over sound:", error);
    }
  }, [playSound]);

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
