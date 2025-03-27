// Sound configuration
export const SOUND_URLS = {
  laser: "/sounds/laser.mp3",
  explosion: "/sounds/explosion.mp3",
  levelUp: "/sounds/levelUp.mp3",
  gameOver: "/sounds/gameOver.mp3",
  countdown: "/sounds/countdown.mp3",
  go: "/sounds/go.mp3",
  atmosphere: "/sounds/atmosphere.mp3",
};

export type SoundType = keyof typeof SOUND_URLS;

// Store active looping sounds
const loopingSounds: { [key: string]: HTMLAudioElement } = {};

/**
 * Play a one-time sound effect
 */
export function playSound(soundType: SoundType, isMuted: boolean = false): void {
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
}

/**
 * Play a looping sound (background music, etc.)
 */
export function playLoopingSound(soundType: SoundType, isMuted: boolean = false): void {
  if (isMuted) return;

  // Stop existing sound if it's already playing
  if (loopingSounds[soundType]) {
    loopingSounds[soundType].pause();
    loopingSounds[soundType].remove();
    delete loopingSounds[soundType];
  }

  const soundUrl = SOUND_URLS[soundType];
  if (soundUrl) {
    const sound = new Audio(soundUrl);
    sound.volume = 0.3;
    sound.loop = true;

    loopingSounds[soundType] = sound;

    sound
      .play()
      .catch((e) => console.error(`Error playing looping ${soundType} sound:`, e));
  }
}

/**
 * Stop a looping sound
 */
export function stopLoopingSound(soundType: SoundType): void {
  if (loopingSounds[soundType]) {
    loopingSounds[soundType].pause();
    loopingSounds[soundType].remove();
    delete loopingSounds[soundType];
  }
}

/**
 * Update all looping sounds based on mute state
 */
export function updateLoopingSounds(isMuted: boolean): void {
  Object.keys(loopingSounds).forEach((soundType) => {
    if (isMuted) {
      loopingSounds[soundType].pause();
    } else {
      loopingSounds[soundType]
        .play()
        .catch((e) => console.error(`Error resuming ${soundType} sound:`, e));
    }
  });
}

/**
 * Clean up all sounds (for component unmounting)
 */
export function cleanupSounds(): void {
  Object.keys(loopingSounds).forEach((soundType) => {
    loopingSounds[soundType].pause();
    loopingSounds[soundType].remove();
  });
  
  // Clear the looping sounds object
  Object.keys(loopingSounds).forEach(key => {
    delete loopingSounds[key];
  });
}