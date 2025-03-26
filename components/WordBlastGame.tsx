"use client";

import { useState, useEffect, useRef } from "react";
import WordAlien from "./WordAlien";
import Player from "./Player";
import Laser from "./Laser";
import Explosion from "./Explosion";
import wordLists from "../data/wordLists";

// Define types for the alien object
interface Alien {
  id: number;
  word: string;
  x: number;
  y: number;
  speed: number;
}

// Define types for visual effects
interface Effect {
  id: number;
  type: "laser" | "explosion";
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  x?: number;
  y?: number;
}

export default function WordBlastGame() {
  const [gameState, setGameState] = useState<
    "start" | "countdown" | "playing" | "gameOver"
  >("start");
  const [countdown, setCountdown] = useState<number>(3);
  const [level, setLevel] = useState(4);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [aliens, setAliens] = useState<Alien[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [gameSpeed, setGameSpeed] = useState(5000); // milliseconds between alien spawns
  const [effects, setEffects] = useState<Effect[]>([]);
  const gameContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const playerRef = useRef<HTMLDivElement | null>(null);

  // Start the game
  const startGame = () => {
    setGameState("countdown");
    setCountdown(3);
    setLevel(20);
    setScore(5000);
    setLives(3);
    setAliens([]);
    setCurrentInput("");
    setGameSpeed(5000);
    setEffects([]);
    setCountdown(3);
  };

  // Handle countdown
  useEffect(() => {
    if (gameState === "countdown") {
      if (countdown > 0) {
        // Decrement countdown every second
        const timer = setTimeout(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
      } else {
        // Countdown is 0, start the actual game
        setGameState("playing");
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }
  }, [gameState, countdown]);

  // Generate a new alien with a word
  const generateAlien = () => {
    if (gameState !== "playing") return;

    const currentWordList =
      wordLists[Math.min(level - 1, wordLists.length - 1)];

    // Get all words currently on screen (convert to lowercase for case-insensitive comparison)
    const activeWords = aliens.map((alien) => alien.word.toLowerCase());

    // Filter out words that are already on screen (case-insensitive)
    const availableWords = currentWordList.filter(
      (word) => !activeWords.includes(word.toLowerCase())
    );

    // If no words are available, return early
    if (availableWords.length === 0) {
      console.warn("No available words to spawn.");
      return;
    }

    // If all words are already on screen, wait for next cycle
    if (availableWords.length === 0) {
      console.log("All words from current list are on screen. Waiting...");
      return;
    }

    // Select a random word from available words
    const word =
      availableWords[Math.floor(Math.random() * availableWords.length)];

    // Get container width with a fallback value
    const containerWidth = gameContainerRef.current?.clientWidth || 800;

    // Calculate safe margins based on word length
    // Base planet size is 80, but we need to account for longer words
    const basePlanetSize = 80;
    const charWidth = 10; // Increased from 8 to 10 for more space per character
    const wordWidth = word.length * charWidth;
    const padding = 40; // Increased from 20 to 40 for more padding

    // Calculate the size needed to fit the word with padding
    const planetSize = Math.max(basePlanetSize, wordWidth + padding);

    // Increase the safe margin to prevent spawning too close to the edge
    // Use the full planet size as the margin to ensure it's completely visible
    const safeMargin = planetSize;

    // Ensure planets spawn within safe boundaries
    const minPosition = safeMargin;
    const maxPosition = containerWidth - safeMargin;

    // Generate position within safe boundaries
    const xPosition = Math.random() * (maxPosition - minPosition) + minPosition;

    const newAlien: Alien = {
      id: Date.now(),
      word,
      x: xPosition,
      y: 0,
      speed: 0.5 + level * 0.1, // Increase speed with level
    };

    setAliens((prev) => [...prev, newAlien]);
  };

  // Create visual effects (laser and explosion)
  const createEffects = (targetAlien: Alien) => {
    // Get player position
    const playerElement =
      playerRef.current?.querySelector<HTMLDivElement>(":scope > div");
    if (!playerElement) return;

    const gameRect = gameContainerRef.current?.getBoundingClientRect();
    const playerRect = playerElement.getBoundingClientRect();

    if (!gameRect) return;

    // Calculate player position relative to the game container
    const playerX = playerRect.left - gameRect.left + playerRect.width / 2;
    const playerY = gameRect.bottom - playerRect.height;

    // Calculate target position (center of the alien)
    if (!gameRect) return;

    const targetX = targetAlien.x + gameRect.left;
    const targetY = targetAlien.y + gameRect.top;

    console.log("Player position:", playerX, playerY);
    console.log("Target position:", targetX, targetY);

    // Create unique IDs for the effects
    const laserId = Date.now();
    const explosionId = laserId + 1;

    // Add laser effect
    setEffects((prev) => [
      ...prev,
      {
        id: laserId,
        type: "laser",
        startX: playerX,
        startY: playerY,
        endX: targetX,
        endY: targetY,
      },
    ]);

    // Add explosion effect after a short delay
    setTimeout(() => {
      setEffects((prev) => [
        ...prev,
        {
          id: explosionId,
          type: "explosion",
          x: targetX,
          y: targetY,
        },
      ]);
    }, 200);

    // Clean up effects after they're done
    setTimeout(() => {
      setEffects((prev) =>
        prev.filter(
          (effect) => effect.id !== laserId && effect.id !== explosionId
        )
      );
    }, 800);
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.toLowerCase();
    setCurrentInput(inputValue);

    // Check if input matches any alien's word
    aliens.forEach((alien) => {
      if (alien.word.toLowerCase() === inputValue) {
        // Create visual effects before removing the alien
        createEffects(alien);

        // Remove the alien and increase score
        setAliens((prev) => prev.filter((a) => a.id !== alien.id));

        // Calculate new score
        const wordPoints = alien.word.length * 10;
        const newScore = score + wordPoints;

        console.log(`Word destroyed: "${alien.word}" - Points: ${wordPoints}`);
        console.log(`Previous score: ${score}, New score: ${newScore}`);

        // Check if we're crossing a 250-point threshold
        const oldLevel = Math.floor(score / 250);
        const newLevel = Math.floor(newScore / 250);
        console.log(`Old level calc: ${oldLevel}, New level calc: ${newLevel}`);

        // Update score
        setScore(newScore);
        setCurrentInput("");

        // Level up when crossing 250-point thresholds
        if (newLevel > oldLevel) {
          console.log(`LEVEL UP TRIGGERED! New level: ${level + 1}`);
          setLevel((prev) => {
            console.log(`Level changing from ${prev} to ${prev + 1}`);
            return prev + 1;
          });
          setGameSpeed((prev) => {
            const newSpeed = Math.max(prev * 0.8, 1000);
            console.log(`Game speed changing from ${prev}ms to ${newSpeed}ms`);
            return newSpeed;
          });
        } else {
          console.log(`No level up: Level calc ${newLevel} not > ${oldLevel}`);
        }
      }
    });
  };

  // Update alien positions
  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = setInterval(() => {
      setAliens((prev) => {
        const updated = prev.map((alien) => ({
          ...alien,
          y: alien.y + alien.speed,
        }));

        // Check for aliens reaching the bottom
        const bottomAliens = updated.filter(
          (alien) =>
            alien.y > (gameContainerRef.current?.clientHeight || 600) - 100
        );
        if (bottomAliens.length > 0) {
          setLives((prev) => prev - bottomAliens.length);
          return updated.filter(
            (alien) =>
              alien.y <= (gameContainerRef.current?.clientHeight || 600) - 100
          );
        }

        return updated;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [gameState]);

  // Spawn new aliens
  useEffect(() => {
    if (gameState !== "playing") {
      return;
    }

    console.log(`Level changed to: ${level}, Game speed: ${gameSpeed}ms`);

    const spawnInterval = setInterval(generateAlien, gameSpeed);
    return () => clearInterval(spawnInterval);
  }, [gameState, gameSpeed, level]);

  // Check for game over
  useEffect(() => {
    if (lives <= 0) {
      setGameState("gameOver");
    }
  }, [lives]);

  // Focus input when game starts
  useEffect(() => {
    if (gameState === "playing" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);

  return (
    <div className="game-container" ref={gameContainerRef}>
      {gameState === "start" && (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-3xl mb-4">Word Blast</h2>
          <p className="mb-6 text-center max-w-md">
            Type the words on the falling aliens to destroy them before they
            reach the bottom!
          </p>
          <button
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            onClick={startGame}
          >
            Start Game
          </button>
        </div>
      )}

      {gameState === "countdown" && (
        <div className="countdown-overlay">
          <div className="countdown-number">
            {countdown === 0 ? "GO!" : countdown}
          </div>
        </div>
      )}

      {(gameState === "playing" || gameState === "countdown") && (
        <>
          <div className="game-stats">
            <div>Level: {level}</div>
            <div>Score: {score}</div>
            <div>Lives: {lives}</div>
          </div>

          {aliens.map((alien) => (
            <WordAlien
              key={alien.id}
              word={alien.word}
              x={alien.x}
              y={alien.y}
              currentInput={currentInput}
            />
          ))}

          {/* Render visual effects */}
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

          <div ref={playerRef}>
            <Player />
          </div>

          {gameState === "playing" && (
            <input
              ref={inputRef}
              type="text"
              className="input-area"
              value={currentInput}
              onChange={handleInputChange}
              placeholder="Type words here"
              autoFocus
            />
          )}
        </>
      )}

      {gameState === "gameOver" && (
        <div className="game-over">
          <div>Game Over</div>
          <div className="text-2xl mt-4">Level: {level}</div>
          <div className="text-2xl mt-4">Final Score: {score}</div>
          <button
            className="mt-8 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            onClick={startGame}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
