"use client";

import { useEffect, useRef } from "react";

interface SoundManagerProps {
  isMuted?: boolean;
}

const SoundManager = ({ isMuted = false }: SoundManagerProps) => {
  // Add sound URLs
  const soundUrls = useRef({
    laser: "/sounds/laser.mp3",
    explosion: "/sounds/explosion.mp3",
    levelUp: "/sounds/levelUp.mp3",
    gameOver: "/sounds/gameOver.mp3",
    countdown: "/sounds/countdown.mp3",
    go: "/sounds/go.mp3",
    atmosphere: "/sounds/atmosphere.mp3", // Add atmosphere sound
  });

  // Keep track of looping sounds
  const loopingSounds = useRef<{ [key: string]: HTMLAudioElement }>({});

  // Effect for handling sound functions
  useEffect(() => {
    // Expose sound functions globally
    window.playSound = (soundType: string) => {
      if (isMuted) return;

      // Get the URL for the requested sound
      const soundUrl =
        soundUrls.current[soundType as keyof typeof soundUrls.current];

      if (soundUrl) {
        // Create a new Audio instance each time
        const sound = new Audio(soundUrl);
        sound.volume = 0.5;

        // Play the sound and handle cleanup
        sound
          .play()
          .catch((e) => console.error(`Error playing ${soundType} sound:`, e))
          .finally(() => {
            // Clean up the audio element after it's done playing
            sound.onended = () => {
              sound.remove();
            };
          });
      }
    };

    // Add a function to play looping sounds
    window.playLoopingSound = (soundType: string) => {
      if (isMuted) return;

      // Stop existing looping sound of this type if it exists
      if (loopingSounds.current[soundType]) {
        loopingSounds.current[soundType].pause();
        loopingSounds.current[soundType].remove();
        delete loopingSounds.current[soundType];
      }

      // Get the URL for the requested sound
      const soundUrl =
        soundUrls.current[soundType as keyof typeof soundUrls.current];

      if (soundUrl) {
        // Create a new Audio instance
        const sound = new Audio(soundUrl);
        sound.volume = 0.3; // Lower volume for background sounds
        sound.loop = true; // Enable looping

        // Store the sound for later reference
        loopingSounds.current[soundType] = sound;

        // Play the sound
        sound
          .play()
          .catch((e) =>
            console.error(`Error playing looping ${soundType} sound:`, e)
          );
      }
    };

    // Add a function to stop looping sounds
    window.stopLoopingSound = (soundType: string) => {
      if (loopingSounds.current[soundType]) {
        loopingSounds.current[soundType].pause();
        loopingSounds.current[soundType].remove();
        delete loopingSounds.current[soundType];
      }
    };

    // Cleanup
    return () => {
      if ("playSound" in window) {
        // @ts-ignore - Working around TypeScript limitation
        window.playSound = undefined;
      }
      if ("playLoopingSound" in window) {
        // @ts-ignore
        window.playLoopingSound = undefined;
      }
      if ("stopLoopingSound" in window) {
        // @ts-ignore
        window.stopLoopingSound = undefined;
      }

      // Stop and clean up all looping sounds
      Object.keys(loopingSounds.current).forEach((soundType) => {
        loopingSounds.current[soundType].pause();
        loopingSounds.current[soundType].remove();
      });
      loopingSounds.current = {};
    };
  }, [isMuted]);

  // Separate effect for handling mute state changes
  useEffect(() => {
    // Update all looping sounds when mute state changes
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

  return null; // This component doesn't render anything
};

// Add type definition for the global window object
declare global {
  interface Window {
    playSound?: (soundType: string) => void;
    playLoopingSound?: (soundType: string) => void;
    stopLoopingSound?: (soundType: string) => void;
  }
}

export default SoundManager;

// Add this to your sound definitions if it doesn't exist
const soundEffects = {
  laser: {
    src: "/sounds/laser.mp3",
    volume: 0.5,
  },
  explosion: {
    src: "/sounds/explosion.mp3",
    volume: 0.5,
  },
  levelUp: {
    src: "/sounds/levelUp.mp3",
    volume: 0.5,
  },
  gameOver: {
    src: "/sounds/gameOver.mp3",
    volume: 0.5,
  },
  countdown: {
    src: "/sounds/countdown.mp3",
    volume: 0.5,
  },
  go: {
    src: "/sounds/go.mp3",
    volume: 0.5,
  },
  atmosphere: {
    src: "/sounds/atmosphere.mp3",
    volume: 0.5,
  },
  slowTime: {
    src: "/sounds/slow-time.mp3", // Make sure this file exists
    volume: 0.5,
  },
};
