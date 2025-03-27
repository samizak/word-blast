import React from 'react';
import StarBackground from '../common/StarBackground';

interface GameLayoutProps {
  children: React.ReactNode;
}

export default function GameLayout({ children }: GameLayoutProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <StarBackground />
      {children}
    </main>
  );
}