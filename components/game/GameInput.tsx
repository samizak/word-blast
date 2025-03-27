interface GameInputProps {
  currentInput: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export default function GameInput({
  currentInput,
  onInputChange,
  inputRef,
}: GameInputProps) {
  return (
    <div className="input-container">
      <input
        ref={inputRef}
        type="text"
        className="input-area neon-input"
        value={currentInput.trim()}
        onChange={onInputChange}
        placeholder="Type words here"
        autoFocus
        autoComplete="off"
        spellCheck="false"
      />
    </div>
  );
}
