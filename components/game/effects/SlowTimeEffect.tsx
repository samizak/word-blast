import React from "react";
import DigitalGrid from "./slowtime/DigitalGrid";
import DigitalRain from "./slowtime/DigitalRain";
import TimeFragments from "./slowtime/TimeFragments";
import TimeClock from "./slowtime/TimeClock";

const SlowTimeEffect: React.FC = () => {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{
        zIndex: 40,
        background: "rgba(0, 0, 0, 0.1)",
      }}
    >
      <DigitalGrid />
      <DigitalRain />
      <TimeFragments />
      <TimeClock />
    </div>
  );
};

export default SlowTimeEffect;
