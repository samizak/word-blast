interface CountdownProps {
  countdown: number;
}

export default function Countdown({ countdown }: CountdownProps) {
  return (
    <div className="countdown-overlay">
      <div className="countdown-number">
        {countdown === 0 ? "GO!" : countdown}
      </div>
    </div>
  );
}
