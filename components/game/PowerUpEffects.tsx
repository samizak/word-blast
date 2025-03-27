import React from "react";
import { ActivePowerUp } from "../../types/PowerUp";
import ShieldEffect from "./effects/ShieldEffect";
import SlowTimeEffect from "./effects/SlowTimeEffect";

interface PowerUpEffectsProps {
  activePowerUps: ActivePowerUp[];
  playerPosition: { x: number; y: number };
}

const PowerUpEffects: React.FC<PowerUpEffectsProps> = ({
  activePowerUps,
  playerPosition,
}) => {
  const hasShield = activePowerUps.some((p) => p.type === "shield");
  const hasSlowTime = activePowerUps.some((p) => p.type === "slowTime");

  return (
    <>
      {hasShield && <ShieldEffect />}
      {hasSlowTime && <SlowTimeEffect />}
    </>
  );
};

export default PowerUpEffects;
