import React, { useEffect, useState } from "react";

interface ExplosionProps {
  x: number;
  y: number;
  size?: number;
  duration?: number;
}

export default function Explosion({
  x,
  y,
  size = 100,
  duration = 500,
}: ExplosionProps) {
  const [frame, setFrame] = useState(0);
  const [visible, setVisible] = useState(true);

  const colors = ["#ff0000", "#ff7700", "#ffff00", "#ffffff"];

  useEffect(() => {
    const framesCount = 5;
    const frameInterval = duration / framesCount;

    const animation = setInterval(() => {
      setFrame((prev) => {
        if (prev >= framesCount - 1) {
          clearInterval(animation);
          setTimeout(() => setVisible(false), frameInterval);
          return prev;
        }
        return prev + 1;
      });
    }, frameInterval);

    return () => clearInterval(animation);
  }, [duration]);

  if (!visible) return null;

  const scale = 0.5 + (frame / 5) * 1.5;
  const opacity = 1 - (frame / 5) * 0.8;

  return (
    <div
      style={{
        position: "absolute",
        left: `${x - size / 2}px`,
        top: `${y - size / 2}px`,
        width: `${size}px`,
        height: `${size}px`,
        zIndex: 200,
      }}
    >
      {colors.map((color, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: `${size * (0.8 - i * 0.15) * scale}px`,
            height: `${size * (0.8 - i * 0.15) * scale}px`,
            borderRadius: "50%",
            backgroundColor: color,
            boxShadow: `0 0 ${size / 4}px ${size / 8}px ${color}`,
            transform: "translate(-50%, -50%)",
            opacity: opacity,
          }}
        />
      ))}
    </div>
  );
}
