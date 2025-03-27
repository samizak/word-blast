import React from "react";

const ClockFace: React.FC = () => {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          border: "3px solid rgba(0, 255, 255, 0.4)",
          borderRadius: "50%",
          boxShadow: "inset 0 0 30px rgba(0, 255, 255, 0.3)",
        }}
      />

      {/* Clock Markers */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-4"
          style={{
            background: "rgba(0, 255, 255, 0.6)",
            left: "50%",
            top: "0",
            transformOrigin: "bottom center",
            transform: `translateX(-50%) rotate(${i * 30}deg)`,
          }}
        />
      ))}
    </>
  );
};

export default ClockFace;
