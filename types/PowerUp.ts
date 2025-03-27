export type PowerUpType = "shield" | "slowTime";

export interface PowerUp {
  id: number;
  type: PowerUpType;
  word: string;
  x: number;
  y: number;
  speed: number;
  isActive: boolean;
  duration: number;
}

export interface ActivePowerUp {
  type: PowerUpType;
  endTime: number;
}

export const POWER_UP_CONFIG = {
  shield: {
    duration: 10000,
    word: "SHIELD",
    color: "#00ffff",
    probability: 0.1,
  },
  slowTime: {
    duration: 8000,
    word: "SLOW",
    color: "#9933ff",
    probability: 0.1,
    slowFactor: 0.1,
  },
  spawnInterval: 15000, // Added spawnInterval property (milliseconds)
};
