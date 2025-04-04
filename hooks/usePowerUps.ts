import { useState, useEffect, useCallback, RefObject } from "react";
import { PowerUp, PowerUpType, ActivePowerUp } from "../types/PowerUp";
import { POWER_UP_CONFIG } from "../utils/gameConfigUtils";

export function usePowerUps(
  gameState: string,
  containerRef: RefObject<HTMLDivElement | null>
) {
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [activePowerUps, setActivePowerUps] = useState<ActivePowerUp[]>([]);

  const generatePowerUp = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const { width } = container.getBoundingClientRect();

    const randomValue = Math.random();
    const type: PowerUpType = randomValue < 0.5 ? "slowTime" : "shield";
    const config = POWER_UP_CONFIG[type];

    const powerUp: PowerUp = {
      id: Date.now(),
      type,
      word: config.word,
      x: Math.random() * (width - 100) + 50,
      y: -50,
      speed: 2,
      isActive: false,
      duration: config.duration,
    };

    setPowerUps((prev) => [...prev, powerUp]);
  }, [containerRef]);

  const updatePowerUps = useCallback(() => {
    setPowerUps((prev) =>
      prev
        .map((powerUp) => ({
          ...powerUp,
          y: powerUp.y + powerUp.speed,
        }))
        .filter((powerUp) => powerUp.y < window.innerHeight)
    );
  }, []);

  const activatePowerUp = useCallback((powerUp: PowerUp) => {
    const now = Date.now();

    setActivePowerUps((prev) => {
      const existingPowerUp = prev.find((p) => p.type === powerUp.type);

      if (existingPowerUp) {
        const remainingTime = Math.max(0, existingPowerUp.endTime - now);
        const newEndTime = now + remainingTime + powerUp.duration;
        return prev.map((p) =>
          p.type === powerUp.type ? { ...p, endTime: newEndTime } : p
        );
      }

      return [...prev, { type: powerUp.type, endTime: now + powerUp.duration }];
    });

    setPowerUps((prev) => prev.filter((p) => p.id !== powerUp.id));
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;

    const powerUpCleaner = setInterval(() => {
      const now = Date.now();
      setActivePowerUps((prev) =>
        prev.filter((powerUp) => powerUp.endTime > now)
      );
    }, 1000);

    const spawnInterval = setInterval(
      generatePowerUp,
      POWER_UP_CONFIG.spawnInterval
    );
    const moveInterval = setInterval(updatePowerUps, 50);

    return () => {
      clearInterval(powerUpCleaner);
      clearInterval(spawnInterval);
      clearInterval(moveInterval);
    };
  }, [gameState, generatePowerUp, updatePowerUps]);

  const resetPowerUps = useCallback(() => {
    setPowerUps([]);
    setActivePowerUps([]);
  }, []);

  return { powerUps, activePowerUps, activatePowerUp, resetPowerUps };
}
