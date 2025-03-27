import React from "react";

const TimeFragments: React.FC = () => {
  return (
    <>
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            width: "2px",
            height: "10px",
            background: "rgba(0, 255, 255, 0.8)",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            boxShadow: "0 0 8px rgba(0, 255, 255, 0.8)",
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `fragment-float ${
              3 + Math.random() * 2
            }s linear infinite`,
          }}
        />
      ))}
    </>
  );
};

export default TimeFragments;
