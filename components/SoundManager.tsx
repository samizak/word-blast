"use client";

import { useEffect } from "react";
import { 
  playSound, 
  playLoopingSound, 
  stopLoopingSound, 
  updateLoopingSounds,
  cleanupSounds,
  SoundType
} from "../utils/soundUtils";

interface SoundManagerProps {
  isMuted?: boolean;
}

const SoundManager = ({ isMuted = false }: SoundManagerProps) => {
  useEffect(() => {
    // Set up global sound functions
    window.playSound = (soundType: string) => {
      playSound(soundType as SoundType, isMuted);
    };

    window.playLoopingSound = (soundType: string) => {
      playLoopingSound(soundType as SoundType, isMuted);
    };

    window.stopLoopingSound = (soundType: string) => {
      stopLoopingSound(soundType as SoundType);
    };

    // Clean up on unmount
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

      cleanupSounds();
    };
  }, [isMuted]);

  // Update looping sounds when mute state changes
  useEffect(() => {
    updateLoopingSounds(isMuted);
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
