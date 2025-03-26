export default function WordAlien({
  word,
  x,
  y,
}: {
  word: string;
  x: number;
  y: number;
}) {
  return (
    <div
      className="word-alien"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <div className="alien-sprite">👾</div>
      <div className="word-text">{word}</div>
    </div>
  );
}
