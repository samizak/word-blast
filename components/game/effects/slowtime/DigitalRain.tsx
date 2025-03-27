import React from "react";

const DigitalRain: React.FC = () => {
  return (
    <>
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute text-cyan-400 font-mono text-lg"
          style={{
            left: `${Math.random() * 100}%`,
            top: "100%",
            opacity: 0.6,
            animation: `digital-rain ${
              2 + Math.random() * 2
            }s linear infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        >
          {Math.random().toString(16).substr(2, 1)}
        </div>
      ))}
    </>
  );
};

export default DigitalRain;