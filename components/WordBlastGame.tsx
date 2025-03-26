"use client";

import { useState, useEffect, useRef } from "react";
import WordAlien from "./WordAlien";
import Player from "./Player";
import wordLists from "../data/wordLists";

// Define types for the alien object
interface Alien {
  id: number;
  word: string;
  x: number;
  y: number;
  speed: number;
}

export default function WordBlastGame() {
  const [gameState, setGameState] = useState<"start" | "playing" | "gameOver">(
    "start"
  );
  const [level, setLevel] = useState(4);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [aliens, setAliens] = useState<Alien[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [gameSpeed, setGameSpeed] = useState(5000); // milliseconds between alien spawns
  const gameContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Start the game
  const startGame = () => {
    setGameState("playing");
    setLevel(20);
    setScore(5000);
    setLives(3);
    setAliens([]);
    setCurrentInput("");
    setGameSpeed(5000);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Generate a new alien with a word
  const generateAlien = () => {
    if (gameState !== "playing") return;

    const currentWordList =
      wordLists[Math.min(level - 1, wordLists.length - 1)];
    
    // Get all words currently on screen
    const activeWords = aliens.map(alien => alien.word);
    
    // Filter out words that are already on screen
    const availableWords = currentWordList.filter(word => !activeWords.includes(word));
    
    // If all words are already on screen, wait for next cycle
    if (availableWords.length === 0) {
      console.log("All words from current list are on screen. Waiting...");
      return;
    }
    
    // Select a random word from available words
    const word = availableWords[Math.floor(Math.random() * availableWords.length)];

    // Get container width with a fallback value
    const containerWidth = gameContainerRef.current?.clientWidth || 800;

    // Calculate safe margins based on word length
    // Base planet size is 80, but we need to account for longer words
    const basePlanetSize = 80;
    const charWidth = 8; // Approximate width of each character in pixels
    const wordWidth = word.length * charWidth;
    const padding = 20; // Extra padding around the text
    
    // Calculate the size needed to fit the word with padding
    const planetSize = Math.max(basePlanetSize, wordWidth + padding);
    
    // Use the larger of the calculated planet size or a fixed margin
    const safeMargin = Math.max(planetSize / 2, 50);

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

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);

    // Check if input matches any alien's word
    aliens.forEach((alien) => {
      if (alien.word.toLowerCase() === e.target.value.toLowerCase()) {
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
    if (gameState !== "playing") return;

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

      {gameState === "playing" && (
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
            />
          ))}

          <Player />

          <input
            ref={inputRef}
            type="text"
            className="input-area"
            value={currentInput}
            onChange={handleInputChange}
            placeholder="Type words here"
            autoFocus
          />
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
