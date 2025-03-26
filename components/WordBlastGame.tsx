"use client";

import { useState, useEffect, useRef } from "react";
import SoundManager from "./SoundManager";
import StartScreen from "./game/StartScreen";
import Countdown from "./game/Countdown";
import GamePlayArea from "./game/GamePlayArea";
import GameOver from "./game/GameOver";
import MuteButton from "./game/MuteButton";
import wordLists from "../data/wordLists";
import { Alien, Effect, GameState } from "../types/game";
import { useGameSound } from "../hooks/useGameSound";

export default function WordBlastGame() {
  const [gameState, setGameState] = useState<GameState>("start");
  const [countdown, setCountdown] = useState<number>(3);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [aliens, setAliens] = useState<Alien[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [gameSpeed, setGameSpeed] = useState(2000);
  const [effects, setEffects] = useState<Effect[]>([]);
  const gameContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const playerRef = useRef<HTMLDivElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const canPlayCountdownSound = useRef(true);
  const { playSound, playLoopingSound } = useGameSound(isMuted, gameState);

  // Start the game
  const startGame = () => {
    setGameState("countdown");
    setCountdown(3);
    setLevel(1);
    setScore(0);
    setLives(3);
    setAliens([]);
    setCurrentInput("");
    setGameSpeed(2000);
    setEffects([]);
    setCountdown(3);
  };

  // Handle countdown
  useEffect(() => {
    if (gameState === "countdown") {
      if (countdown > 0) {
        if (canPlayCountdownSound.current) {
          playSound("countdown");
          canPlayCountdownSound.current = false;
        }

        const timer = setTimeout(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
      } else {
        playSound("levelUp");
        playLoopingSound("atmosphere");

        const startGameTimer = setTimeout(() => {
          setGameState("playing");
          generateAlien();
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 800);

        return () => clearTimeout(startGameTimer);
      }
    }
  }, [gameState, countdown, playSound, playLoopingSound]);

  // Generate a new alien with a word
  const generateAlien = () => {
    if (gameState !== "playing") return;

    const currentWordList =
      wordLists[Math.min(level - 1, wordLists.length - 1)];

    const activeWords = aliens.map((alien) => alien.word.toLowerCase());
    const availableWords = currentWordList.filter(
      (word) => !activeWords.includes(word.toLowerCase())
    );

    if (availableWords.length === 0) {
      console.warn("No available words to spawn.");
      return;
    }

    const word =
      availableWords[Math.floor(Math.random() * availableWords.length)];

    const containerWidth = gameContainerRef.current?.clientWidth || 800;
    const basePlanetSize = 80;
    const charWidth = 10;
    const wordWidth = word.length * charWidth;
    const padding = 40;
    const planetSize = Math.max(basePlanetSize, wordWidth + padding);
    const safeMargin = planetSize;
    const minPosition = safeMargin;
    const maxPosition = containerWidth - safeMargin;
    const xPosition = Math.random() * (maxPosition - minPosition) + minPosition;

    const newAlien: Alien = {
      id: Date.now(),
      word,
      x: xPosition,
      y: 0,
      speed: 0.5 + level * 0.1,
    };

    setAliens((prev) => [...prev, newAlien]);
  };

  // Create visual effects
  const createEffects = (targetAlien: Alien) => {
    const playerElement =
      playerRef.current?.querySelector<HTMLDivElement>(":scope > div");
    if (!playerElement) return;

    const gameRect = gameContainerRef.current?.getBoundingClientRect();
    const playerRect = playerElement.getBoundingClientRect();

    if (!gameRect) return;

    const playerX = playerRect.left - gameRect.left + playerRect.width / 2;
    const playerY = gameRect.bottom - playerRect.height;
    const targetX = targetAlien.x + gameRect.left;
    const targetY = targetAlien.y + gameRect.top;

    const laserId = `laser-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const explosionId = `explosion-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    playSound("laser");

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

    setTimeout(() => {
      playSound("explosion");

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

    aliens.forEach((alien) => {
      if (alien.word.toLowerCase() === inputValue) {
        createEffects(alien);
        setAliens((prev) => prev.filter((a) => a.id !== alien.id));

        const wordPoints = alien.word.length * 10;
        const newScore = score + wordPoints;

        const oldLevel = Math.floor(score / 250);
        const newLevel = Math.floor(newScore / 250);

        setScore(newScore);
        setCurrentInput("");

        if (newLevel > oldLevel) {
          playSound("levelUp");
          setLevel((prev) => prev + 1);
          setGameSpeed((prev) => Math.max(prev * 0.8, 1000));
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

    const adjustedGameSpeed = Math.max(gameSpeed + level * 100, 500);
    const spawnInterval = setInterval(generateAlien, adjustedGameSpeed);
    return () => clearInterval(spawnInterval);
  }, [gameState, gameSpeed, level]);

  // Check for game over
  useEffect(() => {
    if (lives <= 0) {
      setGameState("gameOver");
      playSound("gameOver");
    }
  }, [lives, playSound]);

  // Focus input when game starts
  useEffect(() => {
    if (gameState === "playing" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);

  // Handle mute functionality
  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <div className="game-container" ref={gameContainerRef}>
      <SoundManager isMuted={isMuted} />
      <MuteButton isMuted={isMuted} onToggleMute={toggleMute} />

      {gameState === "start" && <StartScreen onStartGame={startGame} />}
      {gameState === "countdown" && <Countdown countdown={countdown} />}

      {(gameState === "playing" || gameState === "countdown") && (
        <GamePlayArea
          aliens={aliens}
          currentInput={currentInput}
          onInputChange={handleInputChange}
          inputRef={inputRef}
          playerRef={playerRef}
          effects={effects}
          level={level}
          score={score}
          lives={lives}
        />
      )}

      {gameState === "gameOver" && (
        <GameOver level={level} score={score} onPlayAgain={startGame} />
      )}
    </div>
  );
}
