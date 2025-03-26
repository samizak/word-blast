interface GameStatsProps {
  level: number;
  score: number;
  lives: number;
}

export default function GameStats({ level, score, lives }: GameStatsProps) {
  return (
    <div className="game-stats">
      <div>Level: {level}</div>
      <div>Score: {score}</div>
      <div>Lives: {lives}</div>
    </div>
  );
}
