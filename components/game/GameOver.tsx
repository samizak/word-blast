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

  useEffect(() => {
    setHighestScore(getHighestScore());
  }, []);

  useEffect(() => {
    if (!highestScore || score > highestScore.score) {
      saveHighScore(score, level);
      setHighestScore({ score, level });
    }
  }, [score, level, highestScore]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
      <div
        style={{
          color: "#ff0066",
          fontSize: "5rem",
          fontWeight: "bold",
          textShadow: "0 0 20px rgba(255, 0, 102, 0.8)",
          fontFamily: "var(--font-geist-mono)",
          letterSpacing: "4px",
          animation: "pulseText 2s infinite",
        }}
      >
        Game Over
      </div>

      <div
        style={{
          padding: "2rem 3rem",
          border: "2px solid #00ffaa",
          borderRadius: "12px",
          background: "rgba(0, 0, 0, 0.8)",
          boxShadow: "0 0 20px rgba(0, 255, 170, 0.3)",
          animation: "pulseBorder 2s infinite",
        }}
      >
        <div className="space-y-4">
          <div
            style={{
              color: "#00ffaa",
              fontSize: "2rem",
              fontFamily: "var(--font-geist-mono)",
              textShadow: "0 0 10px rgba(0, 255, 170, 0.5)",
            }}
          >
            Final Score: {score}
          </div>
          <div
            style={{
              color: "#00ffaa",
              fontSize: "2rem",
              fontFamily: "var(--font-geist-mono)",
              textShadow: "0 0 10px rgba(0, 255, 170, 0.5)",
            }}
          >
            Level: {level}
          </div>
          {highestScore && (
            <div
              style={{
                color: "#ffaa00",
                fontSize: "2rem",
                fontFamily: "var(--font-geist-mono)",
                textShadow: "0 0 10px rgba(255, 170, 0, 0.5)",
              }}
            >
              High Score: {highestScore.score}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onPlayAgain}
        style={{
          padding: "1rem 2rem",
          fontSize: "1.5rem",
          color: "#00ff00",
          background: "transparent",
          border: "2px solid #00ff00",
          borderRadius: "8px",
          cursor: "pointer",
          fontFamily: "var(--font-geist-mono)",
          textShadow: "0 0 10px rgba(0, 255, 0, 0.5)",
          boxShadow: "0 0 15px rgba(0, 255, 0, 0.3)",
          transition: "all 0.3s ease",
        }}
        className="hover:bg-[rgba(0,255,0,0.1)] hover:shadow-[0_0_30px_rgba(0,255,0,0.5)]"
      >
        Play Again
      </button>

      <style jsx global>{`
        @keyframes pulseText {
          0% {
            text-shadow: 0 0 20px rgba(255, 0, 102, 0.8);
          }
          50% {
            text-shadow: 0 0 40px rgba(255, 0, 102, 1);
          }
          100% {
            text-shadow: 0 0 20px rgba(255, 0, 102, 0.8);
          }
        }

        @keyframes pulseBorder {
          0% {
            box-shadow: 0 0 20px rgba(0, 255, 170, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(0, 255, 170, 0.5);
          }
          100% {
            box-shadow: 0 0 20px rgba(0, 255, 170, 0.3);
          }
        }
      `}</style>
    </div>
  );
}
