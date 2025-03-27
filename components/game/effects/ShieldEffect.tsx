import React from "react";

const ShieldEffect: React.FC = () => {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        position: "fixed",
        left: "50%",
        bottom: "20px",
        width: "240px",
        height: "200px",
        marginLeft: "-120px",
        zIndex: 50,
      }}
    >
      {/* Inner Shield Ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: "4px solid rgba(0, 255, 255, 0.8)",
          animation: "shield-pulse 2s infinite",
          boxShadow:
            "0 0 50px rgba(0, 255, 255, 0.6), inset 0 0 50px rgba(0, 255, 255, 0.6)", // Increased glow
        }}
      />
      {/* Outer Shield Ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: "3px solid rgba(0, 255, 255, 0.5)",
          animation: "shield-rotate 4s linear infinite",
          boxShadow: "0 0 40px rgba(0, 255, 255, 0.5)", // Increased glow
        }}
      >
        {/* Shield Particles */}
        <div
          className="absolute w-5 h-5 rounded-full" // Slightly larger particles
          style={{
            background: "rgba(0, 255, 255, 0.8)",
            boxShadow: "0 0 20px rgba(0, 255, 255, 0.8)", // Increased glow
            animation: "shield-particle 2s linear infinite",
          }}
        />
      </div>
    </div>
  );
};

export default ShieldEffect;
