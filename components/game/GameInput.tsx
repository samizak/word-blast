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
    <input
      ref={inputRef}
      type="text"
      className="input-area"
      value={currentInput.trim()}
      onChange={onInputChange}
      placeholder="Type words here"
      autoFocus
    />
  );
}
