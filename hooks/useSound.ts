import { useCallback, useEffect, useRef } from 'react';
import { SOUND_URLS, SoundType } from '../utils/soundUtils';

interface UseSoundOptions {
  isMuted?: boolean;
}

export function useSound({ isMuted = false }: UseSoundOptions = {}) {
  const loopingSounds = useRef<{ [key: string]: HTMLAudioElement }>({});

  // Play a one-time sound effect
  const playSound = useCallback(
    (soundType: SoundType) => {
      if (isMuted) return;

      const soundUrl = SOUND_URLS[soundType];
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
    },
    [isMuted]
  );

  // Play a looping sound (background music, etc.)
  const playLoopingSound = useCallback(
    (soundType: SoundType) => {
      if (isMuted) return;

      if (loopingSounds.current[soundType]) {
        loopingSounds.current[soundType].pause();
        loopingSounds.current[soundType].remove();
        delete loopingSounds.current[soundType];
      }

      const soundUrl = SOUND_URLS[soundType];
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
    },
    [isMuted]
  );

  // Stop a looping sound
  const stopLoopingSound = useCallback((soundType: SoundType) => {
    if (loopingSounds.current[soundType]) {
      loopingSounds.current[soundType].pause();
      loopingSounds.current[soundType].remove();
      delete loopingSounds.current[soundType];
    }
  }, []);

  // Update all looping sounds based on mute state
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

  // Clean up all sounds when the component unmounts
  useEffect(() => {
    return () => {
      Object.keys(loopingSounds.current).forEach((soundType) => {
        loopingSounds.current[soundType].pause();
        loopingSounds.current[soundType].remove();
      });
      loopingSounds.current = {};
    };
  }, []);

  return {
    playSound,
    playLoopingSound,
    stopLoopingSound,
  };
}