"use client";

import { useEffect, useRef } from "react";

interface SoundManagerProps {
  isMuted?: boolean;
}

const SoundManager = ({ isMuted = false }: SoundManagerProps) => {
  const soundUrls = useRef({
    laser: "/sounds/laser.mp3",
    explosion: "/sounds/explosion.mp3",
    levelUp: "/sounds/levelUp.mp3",
    gameOver: "/sounds/gameOver.mp3",
    countdown: "/sounds/countdown.mp3",
    go: "/sounds/go.mp3",
    atmosphere: "/sounds/atmosphere.mp3",
  });

  const loopingSounds = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    window.playSound = (soundType: string) => {
      if (isMuted) return;

      const soundUrl =
        soundUrls.current[soundType as keyof typeof soundUrls.current];

      if (soundUrl) {
        const sound = new Audio(soundUrl);
        sound.volume = 0.5;

        sound
          .play()
          .catch((e) => console.error(`Error playing ${soundType} sound:`, e))
          .finally(() => {
            sound.onended = () => {
              sound.remove();
            };
          });
      }
    };

    window.playLoopingSound = (soundType: string) => {
      if (isMuted) return;

      if (loopingSounds.current[soundType]) {
        loopingSounds.current[soundType].pause();
        loopingSounds.current[soundType].remove();
        delete loopingSounds.current[soundType];
      }

      const soundUrl =
        soundUrls.current[soundType as keyof typeof soundUrls.current];

      if (soundUrl) {
        const sound = new Audio(soundUrl);
        sound.volume = 0.3;
        sound.loop = true;

        loopingSounds.current[soundType] = sound;

        sound
          .play()
          .catch((e) =>
            console.error(`Error playing looping ${soundType} sound:`, e)
          );
      }
    };

    window.stopLoopingSound = (soundType: string) => {
      if (loopingSounds.current[soundType]) {
        loopingSounds.current[soundType].pause();
        loopingSounds.current[soundType].remove();
        delete loopingSounds.current[soundType];
      }
    };

    return () => {
      if ("playSound" in window) {
        window.playSound = undefined;
      }
      if ("playLoopingSound" in window) {
        window.playLoopingSound = undefined;
      }
      if ("stopLoopingSound" in window) {
        window.stopLoopingSound = undefined;
      }

      Object.keys(loopingSounds.current).forEach((soundType) => {
        loopingSounds.current[soundType].pause();
        loopingSounds.current[soundType].remove();
      });
      loopingSounds.current = {};
    };
  }, [isMuted]);

  useEffect(() => {
    Object.keys(loopingSounds.current).forEach((soundType) => {
      if (isMuted) {
        loopingSounds.current[soundType].pause();
      } else {
        loopingSounds.current[soundType]
          .play()
          .catch((e) => console.error(`Error resuming ${soundType} sound:`, e));
      }
    });
  }, [isMuted]);

  return null;
};

declare global {
  interface Window {
    playSound?: (soundType: string) => void;
    playLoopingSound?: (soundType: string) => void;
    stopLoopingSound?: (soundType: string) => void;
  }
}

export default SoundManager;
