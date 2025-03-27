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
