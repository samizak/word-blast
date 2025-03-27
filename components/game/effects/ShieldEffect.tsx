import React from "react";

const ShieldEffect: React.FC = () => {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        position: "fixed",
        left: "50%",
        bottom: "80px",
        width: "180px",
        height: "140px",
        marginLeft: "-90px",
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
            "0 0 40px rgba(0, 255, 255, 0.6), inset 0 0 40px rgba(0, 255, 255, 0.6)",
        }}
      />
      {/* Outer Shield Ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: "3px solid rgba(0, 255, 255, 0.5)",
          animation: "shield-rotate 4s linear infinite",
          boxShadow: "0 0 30px rgba(0, 255, 255, 0.5)",
        }}
      >
        {/* Shield Particles */}
        <div
          className="absolute w-4 h-4 rounded-full"
          style={{
            background: "rgba(0, 255, 255, 0.8)",
            boxShadow: "0 0 15px rgba(0, 255, 255, 0.8)",
            animation: "shield-particle 2s linear infinite",
          }}
        />
      </div>
    </div>
  );
};

export default ShieldEffect;