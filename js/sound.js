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

  let muted = false;
  let atmosphereWanted = false;
  let atmosphere = null;

  function syncAtmosphere() {
    if (atmosphereWanted && !muted) {
      if (!atmosphere) {
        atmosphere = new Audio(SOUND_URLS.atmosphere);
        atmosphere.volume = 0.3;
        atmosphere.loop = true;
      }
      atmosphere.play().catch(() => {});
    } else if (atmosphere) {
      atmosphere.pause();
    }
  }

  /** Play a one-shot sound effect. */
  function play(type) {
    if (muted) return;
    const sound = new Audio(SOUND_URLS[type]);
    sound.volume = 0.5;
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

  WB.sound = { play, setAtmosphere, isMuted, setMuted };
})((window.WordBlast = window.WordBlast || {}));
