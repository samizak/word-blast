interface GameOverProps {
  level: number;
  score: number;
  onPlayAgain: () => void;
}

export default function GameOver({ level, score, onPlayAgain }: GameOverProps) {
  return (
    <div className="game-over">
      <div>Game Over</div>
      <div className="text-2xl mt-4">Level: {level}</div>
      <div className="text-2xl mt-4">Final Score: {score}</div>
      <button
        className="mt-8 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        onClick={onPlayAgain}
      >
        Play Again
      </button>
    </div>
  );
}
