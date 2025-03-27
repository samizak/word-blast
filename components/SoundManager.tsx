"use client";

import { useEffect } from "react";
import { useSound } from "../hooks/useSound";
import { SoundType } from "../utils/soundUtils";

interface SoundManagerProps {
  isMuted?: boolean;
}

const SoundManager = ({ isMuted = false }: SoundManagerProps) => {
  const { playSound, playLoopingSound, stopLoopingSound } = useSound({
    isMuted,
  });

  useEffect(() => {
    window.playSound = (soundType: string) => {
      playSound(soundType as SoundType);
    };

    window.playLoopingSound = (soundType: string) => {
      playLoopingSound(soundType as SoundType);
    };

    window.stopLoopingSound = (soundType: string) => {
      stopLoopingSound(soundType as SoundType);
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
    };
  }, [playSound, playLoopingSound, stopLoopingSound]);

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
