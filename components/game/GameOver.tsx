import React, { useState, useEffect } from "react";
import { getHighestScore, saveHighScore } from "../../utils/highScore";

interface GameOverProps {
  level: number;
  score: number;
  onPlayAgain: () => void;
}

export default function GameOver({ level, score, onPlayAgain }: GameOverProps) {
  const [highestScore, setHighestScore] = useState<{
    score: number;
    level: number;
  } | null>(null);

  // Initialize high score on client side only
  useEffect(() => {
    setHighestScore(getHighestScore());
  }, []);

  // Save the score if it's higher than the current high score
  useEffect(() => {
    if (!highestScore || score > highestScore.score) {
      saveHighScore(score, level);
      setHighestScore({ score, level });
    }
  }, [score, level, highestScore]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div
        className="relative mb-12"
        style={{
          padding: "20px 40px",
          border: "2px solid rgba(255, 0, 0, 0.5)",
          borderRadius: "8px",
          background: "rgba(0, 0, 0, 0.8)",
          boxShadow: `
            0 0 10px rgba(255, 0, 0, 0.5),
            inset 0 0 20px rgba(255, 0, 0, 0.3)
          `,
        }}
      >
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-500" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-500" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-500" />

        <h2
          className="text-6xl font-bold text-red-500"
          style={{
            fontFamily: "Courier New, monospace",
            textShadow: "0 0 10px rgba(255, 0, 0, 0.7)",
          }}
        >
          Game Over
        </h2>
      </div>

      <div className="space-y-6 mb-12">
        <div
          className="text-4xl text-red-400"
          style={{ fontFamily: "Courier New, monospace" }}
        >
          <span>Final Score </span>
          <span className="font-bold">{score}</span>
        </div>

        <div
          className="text-4xl text-red-400"
          style={{ fontFamily: "Courier New, monospace" }}
        >
          <span>Level Reached </span>
          <span className="font-bold">{level}</span>
        </div>

        {highestScore && (
          <div
            className="text-4xl"
            style={{ fontFamily: "Courier New, monospace" }}
          >
            <span className="text-red-400">High Score </span>
            <span className="font-bold text-yellow-400">
              {highestScore.score}
            </span>
          </div>
        )}
      </div>

      <button
        onClick={onPlayAgain}
        className="text-2xl px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        style={{ fontFamily: "Courier New, monospace" }}
      >
        Play Again
      </button>
    </div>
  );
}
