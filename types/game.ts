export interface Alien {
  id: number;
  word: string;
  x: number;
  y: number;
  speed: number;
}

export interface Effect {
  id: string;
  type: "laser" | "explosion";
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  x?: number;
  y?: number;
}

export type GameState = "start" | "countdown" | "playing" | "gameOver"; 