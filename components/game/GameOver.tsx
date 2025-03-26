import React from "react";
import { getHighestScore, saveHighScore } from "../../utils/highScore";

interface GameOverProps {
  level: number;
  score: number;
  onPlayAgain: () => void;
}

export default function GameOver({ level, score, onPlayAgain }: GameOverProps) {
  const highestScore = getHighestScore();

  // Save the score if it's higher than the current high score
  React.useEffect(() => {
    if (!highestScore || score > highestScore.score) {
      saveHighScore(score, level);
    }
  }, [score, level, highestScore]);

  return (
    <div className="game-over">
      <h2 className="text-3xl font-bold mb-4">Game Over</h2>
      <div className="stats-container mb-6">
        <div className="stat-item">
          <span className="stat-label">Final Score</span>
          <span className="stat-value">{score}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Level Reached</span>
          <span className="stat-value">{level}</span>
        </div>
        {highestScore && (
          <div className="stat-item">
            <span className="stat-label">High Score</span>
            <span className="stat-value text-yellow-400">
              {highestScore.score}
            </span>
          </div>
        )}
      </div>
      <button
        onClick={onPlayAgain}
        className="play-again-button bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
      >
        Play Again
      </button>
    </div>
  );
}
