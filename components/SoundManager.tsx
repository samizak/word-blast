"use client";

import { useEffect, useRef } from 'react';

interface SoundManagerProps {
  isMuted?: boolean;
}

const SoundManager = ({ isMuted = false }: SoundManagerProps) => {
  // Add countdown sound back to the sound URLs
  const soundUrls = useRef({
    laser: '/sounds/laser.mp3',
    explosion: '/sounds/explosion.mp3',
    levelUp: '/sounds/levelup.mp3',
    gameOver: '/sounds/gameover.mp3',
    countdown: '/sounds/countdown.mp3'
  });

  useEffect(() => {
    // Expose sound functions globally
    window.playSound = (soundType: string) => {
      if (isMuted) return;
      
      // Get the URL for the requested sound
      const soundUrl = soundUrls.current[soundType as keyof typeof soundUrls.current];
      
      if (soundUrl) {
        // Create a new Audio instance each time
        const sound = new Audio(soundUrl);
        sound.volume = 0.5;
        
        // Play the sound and handle cleanup
        sound.play()
          .catch(e => console.error(`Error playing ${soundType} sound:`, e))
          .finally(() => {
            // Clean up the audio element after it's done playing
            sound.onended = () => {
              sound.remove();
            };
          });
      }
    };

    // Cleanup
    return () => {
      if ('playSound' in window) {
        // @ts-ignore - Working around TypeScript limitation
        window.playSound = undefined;
      }
    };
  }, [isMuted]);

  return null; // This component doesn't render anything
};

// Add type definition for the global window object
declare global {
  interface Window {
    playSound?: (soundType: string) => void;
  }
}

export default SoundManager;