import { useState, useEffect, useCallback, RefObject } from 'react';
import { PowerUp, PowerUpType, ActivePowerUp, POWER_UP_CONFIG } from '../types/PowerUp';

export function usePowerUps(gameState: string, containerRef: RefObject<HTMLDivElement>) {
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [activePowerUps, setActivePowerUps] = useState<ActivePowerUp[]>([]);

  // Generate a power-up
  const generatePowerUp = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const { width, height } = container.getBoundingClientRect();

    // Randomly choose between shield and slowTime
    const powerUpTypes: PowerUpType[] = ['shield', 'slowTime'];
    const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
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

    setPowerUps(prev => [...prev, powerUp]);
  }, [containerRef]);

  // Update power-up positions
  const updatePowerUps = useCallback(() => {
    setPowerUps(prev => prev.map(powerUp => ({
      ...powerUp,
      y: powerUp.y + powerUp.speed,
    })).filter(powerUp => powerUp.y < window.innerHeight));
  }, []);

  // Activate a power-up
  const activatePowerUp = useCallback((powerUp: PowerUp) => {
    const now = Date.now();
    
    setActivePowerUps(prev => {
      // Find existing power-up of the same type
      const existingPowerUp = prev.find(p => p.type === powerUp.type);
      
      if (existingPowerUp) {
        // Add the new duration to the remaining time
        const remainingTime = Math.max(0, existingPowerUp.endTime - now);
        const newEndTime = now + remainingTime + powerUp.duration;
        
        // Replace the existing power-up with updated duration
        return prev.map(p => 
          p.type === powerUp.type 
            ? { ...p, endTime: newEndTime }
            : p
        );
      } else {
        // Add new power-up if none exists
        return [...prev, { type: powerUp.type, endTime: now + powerUp.duration }];
      }
    });

    // Remove the collected power-up
    setPowerUps(prev => prev.filter(p => p.id !== powerUp.id));
  }, []);

  // Check for expired power-ups
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      const now = Date.now();
      setActivePowerUps(prev => prev.filter(powerUp => powerUp.endTime > now));
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState]);

  // Spawn power-ups periodically
  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawnInterval = setInterval(() => {
      // Debug mode: spawn a power-up every second
      generatePowerUp();
    }, 1000);

    return () => clearInterval(spawnInterval);
  }, [gameState, generatePowerUp]);

  // Move power-ups
  useEffect(() => {
    if (gameState !== 'playing') return;

    const moveInterval = setInterval(updatePowerUps, 50);
    return () => clearInterval(moveInterval);
  }, [gameState, updatePowerUps]);

  return {
    powerUps,
    activePowerUps,
    activatePowerUp,
  };
} 