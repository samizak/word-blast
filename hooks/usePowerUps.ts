import { useState, useEffect, useCallback, RefObject } from "react";
import {
  PowerUp,
  PowerUpType,
  ActivePowerUp,
  POWER_UP_CONFIG,
} from "../types/PowerUp";

// Add a reset function to the hook
export function usePowerUps(
  gameState: string,
  containerRef: RefObject<HTMLDivElement>
) {
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [activePowerUps, setActivePowerUps] = useState<ActivePowerUp[]>([]);

  // Generate a power-up
  const generatePowerUp = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const { width, height } = container.getBoundingClientRect();

    // Favor slowTime power-up (70% chance for slowTime, 30% for shield)
    const randomValue = Math.random();
    const type: PowerUpType = randomValue < 0.5 ? "slowTime" : "shield";
    const config = POWER_UP_CONFIG[type];

    const powerUp: PowerUp = {
      id: Date.now(),
      type,
      word: config.word,
      x: Math.random() * (width - 100) + 50,
      y: -50, // Start above the screen
      speed: 2, // Increased speed
      isActive: false,
      duration: config.duration,
    };

    setPowerUps((prev) => [...prev, powerUp]);
  }, [containerRef]);

  // Update power-up positions
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

  // Activate a power-up
  const activatePowerUp = useCallback((powerUp: PowerUp) => {
    const now = Date.now();

    setActivePowerUps((prev) => {
      // Find existing power-up of the same type
      const existingPowerUp = prev.find((p) => p.type === powerUp.type);

      if (existingPowerUp) {
        // Add the new duration to the remaining time
        const remainingTime = Math.max(0, existingPowerUp.endTime - now);
        const newEndTime = now + remainingTime + powerUp.duration;

        // Replace the existing power-up with updated duration
        return prev.map((p) =>
          p.type === powerUp.type ? { ...p, endTime: newEndTime } : p
        );
      } else {
        // Add new power-up if none exists
        return [
          ...prev,
          { type: powerUp.type, endTime: now + powerUp.duration },
        ];
      }
    });

    // Remove the collected power-up
    setPowerUps((prev) => prev.filter((p) => p.id !== powerUp.id));
  }, []);

  // Check for expired power-ups
  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = setInterval(() => {
      const now = Date.now();
      setActivePowerUps((prev) =>
        prev.filter((powerUp) => powerUp.endTime > now)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState]);

  // Spawn power-ups periodically
  useEffect(() => {
    if (gameState !== "playing") return;

    const spawnInterval = setInterval(() => {
      // Spawn a power-up every 20 seconds
      generatePowerUp();
    }, 20000); // Changed to 20 seconds

    return () => clearInterval(spawnInterval);
  }, [gameState, generatePowerUp]);

  // Move power-ups
  useEffect(() => {
    if (gameState !== "playing") return;

    const moveInterval = setInterval(updatePowerUps, 50);
    return () => clearInterval(moveInterval);
  }, [gameState, updatePowerUps]);

  // Add a reset function
  const resetPowerUps = useCallback(() => {
    setPowerUps([]);
    setActivePowerUps([]);
  }, []);

  // Return the reset function
  return { powerUps, activePowerUps, activatePowerUp, resetPowerUps };
}
