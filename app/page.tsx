"use client";

import WordBlastGame from "../components/WordBlastGame";
import GameLayout from "../components/layout/GameLayout";

export default function Home() {
  return (
    <GameLayout>
      <WordBlastGame />
    </GameLayout>
  );
}
