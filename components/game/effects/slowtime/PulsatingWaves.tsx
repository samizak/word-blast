import React from "react";

const PulsatingWaves: React.FC = () => {
  return (
    <>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            width: "300px",
            height: "300px",
            left: "-70px",
            top: "-70px",
            border: "2px solid rgba(0, 255, 255, 0.4)",
            borderRadius: "50%",
            animation: `slow-wave ${2 + i * 0.5}s ease-out infinite`,
            animationDelay: `${i * 0.5}s`,
            boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)",
            transformOrigin: "center center",
          }}
        />
      ))}
    </>
  );
};

export default PulsatingWaves;
