import PlanetShape from './PlanetShape';

export default function WordAlien({
  word,
  x,
  y,
}: {
  word: string;
  x: number;
  y: number;
}) {
  // Array of planet types
  const planetTypes = ['rocky', 'gas', 'ice', 'lava', 'earth', 'ringed'] as const;
  
  // Use the word's first character to deterministically select a planet type
  // This ensures the same word always gets the same planet
  const planetIndex = word.charCodeAt(0) % planetTypes.length;
  const planetType = planetTypes[planetIndex];
  
  // Base size is 80, but we'll let PlanetShape component handle the dynamic sizing
  const baseSize = 80;
  
  return (
    <div
      className="word-alien"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <PlanetShape type={planetType} size={baseSize} word={word} />
    </div>
  );
}
