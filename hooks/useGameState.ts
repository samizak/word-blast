import { useReducer, useCallback } from "react";

export type GameState =
  | "start"
  | "countdown"
  | "playing"
  | "gameOver"
  | "paused"
  | "levelUp";

type GameStateAction =
  | { type: "START_GAME" }
  | { type: "SET_GAME_STATE"; payload: GameState }
  | { type: "SET_COUNTDOWN"; payload: number }
  | { type: "SET_LEVEL"; payload: number }
  | { type: "SET_SCORE"; payload: number }
  | { type: "SET_LIVES"; payload: number }
  | { type: "SET_WORDS_IN_LEVEL"; payload: number }
  | { type: "SET_SHOW_LEVEL_UP"; payload: boolean }
  | { type: "INCREMENT_SCORE"; payload: number }
  | { type: "DECREMENT_LIVES"; payload: number }
  | { type: "TOGGLE_PAUSE" };

interface GameStateData {
  gameState: GameState;
  countdown: number;
  level: number;
  score: number;
  lives: number;
  wordsInLevel: number;
  showLevelUp: boolean;
}

const initialState: GameStateData = {
  gameState: "start",
  countdown: 3,
  level: 1,
  score: 0,
  lives: 3,
  wordsInLevel: 0,
  showLevelUp: false,
};

function gameStateReducer(
  state: GameStateData,
  action: GameStateAction
): GameStateData {
  switch (action.type) {
    case "START_GAME":
      return {
        ...initialState,
        gameState: "countdown",
      };
    case "SET_GAME_STATE":
      return { ...state, gameState: action.payload };
    case "SET_COUNTDOWN":
      return { ...state, countdown: action.payload };
    case "SET_LEVEL":
      return { ...state, level: action.payload };
    case "SET_SCORE":
      return { ...state, score: action.payload };
    case "SET_LIVES":
      return { ...state, lives: action.payload };
    case "SET_WORDS_IN_LEVEL":
      return { ...state, wordsInLevel: action.payload };
    case "SET_SHOW_LEVEL_UP":
      return { ...state, showLevelUp: action.payload };
    case "INCREMENT_SCORE":
      return { ...state, score: state.score + action.payload };
    case "DECREMENT_LIVES":
      return { ...state, lives: state.lives - action.payload };
    case "TOGGLE_PAUSE":
      return {
        ...state,
        gameState: state.gameState === "playing" ? "paused" : "playing",
      };
    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameStateReducer, initialState);

  const startGame = useCallback(() => {
    dispatch({ type: "START_GAME" });
  }, []);

  const setGameState = useCallback((newState: GameState) => {
    dispatch({ type: "SET_GAME_STATE", payload: newState });
  }, []);

  const setCountdown = useCallback((countdown: number) => {
    dispatch({ type: "SET_COUNTDOWN", payload: countdown });
  }, []);

  const setLevel = useCallback((level: number) => {
    dispatch({ type: "SET_LEVEL", payload: level });
  }, []);

  const setScore = useCallback((score: number) => {
    dispatch({ type: "SET_SCORE", payload: score });
  }, []);

  const setLives = useCallback((lives: number) => {
    dispatch({ type: "SET_LIVES", payload: lives });
  }, []);

  const setWordsInLevel = useCallback((wordsInLevel: number) => {
    dispatch({ type: "SET_WORDS_IN_LEVEL", payload: wordsInLevel });
  }, []);

  const setShowLevelUp = useCallback((showLevelUp: boolean) => {
    dispatch({ type: "SET_SHOW_LEVEL_UP", payload: showLevelUp });
  }, []);

  const incrementScore = useCallback((amount: number) => {
    dispatch({ type: "INCREMENT_SCORE", payload: amount });
  }, []);

  const decrementLives = useCallback((amount: number) => {
    dispatch({ type: "DECREMENT_LIVES", payload: amount });
  }, []);

  const togglePause = useCallback(() => {
    dispatch({ type: "TOGGLE_PAUSE" });
  }, []);

  return {
    ...state,
    startGame,
    setGameState,
    setCountdown,
    setLevel,
    setScore,
    setLives,
    setWordsInLevel,
    setShowLevelUp,
    incrementScore,
    decrementLives,
    togglePause,
  };
}
