import React from "react";
import { PowerUp as PowerUpType } from "../types/PowerUp";
import { POWER_UP_CONFIG } from "../utils/gameConfigUtils";

interface PowerUpProps {
  powerUp: PowerUpType;
}

const PowerUp: React.FC<PowerUpProps> = ({ powerUp }) => {
  const config = POWER_UP_CONFIG[powerUp.type];

  return (
    <div
      className="power-up absolute flex flex-col items-center animate-float z-10"
      style={{
        left: `${powerUp.x}px`,
        top: `${powerUp.y}px`,
        transition: "top 0.05s linear",
      }}
    >
      <div
        className="w-12 h-12 rounded-full mb-2 flex items-center justify-center"
        style={{
          border: `2px solid ${config.color}`,
          boxShadow: `0 0 10px ${config.color}`,
          background: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <span
          className="text-2xl"
          style={{
            color: config.color,
            textShadow: `0 0 5px ${config.color}`,
          }}
        >
          {powerUp.type === "shield" ? "🛡️" : "⏰"}
        </span>
      </div>

      <span
        className="text-xl font-bold tracking-wider"
        style={{
          color: config.color,
          textShadow: `0 0 5px ${config.color}`,
        }}
      >
        {powerUp.word}
      </span>
    </div>
  );
};

export default PowerUp;
