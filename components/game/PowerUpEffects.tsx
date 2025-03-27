import React from "react";
import { ActivePowerUp } from "../../types/PowerUp";

interface PowerUpEffectsProps {
  activePowerUps: ActivePowerUp[];
  playerPosition: { x: number; y: number };
}

const PowerUpEffects: React.FC<PowerUpEffectsProps> = ({
  activePowerUps,
  playerPosition,
}) => {
  return (
    <>
      {/* Shield Effect */}
      {activePowerUps.some((p) => p.type === "shield") && (
        <div
          className="absolute pointer-events-none"
          style={{
            position: "fixed",
            left: "50%",
            bottom: "40px",
            width: "240px",
            height: "180px",
            marginLeft: "-120px",
            zIndex: 50,
          }}
        >
          {/* Inner Shield Ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "5px solid rgba(0, 255, 255, 0.8)",
              animation: "shield-pulse 2s infinite",
              boxShadow:
                "0 0 50px rgba(0, 255, 255, 0.6), inset 0 0 50px rgba(0, 255, 255, 0.6)",
            }}
          />
          {/* Outer Shield Ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "4px solid rgba(0, 255, 255, 0.5)",
              animation: "shield-rotate 4s linear infinite",
              boxShadow: "0 0 40px rgba(0, 255, 255, 0.5)",
            }}
          >
            {/* Shield Particles */}
            <div
              className="absolute w-5 h-5 rounded-full"
              style={{
                background: "rgba(0, 255, 255, 0.8)",
                boxShadow: "0 0 20px rgba(0, 255, 255, 0.8)",
                animation: "shield-particle 2s linear infinite",
              }}
            />
          </div>
        </div>
      )}

      {/* Slow Time Effect */}
      {activePowerUps.some((p) => p.type === "slowTime") && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: "0",
            top: "0",
            right: "0",
            bottom: "0",
            animation: "slow-time-pulse 4s infinite",
            zIndex: 40,
          }}
        >
          {/* Time Slow Waves */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at center, transparent 0%, rgba(153, 51, 255, 0.2) 70%, transparent 100%)",
              animation: "slow-time-wave 2s ease-out infinite",
            }}
          />
          {/* Time Particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: "rgba(153, 51, 255, 0.9)",
                boxShadow: "0 0 8px rgba(153, 51, 255, 0.9)",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `time-particle ${
                  2 + Math.random() * 2
                }s linear infinite`,
              }}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default PowerUpEffects;
