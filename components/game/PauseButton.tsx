import { Pause, Play } from "lucide-react";

interface PauseButtonProps {
  isPaused: boolean;
  onTogglePause: () => void;
}

const PauseButton: React.FC<PauseButtonProps> = ({
  isPaused,
  onTogglePause,
}) => {
  return (
    <button
      onClick={onTogglePause}
      className="mute-button"
      aria-label={isPaused ? "Resume game" : "Pause game"}
    >
      {isPaused ? (
        <Play size={32} color="#ffffff" strokeWidth={2} />
      ) : (
        <Pause size={32} color="#ffffff" strokeWidth={2} />
      )}
    </button>
  );
};

export default PauseButton;
