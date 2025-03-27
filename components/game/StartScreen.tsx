import React, { useState, useEffect } from "react";
import { getHighestScore } from "../../utils/highScore";

interface StartScreenProps {
  onStartGame: () => void;
}

export default function StartScreen({ onStartGame }: StartScreenProps) {
  const [highestScore, setHighestScore] = useState<{
    score: number;
    level: number;
  } | null>(null);

  useEffect(() => {
    setHighestScore(getHighestScore());
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div
        className="relative mb-12"
        style={{
          padding: "20px 40px",
          border: "2px solid rgba(0, 255, 255, 0.5)",
          borderRadius: "8px",
          background: "rgba(0, 0, 0, 0.8)",
          boxShadow: `
            0 0 10px rgba(0, 255, 255, 0.5),
            inset 0 0 20px rgba(0, 255, 255, 0.3)
          `,
        }}
      >
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-500" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-500" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-500" />

        <h1
          className="text-6xl font-bold text-cyan-500"
          style={{
            fontFamily: "Courier New, monospace",
            textShadow: "0 0 10px rgba(0, 255, 255, 0.7)",
          }}
        >
          Word Blast
        </h1>
      </div>

      {highestScore && (
        <div
          className="mb-12 relative"
          style={{
            padding: "15px 30px",
            border: "2px solid rgba(255, 215, 0, 0.5)",
            borderRadius: "8px",
            background: "rgba(0, 0, 0, 0.8)",
            boxShadow: `
              0 0 10px rgba(255, 215, 0, 0.3),
              inset 0 0 15px rgba(255, 215, 0, 0.2)
            `,
          }}
        >
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-yellow-500" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-yellow-500" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-yellow-500" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-yellow-500" />

          <div className="text-center">
            <p
              className="text-xl text-yellow-300"
              style={{ fontFamily: "Courier New, monospace" }}
            >
              High Score
            </p>
            <p
              className="text-3xl font-bold text-yellow-400"
              style={{
                fontFamily: "Courier New, monospace",
                textShadow: "0 0 8px rgba(255, 215, 0, 0.5)",
              }}
            >
              {highestScore.score}
            </p>
            <p
              className="text-sm text-yellow-200"
              style={{ fontFamily: "Courier New, monospace" }}
            >
              Level {highestScore.level}
            </p>
          </div>
        </div>
      )}

      <button
        onClick={onStartGame}
        className="text-2xl px-8 py-4 relative cursor-pointer"
        style={{
          fontFamily: "Courier New, monospace",
          background: "rgba(0, 255, 0, 0.2)",
          border: "2px solid rgba(0, 255, 0, 0.5)",
          borderRadius: "8px",
          color: "#00ff00",
          textShadow: "0 0 8px rgba(0, 255, 0, 0.7)",
          boxShadow: `
            0 0 10px rgba(0, 255, 0, 0.3),
            inset 0 0 15px rgba(0, 255, 0, 0.2)
          `,
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(0, 255, 0, 0.3)";
          e.currentTarget.style.boxShadow = `
            0 0 15px rgba(0, 255, 0, 0.5),
            inset 0 0 20px rgba(0, 255, 0, 0.3)
          `;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(0, 255, 0, 0.2)";
          e.currentTarget.style.boxShadow = `
            0 0 10px rgba(0, 255, 0, 0.3),
            inset 0 0 15px rgba(0, 255, 0, 0.2)
          `;
        }}
      >
        Start Game
      </button>
    </div>
  );
}
