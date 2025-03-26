"use client";

import { useState, useEffect } from "react";

export default function Player() {
  const [position, setPosition] = useState(50); // percentage from left

  // Handle keyboard movement
  useEffect(() => {
    const handleKeyDown = (e: { key: string }) => {
      if (e.key === "ArrowLeft") {
        setPosition((prev) => Math.max(prev - 2, 0));
      } else if (e.key === "ArrowRight") {
        setPosition((prev) => Math.min(prev + 2, 100));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className="player"
      style={{
        left: `calc(${position}% - 30px)`,
      }}
    >
      🚀
    </div>
  );
}
