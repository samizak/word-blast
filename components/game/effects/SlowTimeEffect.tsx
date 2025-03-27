import React, { useEffect } from "react";
import DigitalGrid from "./slowtime/DigitalGrid";
import DigitalRain from "./slowtime/DigitalRain";
import TimeFragments from "./slowtime/TimeFragments";
import TimeClock from "./slowtime/TimeClock";

const SlowTimeEffect: React.FC = () => {
  useEffect(() => {
    const aliens = document.querySelectorAll(".word-alien");
    aliens.forEach((alien) => {
      alien.classList.add("slow-motion");
    });

    const stars = document.querySelectorAll(".star");
    stars.forEach((star) => {
      star.classList.add("slow-motion");
    });

    window.playSound?.("slowTime");

    return () => {
      aliens.forEach((alien) => {
        alien.classList.remove("slow-motion");
      });
      stars.forEach((star) => {
        star.classList.remove("slow-motion");
      });
    };
  }, []);

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{
        zIndex: 40,
        background: "rgba(0, 0, 0, 0.3)",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center"></div>
      <DigitalGrid />
      <DigitalRain />
      <TimeFragments />
      <TimeClock />
    </div>
  );
};

export default SlowTimeEffect;
