import { useState } from 'react';

export type GameState = "start" | "countdown" | "playing" | "gameOver";

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>("start");
  const [countdown, setCountdown] = useState<number>(3);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wordsInLevel, setWordsInLevel] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const startGame = () => {
    setGameState("countdown");
    setCountdown(3);
    setLevel(1);
    setScore(0);
    setLives(3);
    setWordsInLevel(0);
    setShowLevelUp(false);
  };

  return {
    gameState,
    setGameState,
    countdown,
    setCountdown,
    level,
    setLevel,
    score,
    setScore,
    lives,
    setLives,
    wordsInLevel,
    setWordsInLevel,
    showLevelUp,
    setShowLevelUp,
    startGame,
  };
} 