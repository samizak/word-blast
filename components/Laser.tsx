import React, { useEffect, useState } from "react";

interface LaserProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration?: number;
  color?: string;
}

export default function Laser({
  startX,
  startY,
  endX,
  endY,
  duration = 300,
  color = "#00ffaa",
}: LaserProps) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate the laser firing
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / (duration * 0.5), 1);
      setProgress(newProgress);

      if (newProgress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);

    // Hide the laser after duration
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration]);

  if (!visible) return null;

  // Calculate the angle and length for laser orientation
  const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
  const length = Math.sqrt(
    Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
  );
  const animatedLength = length * progress;

  // Define gradient colors for layered effect
  const coreColor = color;
  const glowColor = color.replace(")", ", 0.5)").replace("rgb", "rgba");
  const trailColor = color.replace(")", ", 0.2)").replace("rgb", "rgba");

  return (
    <>
      {/* Trail effect */}
      <div
        style={{
          position: "absolute",
          left: `${startX}px`,
          top: `${startY}px`,
          width: `${animatedLength}px`,
          height: "8px",
          background: `linear-gradient(90deg, ${trailColor}, transparent)`,
          boxShadow: `0 0 12px 4px ${trailColor}`,
          transform: `rotate(${angle}deg)`,
          transformOrigin: "0 0",
          zIndex: 99,
          opacity: 0.7,
          filter: "blur(2px)",
        }}
      />

      {/* Main beam - outer glow */}
      <div
        style={{
          position: "absolute",
          left: `${startX}px`,
          top: `${startY}px`,
          width: `${animatedLength}px`,
          height: "5px",
          background: glowColor,
          boxShadow: `0 0 15px 5px ${glowColor}`,
          transform: `rotate(${angle}deg)`,
          transformOrigin: "0 0",
          zIndex: 100,
          animation: "pulse 0.15s ease-in-out infinite alternate",
        }}
      />

      {/* Core beam */}
      <div
        style={{
          position: "absolute",
          left: `${startX}px`,
          top: `${startY}px`,
          width: `${animatedLength}px`,
          height: "2px",
          backgroundColor: coreColor,
          boxShadow: `0 0 8px 2px ${coreColor}`,
          transform: `rotate(${angle}deg)`,
          transformOrigin: "0 0",
          zIndex: 101,
        }}
      />

      {/* Impact point glow */}
      <div
        style={{
          position: "absolute",
          left: `${
            startX + Math.cos((angle * Math.PI) / 180) * animatedLength - 5
          }px`,
          top: `${
            startY + Math.sin((angle * Math.PI) / 180) * animatedLength - 5
          }px`,
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: coreColor,
          boxShadow: `0 0 15px 5px ${coreColor}`,
          opacity: progress,
          zIndex: 102,
        }}
      />

      <style jsx global>{`
        @keyframes pulse {
          0% {
            opacity: 0.8;
            transform: rotate(${angle}deg) scaleY(1);
          }
          100% {
            opacity: 1;
            transform: rotate(${angle}deg) scaleY(1.2);
          }
        }
      `}</style>
    </>
  );
}
