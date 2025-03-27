import React, { useEffect, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  rotation: number;
}

interface WordExplosionProps {
  x: number;
  y: number;
  word: string;
  onComplete?: () => void;
}

export default function WordExplosion({
  x,
  y,
  word,
  onComplete,
}: WordExplosionProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Create initial particles
    const numParticles = Math.min(word.length * 8, 40); // More particles for bigger words
    const colors = ["#ff0000", "#ff4400", "#ff8800", "#ffcc00", "#ff6600"]; // Red and orange colors
    const newParticles: Particle[] = [];

    // Letter particles
    word.split("").forEach((letter, index) => {
      const angle = (index / word.length) * Math.PI * 2;
      const speed = 3 + Math.random() * 4; // Faster initial speed
      newParticles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3, // Stronger upward boost
        size: 24 + Math.random() * 12, // Bigger particles
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        rotation: Math.random() * 360,
      });
    });

    // Additional spark particles
    for (let i = 0; i < numParticles; i++) {
      const angle = (i / numParticles) * Math.PI * 2 + Math.random() * 0.5;
      const speed = 2 + Math.random() * 5;
      newParticles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: 6 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        rotation: Math.random() * 360,
      });
    }

    setParticles(newParticles);

    // Animation loop
    let animationFrame: number;
    const startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;

      if (elapsed > 1000) {
        onComplete?.();
        return;
      }

      setParticles((prevParticles) =>
        prevParticles
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.15, // Stronger gravity
            alpha: particle.alpha * 0.97, // Slower fade
            rotation: particle.rotation + particle.vx * 3, // Faster rotation
          }))
          .filter((particle) => particle.alpha > 0.1)
      );

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [x, y, word, onComplete]);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      {particles.map((particle, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: "50%",
            opacity: particle.alpha,
            transform: `rotate(${particle.rotation}deg)`,
            boxShadow: `0 0 ${particle.size * 0.5}px ${particle.color}`,
            transition: "transform 0.1s linear",
          }}
        />
      ))}
    </div>
  );
}
