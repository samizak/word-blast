import { useEffect, useRef } from 'react';
import { GameState } from './useGameState';

export function useCountdown(
  gameState: GameState,
  countdown: number,
  setCountdown: (cb: (prev: number) => number) => void,
  setGameState: (state: GameState) => void,
  generateAlien: () => void,
  inputRef: React.RefObject<HTMLInputElement>
) {
  const canPlayCountdownSound = useRef(true);

  useEffect(() => {
    if (gameState === "countdown") {
      if (countdown > 0) {
        const soundTimer = setTimeout(() => {
          if (canPlayCountdownSound.current) {
            window.playSound?.("countdown");
            canPlayCountdownSound.current = false;
          }
        }, 100);

        const timer = setTimeout(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);

        return () => {
          clearTimeout(timer);
          clearTimeout(soundTimer);
        };
      } else {
        const timer = setTimeout(() => {
          window.playSound?.("levelUp");
          setTimeout(() => {
            window.playLoopingSound?.("atmosphere");
          }, 200);

          setGameState("playing");
          generateAlien();
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 800);

        return () => clearTimeout(timer);
      }
    }
  }, [gameState, countdown, setCountdown, setGameState, generateAlien]);

  return {
    canPlayCountdownSound,
  };
} 