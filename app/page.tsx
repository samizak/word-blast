"use client";

import WordBlastGame from "../components/WordBlastGame";
import StarBackground from "../components/StarBackground";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <StarBackground />
      <h1 className="text-4xl font-bold mb-4 text-center">Word Blast</h1>
      <WordBlastGame />
    </main>
  );
}
