import { useEffect, useRef, useCallback } from 'react';
import { GameState } from './useGameState';

export function useCountdown(
  gameState: GameState,
  countdown: number,
  setCountdown: (countdown: number) => void,
  setGameState: (state: GameState) => void,
  generateAlien: () => void,
  inputRef: React.RefObject<HTMLInputElement>
) {
  const canPlayCountdownSound = useRef(true);
  const soundTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const countdownTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const gameStartTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleCountdownComplete = useCallback(() => {
    window.playSound?.("levelUp");
    gameStartTimerRef.current = setTimeout(() => {
      window.playLoopingSound?.("atmosphere");
      setGameState("playing");
      generateAlien();
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 200);
  }, [setGameState, generateAlien]);

  useEffect(() => {
    if (gameState === "countdown") {
      if (countdown > 0) {
        soundTimerRef.current = setTimeout(() => {
          if (canPlayCountdownSound.current) {
            window.playSound?.("countdown");
            canPlayCountdownSound.current = false;
          }
        }, 100);

        countdownTimerRef.current = setTimeout(() => {
          setCountdown(countdown - 1);
        }, 1000);

        return () => {
          if (soundTimerRef.current) {
            clearTimeout(soundTimerRef.current);
          }
          if (countdownTimerRef.current) {
            clearTimeout(countdownTimerRef.current);
          }
        };
      } else {
        const timer = setTimeout(handleCountdownComplete, 800);
        return () => {
          if (timer) {
            clearTimeout(timer);
          }
        };
      }
    }
  }, [gameState, countdown, setCountdown, handleCountdownComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (soundTimerRef.current) {
        clearTimeout(soundTimerRef.current);
      }
      if (countdownTimerRef.current) {
        clearTimeout(countdownTimerRef.current);
      }
      if (gameStartTimerRef.current) {
        clearTimeout(gameStartTimerRef.current);
      }
    };
  }, []);

  return {
    canPlayCountdownSound,
  };
} 