"use client";

import React, { createContext, useContext, useState, useRef } from "react";
import { useGameState, GameState } from "../../hooks/useGameState";
import { useAliens, Alien } from "../../hooks/useAliens";
import { useEffects } from "../../hooks/useEffects";
import { useSoundManager } from "../../hooks/useSoundManager";
import { usePowerUps } from "../../hooks/usePowerUps";
import { ActivePowerUp } from "../../types/PowerUp";

interface GameContextType {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  score: number;
  level: number;
  lives: number;
  isMuted: boolean;
  toggleMute: () => void;
  startGame: () => void;
  aliens: Alien[];
  effects: any[];
  currentInput: string;
  setCurrentInput: (input: string) => void;
  activePowerUps: ActivePowerUp[];
}

const GameContext = createContext<GameContextType>({} as GameContextType);

export const useGameContext = () => useContext(GameContext);

interface GameControllerProps {
  children: React.ReactNode;
}

const GameController: React.FC<GameControllerProps> = ({ children }) => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [currentInput, setCurrentInput] = useState("");

  const {
    gameState,
    setGameState,
    level,
    score,
    lives,
    startGame,
    wordsInLevel,
    setWordsInLevel,
  } = useGameState();

  const { isMuted, toggleMute } = useSoundManager(gameState);

  const { effects } = useEffects();

  const { activePowerUps } = usePowerUps(
    gameState,
    gameContainerRef as React.RefObject<HTMLDivElement>
  );

  const { aliens } = useAliens(
    gameState,
    level,
    () => {},
    gameContainerRef as React.RefObject<HTMLDivElement>,
    setWordsInLevel,
    wordsInLevel,
    activePowerUps
  );

  const contextValue: GameContextType = {
    gameState,
    setGameState,
    score,
    level,
    lives,
    isMuted,
    toggleMute,
    startGame,
    aliens,
    effects,
    currentInput,
    setCurrentInput,
    activePowerUps,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};

export default GameController;
