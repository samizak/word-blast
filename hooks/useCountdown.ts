import { useEffect, useRef } from "react";
import { GameState } from "./useGameState";

export function useCountdown(
  gameState: GameState,
  countdown: number,
  setCountdown: (countdown: number) => void,
  setGameState: (state: GameState) => void,
  generateAlien: () => void,
  inputRef: React.RefObject<HTMLInputElement>
) {
  const canPlayCountdownSound = useRef(true);

  useEffect(() => {
    if (gameState !== "countdown") {
      canPlayCountdownSound.current = true;
      return;
    }

    if (canPlayCountdownSound.current) {
      window.playSound?.("countdown");
      canPlayCountdownSound.current = false;
    }

    const interval = setInterval(() => {
      if (countdown <= 1) {
        clearInterval(interval);
        setCountdown(0);

        setTimeout(() => {
          setGameState("playing");
          generateAlien();
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 1000);

        return;
      }

      if (canPlayCountdownSound.current) {
        window.playSound?.("countdown");
        canPlayCountdownSound.current = false;
      }

      setCountdown(countdown - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [gameState, countdown, setCountdown, setGameState, generateAlien]);
}
