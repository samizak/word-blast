import React from "react";

const DigitalGrid: React.FC = () => {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `linear-gradient(0deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
        animation: "grid-pulse 2s linear infinite",
      }}
    />
  );
};

export default DigitalGrid;
