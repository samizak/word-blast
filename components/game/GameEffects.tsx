import Laser from "../Laser";
import Explosion from "../Explosion";
import { Effect } from "../../types/game";

interface GameEffectsProps {
  effects: Effect[];
}

export default function GameEffects({ effects }: GameEffectsProps) {
  return (
    <>
      {effects.map((effect) => {
        if (
          effect.type === "laser" &&
          effect.startX !== undefined &&
          effect.startY !== undefined &&
          effect.endX !== undefined &&
          effect.endY !== undefined
        ) {
          return (
            <Laser
              key={effect.id}
              startX={effect.startX}
              startY={effect.startY}
              endX={effect.endX}
              endY={effect.endY}
            />
          );
        } else if (
          effect.type === "explosion" &&
          effect.x !== undefined &&
          effect.y !== undefined
        ) {
          return <Explosion key={effect.id} x={effect.x} y={effect.y} />;
        }
        return null;
      })}
    </>
  );
}
