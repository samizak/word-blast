"use client";

import React, { useState, useEffect, useId } from "react";

const StarBackground = () => {
  const id = useId();
  const [stars, setStars] = useState<
    Array<{ top: string; left: string; animationDelay: string }>
  >([]);

  // Generate stars on the client side only to avoid hydration mismatch
  useEffect(() => {
    const generatedStars = Array(100)
      .fill(null)
      .map(() => ({
        top: `${Math.random() * 100}vh`,
        left: `${Math.random() * 100}vw`,
        animationDelay: `${Math.random() * 10}s`,
      }));

    setStars(generatedStars);
  }, []);

  return (
    <div className="star-background">
      {stars.map((star, i) => (
        <span
          key={`${id}-star-${i}`}
          className="star"
          style={{
            top: star.top,
            left: star.left,
            animationDelay: star.animationDelay,
          }}
        ></span>
      ))}
      <style jsx>{`
        .star-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: -1;
        }

        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          animation: twinkle 5s infinite;
        }

        @keyframes twinkle {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default StarBackground;
