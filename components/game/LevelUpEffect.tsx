import React, { useEffect, useState } from "react";

interface LevelUpEffectProps {
  level: number;
  onComplete?: () => void;
}

export default function LevelUpEffect({
  level,
  onComplete,
}: LevelUpEffectProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide the effect after animation
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 2000,
      }}
    >
      {/* Background Flash */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 255, 170, 0.1)",
          animation: "levelUpFlash 2s ease-out forwards",
        }}
      />

      {/* Level Up Text */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          animation: "levelUpText 2s ease-out forwards",
        }}
      >
        <div
          style={{
            color: "#00ffaa",
            fontSize: "3em",
            fontWeight: "bold",
            textShadow: "0 0 20px rgba(0, 255, 170, 0.8)",
            marginBottom: "0.5em",
          }}
        >
          Level Up!
        </div>
        <div
          style={{
            color: "#fff",
            fontSize: "2em",
            textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
          }}
        >
          Level {level}
        </div>
      </div>

      {/* Particle Effects */}
      <div
        className="particles"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          backgroundColor: "#00ffaa",
        }}
      />

      <style jsx global>{`
        @keyframes levelUpFlash {
          0% {
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes levelUpText {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          20% {
            transform: scale(1.2);
            opacity: 1;
          }
          80% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .particles {
          animation: particleExplosion 1s ease-out forwards;
        }

        .particles::before,
        .particles::after {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #00ffaa;
          animation: particleExplosion 1s ease-out forwards;
        }

        @keyframes particleExplosion {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(50);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
