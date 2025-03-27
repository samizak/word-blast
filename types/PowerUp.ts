export type PowerUpType = 'shield' | 'slowTime';

export interface PowerUp {
  id: number;
  type: PowerUpType;
  word: string;
  x: number;
  y: number;
  speed: number;
  isActive: boolean;
  duration: number; // Duration in milliseconds
}

export interface ActivePowerUp {
  type: PowerUpType;
  endTime: number;
}

// Power-up configuration
export const POWER_UP_CONFIG = {
  shield: {
    duration: 10000, // 10 seconds
    word: 'SHIELD',
    color: '#00ffff', // Cyan
    probability: 0.1, // 10% chance to spawn
  },
  slowTime: {
    duration: 8000, // 8 seconds
    word: 'SLOW',
    color: '#9933ff', // Purple
    probability: 0.1,
    slowFactor: 0.5, // Reduces speed by 50%
  },
} 