"use client";

import { useState, useEffect, forwardRef } from "react";
import PlayerSpaceship from "./PlayerSpaceship";

const Player = forwardRef<HTMLDivElement>((props, ref) => {
  const [position, setPosition] = useState(50);

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
      ref={ref}
      className="player"
      style={{
        left: `calc(${position}% - 100px)`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "transparent",
        width: "200px",
        height: "200px",
      }}
    >
      <PlayerSpaceship width={200} height={200} />
    </div>
  );
});

Player.displayName = "Player";

export default Player;
