import React, { useEffect, useState } from "react";
import { getHighestScore } from "../../utils/highScore";

interface GameStatsProps {
  level: number;
  score: number;
  lives: number;
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={filled ? "#ff0066" : "rgba(255, 0, 102, 0.2)"}
      style={{
        filter: filled ? "drop-shadow(0 0 4px rgba(255, 0, 102, 0.5))" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

export default function GameStats({ level, score, lives }: GameStatsProps) {
  const [isLevelAnimating, setIsLevelAnimating] = useState(false);
  const [prevLevel, setPrevLevel] = useState(level);
  const highestScore = getHighestScore();

  useEffect(() => {
    if (level !== prevLevel) {
      setIsLevelAnimating(true);
      setPrevLevel(level);

      // Reset animation after it completes
      const timer = setTimeout(() => {
        setIsLevelAnimating(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [level, prevLevel]);

  return (
    <div
      className="game-stats"
      style={{
        position: "absolute",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "32px",
        padding: "12px 24px",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        borderRadius: "16px",
        boxShadow: "0 0 20px rgba(0, 255, 170, 0.2)",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            color: "#888",
            fontSize: "0.8em",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "4px",
          }}
        >
          Level
        </div>
        <div
          style={{
            color: "#00ffaa",
            fontSize: "1.5em",
            fontWeight: "bold",
            textShadow: "0 0 10px rgba(0, 255, 170, 0.5)",
            animation: isLevelAnimating ? "levelPop 1s ease-out" : "none",
          }}
        >
          {level}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            color: "#888",
            fontSize: "0.8em",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "4px",
          }}
        >
          Score
        </div>
        <div
          style={{
            color: "#00ffaa",
            fontSize: "1.5em",
            fontWeight: "bold",
            textShadow: "0 0 10px rgba(0, 255, 170, 0.5)",
          }}
        >
          {score.toLocaleString()}
        </div>
      </div>

      {highestScore && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              color: "#888",
              fontSize: "0.8em",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "4px",
            }}
          >
            High Score
          </div>
          <div
            style={{
              color: "#00ffaa",
              fontSize: "1.5em",
              fontWeight: "bold",
              textShadow: "0 0 10px rgba(0, 255, 170, 0.5)",
            }}
          >
            {highestScore.score.toLocaleString()}
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            color: "#888",
            fontSize: "0.8em",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "4px",
          }}
        >
          Lives
        </div>
        <div
          style={{
            display: "flex",
            gap: "4px",
            height: "24px",
            alignItems: "center",
          }}
        >
          {[...Array(3)].map((_, i) => (
            <HeartIcon key={i} filled={i < lives} />
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes levelPop {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.5);
            color: #fff;
            text-shadow: 0 0 20px rgba(0, 255, 170, 0.8);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
