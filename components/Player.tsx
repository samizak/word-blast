"use client";

import { useState, useEffect } from "react";
import PlayerSpaceship from "./PlayerSpaceship";

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
        left: `calc(${position}% - 100px)`, // Adjust to center the larger spaceship
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "transparent", // Remove the background color
        width: "200px", // Match the spaceship width
        height: "200px" // Match the spaceship height
      }}
    >
      <PlayerSpaceship width={200} height={200} />
    </div>
  );
}
