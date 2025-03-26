import { Volume2, VolumeX } from "lucide-react";

interface MuteButtonProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

export default function MuteButton({ isMuted, onToggleMute }: MuteButtonProps) {
  return (
    <button
      className="mute-button"
      onClick={onToggleMute}
      aria-label={isMuted ? "Unmute" : "Mute"}
    >
      {isMuted ? (
        <VolumeX size={32} color="#ffffff" strokeWidth={2} />
      ) : (
        <Volume2 size={32} color="#ffffff" strokeWidth={2} />
      )}
    </button>
  );
}
