(function (WB) {
  "use strict";

  const SOUND_URLS = {
    laser: "sounds/laser.mp3",
    explosion: "sounds/explosion.mp3",
    levelUp: "sounds/levelup.mp3",
    gameOver: "sounds/gameover.mp3",
    countdown: "sounds/countdown.mp3",
    atmosphere: "sounds/atmosphere.mp3",
  };

  // Short effects generated with Web Audio, so they need no sound files.
  // Each note: frequency (Hz), start offset and duration (seconds).
  const SYNTH_SOUNDS = {
    typo: { wave: "square", gain: 0.12, notes: [[150, 0, 0.09]] },
    hit: { wave: "sawtooth", gain: 0.12, notes: [[320, 0, 0.06], [240, 0.05, 0.08]] },
    powerUp: {
      wave: "triangle",
      gain: 0.22,
      notes: [[523, 0, 0.08], [659, 0.08, 0.08], [784, 0.16, 0.16]],
    },
    combo: { wave: "triangle", gain: 0.18, notes: [[880, 0, 0.06], [1175, 0.06, 0.12]] },
    warning: {
      wave: "sawtooth",
      gain: 0.14,
      notes: [[220, 0, 0.25], [220, 0.4, 0.25], [220, 0.8, 0.25]],
    },
  };

  let muted = false;
  let volume = 0.8;
  let atmosphereWanted = false;
  let atmosphere = null;
  let audioContext = null;

  function syncAtmosphere() {
    if (atmosphereWanted && !muted && volume > 0) {
      if (!atmosphere) {
        atmosphere = new Audio(SOUND_URLS.atmosphere);
        atmosphere.loop = true;
      }
      atmosphere.volume = 0.3 * volume;
      atmosphere.play().catch(() => {});
    } else if (atmosphere) {
      atmosphere.pause();
    }
  }

  function playSynth({ wave, gain, notes }) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    audioContext = audioContext || new AudioContextClass();
    if (audioContext.state === "suspended") audioContext.resume();

    const now = audioContext.currentTime;
    for (const [frequency, offset, duration] of notes) {
      const oscillator = audioContext.createOscillator();
      const envelope = audioContext.createGain();
      oscillator.type = wave;
      oscillator.frequency.value = frequency;
      envelope.gain.setValueAtTime(gain * volume, now + offset);
      envelope.gain.exponentialRampToValueAtTime(
        0.0001,
        now + offset + duration
      );
      oscillator.connect(envelope).connect(audioContext.destination);
      oscillator.start(now + offset);
      oscillator.stop(now + offset + duration);
    }
  }

  /** Play a one-shot sound effect. */
  function play(type) {
    if (muted || volume <= 0) return;
    if (SYNTH_SOUNDS[type]) {
      playSynth(SYNTH_SOUNDS[type]);
      return;
    }
    const sound = new Audio(SOUND_URLS[type]);
    sound.volume = 0.5 * volume;
    sound.play().catch(() => {});
  }

  /** Turn the looping background atmosphere on or off. */
  function setAtmosphere(on) {
    atmosphereWanted = on;
    syncAtmosphere();
  }

  function isMuted() {
    return muted;
  }

  function setMuted(value) {
    muted = value;
    syncAtmosphere();
  }

  function setVolume(value) {
    volume = Math.max(0, Math.min(1, value));
    syncAtmosphere();
  }

  WB.sound = { play, setAtmosphere, isMuted, setMuted, setVolume };
})((window.WordBlast = window.WordBlast || {}));
