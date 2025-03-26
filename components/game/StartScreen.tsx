import React from "react";
import { getHighestScore } from "../../utils/highScore";

interface StartScreenProps {
  onStartGame: () => void;
}

export default function StartScreen({ onStartGame }: StartScreenProps) {
  const highestScore = getHighestScore();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold mb-8">Word Blast</h1>
      {highestScore && (
        <div className="mb-8 text-center">
          <p className="text-xl text-gray-300">High Score</p>
          <p className="text-3xl font-bold text-yellow-400">
            {highestScore.score}
          </p>
          <p className="text-sm text-gray-400">Level {highestScore.level}</p>
        </div>
      )}
      <button
        onClick={onStartGame}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Start Game
      </button>
    </div>
  );
}
