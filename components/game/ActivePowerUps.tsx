import React from "react";
import { ActivePowerUp, POWER_UP_CONFIG } from "../../types/PowerUp";

interface ActivePowerUpsProps {
  activePowerUps: ActivePowerUp[];
}

const ActivePowerUps: React.FC<ActivePowerUpsProps> = ({ activePowerUps }) => {
  if (activePowerUps.length === 0) return null;

  return (
    <div className="power-up-indicator">
      {activePowerUps.map((powerUp) => {
        const config = POWER_UP_CONFIG[powerUp.type];
        const remainingTime = Math.ceil((powerUp.endTime - Date.now()) / 1000);

        return (
          <div
            key={`${powerUp.type}-${powerUp.endTime}`}
            className="power-up-timer"
            style={{
              border: `2px solid ${config.color}`,
              boxShadow: `0 0 5px ${config.color}`,
            }}
          >
            <span
              className="mr-2"
              style={{
                color: config.color,
                textShadow: `0 0 3px ${config.color}`,
              }}
            >
              {powerUp.type === "shield" ? "🛡️" : "⏰"}
            </span>
            <span
              style={{
                color: config.color,
                textShadow: `0 0 3px ${config.color}`,
              }}
            >
              {remainingTime}s
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ActivePowerUps;
