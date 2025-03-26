interface StartScreenProps {
  onStartGame: () => void;
}

export default function StartScreen({ onStartGame }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-3xl mb-4">Word Blast</h2>
      <p className="mb-6 text-center max-w-md">
        Type the words on the falling aliens to destroy them before they reach
        the bottom!
      </p>
      <button
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        onClick={onStartGame}
      >
        Start Game
      </button>
    </div>
  );
}
