import { useEffect, useRef } from 'react';
import { GameState } from './useGameState';
import { Alien } from './useAliens';

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
    if (gameState !== 'countdown') {
      canPlayCountdownSound.current = true;
      return;
    }

    // Play sound immediately when countdown starts
    if (canPlayCountdownSound.current) {
      window.playSound?.('countdown');
      canPlayCountdownSound.current = false;
    }

    const interval = setInterval(() => {
      if (countdown <= 1) {
        clearInterval(interval);
        // Set countdown to 0 first to show "GO!"
        setCountdown(0);
        
        // Delay the transition to playing state to allow "GO!" to be visible
        setTimeout(() => {
          setGameState('playing');
          generateAlien();
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 1000); // Show "GO!" for 1 second
        
        return;
      }

      // Play countdown sound for each number
      if (canPlayCountdownSound.current) {
        window.playSound?.('countdown');
        canPlayCountdownSound.current = false;
      }

      setCountdown(countdown - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [gameState, countdown, setCountdown, setGameState, generateAlien]);
}