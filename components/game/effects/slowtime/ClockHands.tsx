import React from "react";

const ClockHands: React.FC = () => {
  return (
    <>
      {/* Reverse-spinning Hour Hand */}
      <div
        className="absolute w-1.5 h-40"
        style={{
          background: "rgba(0, 255, 255, 0.8)",
          left: "50%",
          bottom: "50%",
          transformOrigin: "bottom center",
          animation: "clock-hand-reverse 2s linear infinite",
          boxShadow: "0 0 8px rgba(0, 255, 255, 0.6)",
        }}
      />

      {/* Forward-spinning Minute Hand */}
      <div
        className="absolute w-1 h-48"
        style={{
          background: "rgba(0, 255, 255, 0.6)",
          left: "50%",
          bottom: "50%",
          transformOrigin: "bottom center",
          animation: "clock-hand-forward 1s linear infinite",
          boxShadow: "0 0 5px rgba(0, 255, 255, 0.4)",
        }}
      />

      {/* Center Dot */}
      <div
        className="absolute w-4 h-4 rounded-full"
        style={{
          background: "rgba(0, 255, 255, 0.8)",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: "0 0 10px rgba(0, 255, 255, 0.6)",
          animation: "clock-center-pulse 1s ease-in-out infinite",
        }}
      />
    </>
  );
};

export default ClockHands;