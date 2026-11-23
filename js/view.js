(function (WB) {
  "use strict";

  // DOM builders for everything the game draws. No game rules live here.

  const { POWER_UP_CONFIG, DIFFICULTIES } = WB;

  const icon = (body) =>
    `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

  const SPEAKER =
    '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/>';

  const ICONS = {
    volumeOn: icon(
      `${SPEAKER}<path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/>`
    ),
    volumeOff: icon(
      `${SPEAKER}<line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/>`
    ),
    pause: icon(
      '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>'
    ),
    play: icon('<polygon points="6 3 20 12 6 21 6 3"/>'),
  };

  const HEART_PATH =
    "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

  const rand = (min, max) => min + Math.random() * (max - min);

  function el(className, parent, tag = "div") {
    const node = document.createElement(tag);
    node.className = className;
    parent?.appendChild(node);
    return node;
  }

  /** Fill a container with one span per letter and return the spans. */
  function buildLetters(container, word) {
    const letters = [...word].map((letter) => {
      const span = document.createElement("span");
      span.textContent = letter;
      return span;
    });
    container.replaceChildren(...letters);
    return letters;
  }

  /** Turn the first `count` letters green. */
  function highlightLetters(letters, count) {
    letters.forEach((span, i) => span.classList.toggle("hit", i < count));
  }

  /* ---------- Background ---------- */

  function createStars(container, count = 100) {
    for (let i = 0; i < count; i++) {
      const star = el("star", container, "span");
      star.style.top = `${rand(0, 100)}%`;
      star.style.left = `${rand(0, 100)}%`;
      star.style.animationDelay = `${rand(0, 10)}s`;
    }
  }

  /* ---------- Stats ---------- */

  function renderHearts(container, lives, total) {
    if (!Number.isFinite(lives)) {
      container.textContent = "∞";
      return;
    }
    let html = "";
    for (let i = 0; i < Math.max(total, lives); i++) {
      html += `<svg class="heart${
        i < lives ? " filled" : ""
      }" width="24" height="24" viewBox="0 0 24 24"><path d="${HEART_PATH}"/></svg>`;
    }
    container.innerHTML = html;
  }

  /* ---------- Aliens ---------- */

  const PLANET_TYPES = ["rocky", "gas", "ice", "lava", "earth", "ringed"];

  const PLANET_COLORS = {
    rocky: { main: "#A67C52", accent: "#8B5A2B", highlight: "#D2B48C" },
    gas: { main: "#E6B422", accent: "#CD853F", highlight: "#FFD700" },
    ice: { main: "#ADD8E6", accent: "#87CEEB", highlight: "#E0FFFF" },
    lava: { main: "#8B0000", accent: "#FF4500", highlight: "#FF6347" },
    earth: { main: "#4682B4", accent: "#228B22", highlight: "#87CEEB" },
    ringed: { main: "#DEB887", accent: "#D2B48C", highlight: "#F5DEB3" },
  };

  /** Planets grow with their longest word so the text always fits. */
  function planetSizeFor(words, kind) {
    const longest = Math.max(...words.map((word) => word.length));
    return kind === "fast" || kind === "mini"
      ? Math.max(64, longest * 11 + 40)
      : Math.max(80, longest * 12 + 48);
  }

  function planetPattern(type, r) {
    if (type === "boss") {
      const dot = (x, y, size) =>
        `<circle cx="${r * x}" cy="${r * y}" r="${
          r * size
        }" fill="#12021c" opacity="0.7"/>`;
      return (
        `<circle cx="${r}" cy="${r}" r="${r * 0.96}" fill="#3a0d4f" stroke="#ff3c9e" stroke-width="${
          r * 0.04
        }"/>` +
        dot(0.55, 0.6, 0.16) +
        dot(1.45, 0.7, 0.12) +
        dot(0.7, 1.45, 0.14) +
        dot(1.4, 1.4, 0.2) +
        `<ellipse cx="${r}" cy="${r}" rx="${r * 0.96}" ry="${
          r * 0.22
        }" fill="none" stroke="#ff3c9e" stroke-width="${
          r * 0.03
        }" opacity="0.6"/>`
      );
    }

    const c = PLANET_COLORS[type];
    const base = `<circle cx="${r}" cy="${r}" r="${r}" fill="${c.main}"/>`;
    const dot = (x, y, size, fill) =>
      `<circle cx="${r * x}" cy="${r * y}" r="${r * size}" fill="${fill}"/>`;

    switch (type) {
      case "rocky":
        return (
          base +
          dot(0.7, 0.7, 0.1, c.accent) +
          dot(1.3, 0.8, 0.15, c.accent) +
          dot(0.5, 1.2, 0.12, c.accent)
        );
      case "gas":
        return (
          base +
          [0.7, 1.3]
            .map(
              (y) =>
                `<ellipse cx="${r}" cy="${r * y}" rx="${r * 0.9}" ry="${
                  r * 0.2
                }" fill="${c.accent}" opacity="0.7"/>`
            )
            .join("")
        );
      case "ice":
        return (
          base +
          dot(0.6, 0.6, 0.2, c.highlight) +
          dot(1.2, 1.2, 0.15, c.highlight) +
          dot(1.3, 0.7, 0.1, c.highlight)
        );
      case "lava":
        return (
          base +
          `<path d="M ${r * 0.5},${r * 0.8} Q ${r},${r * 0.3} ${r * 1.5},${
            r * 0.8
          }" stroke="${c.accent}" stroke-width="4" fill="none"/>` +
          `<path d="M ${r * 0.5},${r * 1.2} Q ${r},${r * 1.7} ${r * 1.5},${
            r * 1.2
          }" stroke="${c.accent}" stroke-width="4" fill="none"/>`
        );
      case "earth":
        return (
          base +
          `<path d="M ${r * 0.3},${r * 0.7} Q ${r * 0.8},${r * 0.5} ${
            r * 1.2
          },${r * 0.6} T ${r * 1.7},${r * 0.7}" stroke="${
            c.accent
          }" stroke-width="5" fill="none"/>` +
          `<path d="M ${r * 0.3},${r * 1.3} Q ${r * 0.8},${r * 1.5} ${
            r * 1.2
          },${r * 1.4} T ${r * 1.7},${r * 1.3}" stroke="${
            c.accent
          }" stroke-width="5" fill="none"/>`
        );
      case "ringed":
        return (
          `<circle cx="${r}" cy="${r}" r="${r * 0.8}" fill="${c.main}"/>` +
          `<ellipse cx="${r}" cy="${r}" rx="${r}" ry="${
            r * 0.3
          }" fill="none" stroke="${c.accent}" stroke-width="3"/>`
        );
      default:
        return base;
    }
  }

  /**
   * Build the element for one alien planet.
   * `words` is every word it will show, in order; `size` overrides the
   * computed diameter (used for bosses).
   */
  function createAlienView({ kind, words, size: fixedSize }) {
    const isBoss = kind === "boss";
    const size = fixedSize ?? planetSizeFor(words, kind);
    const type = isBoss
      ? "boss"
      : PLANET_TYPES[words[0].charCodeAt(0) % PLANET_TYPES.length];

    const root = el(`word-alien ${kind}`);
    let bossBarFill = null;
    if (isBoss) bossBarFill = el("boss-bar-fill", el("boss-bar", root));

    const planet = el("planet-container", root);
    planet.style.width = planet.style.height = `${size}px`;
    planet.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${planetPattern(
      type,
      size / 2
    )}</svg>`;
    el("planet-ring", planet);

    const background = el("planet-word-background", planet);
    background.style.maxWidth = `${size * 1.1}px`;
    const wordEl = el("planet-word", background);

    let phraseWords = [];
    if (isBoss) {
      const phrase = el("boss-phrase", root);
      phrase.style.width = `${size * 1.6}px`;
      phrase.style.marginLeft = `${-size * 0.3}px`;
      phraseWords = words.map((word) => {
        const span = el("", phrase, "span");
        span.textContent = word;
        return span;
      });
    }

    const view = { root, size, letters: [] };

    /** Show the word at `index` in the planet's queue. */
    view.showWord = (index) => {
      const word = words[index];
      const fontSize = isBoss
        ? Math.min(26, (size / word.length) * 1.5)
        : Math.max(
            12,
            Math.min(
              20,
              (size / word.length) *
                Math.min(1.8, 4 / (word.length * 0.15 + 1))
            )
          );
      wordEl.style.fontSize = `${fontSize}px`;
      view.letters = buildLetters(wordEl, word);

      if (isBoss) {
        bossBarFill.style.width = `${(1 - index / words.length) * 100}%`;
        phraseWords.forEach((span, i) => {
          span.className = i < index ? "done" : i === index ? "current" : "";
        });
      }
    };

    view.showWord(0);
    return view;
  }

  /* ---------- Explosion particles ---------- */

  const PARTICLE_COLORS = [
    "#ff0000",
    "#ff4400",
    "#ff8800",
    "#ffcc00",
    "#ff6600",
  ];

  /**
   * Burst of particles from the centre of an alien; returns their state.
   * `large` particles stand in for the word's letters, `small` are sparks.
   */
  function createParticles(alienRoot, size, large, small, scale = 1) {
    const particles = [];
    const center = size / 2;

    const add = (angle, speed, lift, particleSize) => {
      const color =
        PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
      const node = el("particle", alienRoot);
      node.style.width = node.style.height = `${particleSize}px`;
      node.style.margin = `${-particleSize / 2}px`;
      node.style.backgroundColor = color;
      node.style.boxShadow = `0 0 ${particleSize * 0.5}px ${color}`;
      particles.push({
        node,
        x: center,
        y: center,
        vx: Math.cos(angle) * speed * scale,
        vy: (Math.sin(angle) * speed - lift) * scale,
        alpha: 1,
      });
    };

    for (let i = 0; i < large; i++) {
      add((i / large) * Math.PI * 2, rand(3, 7), 3, rand(24, 36) * scale);
    }
    for (let i = 0; i < small; i++) {
      add(
        (i / small) * Math.PI * 2 + rand(0, 0.5),
        rand(2, 7),
        2,
        rand(6, 12) * scale
      );
    }

    stepParticles(particles, 0);
    return particles;
  }

  /** Advance particles by dt milliseconds (velocities are per 60 fps frame). */
  function stepParticles(particles, dt) {
    const frames = dt / (1000 / 60);
    for (const p of particles) {
      p.x += p.vx * frames;
      p.y += p.vy * frames;
      p.vy += 0.15 * frames;
      p.alpha *= Math.pow(0.97, frames);
      p.node.style.translate = `${p.x}px ${p.y}px`;
      p.node.style.opacity = p.alpha > 0.1 ? p.alpha : 0;
    }
  }

  /* ---------- Laser ---------- */

  function createLaser(container, startX, startY, endX, endY) {
    const laser = el("laser");
    laser.style.left = `${startX}px`;
    laser.style.top = `${startY}px`;
    laser.style.width = `${Math.hypot(endX - startX, endY - startY)}px`;
    laser.style.rotate = `${Math.atan2(endY - startY, endX - startX)}rad`;
    el("laser-trail", laser);
    el("laser-glow", laser);
    el("laser-core", laser);
    el("laser-tip", laser);
    container.appendChild(laser);
    setTimeout(() => laser.remove(), 300);
  }

  /* ---------- Power-ups ---------- */

  function createPowerUpView(type) {
    const config = POWER_UP_CONFIG.types[type];
    const root = el("power-up");
    root.style.setProperty("--c", config.color);
    el("power-up-icon", root).textContent = config.icon;
    const letters = buildLetters(el("power-up-word", root), config.word);
    return { root, letters };
  }

  /** Show a pill with the seconds left for each active power-up. */
  function renderActivePowerUps(container, entries) {
    const signature = entries.map((e) => `${e.type}:${e.seconds}`).join("|");
    if (container.dataset.signature === signature) return;
    container.dataset.signature = signature;
    container.replaceChildren(
      ...entries.map(({ type, seconds }) => {
        const config = POWER_UP_CONFIG.types[type];
        const pill = el("power-up-timer");
        pill.style.setProperty("--c", config.color);
        el("", pill, "span").textContent = config.icon;
        el("", pill, "span").textContent = `${seconds}s`;
        return pill;
      })
    );
  }

  /* ---------- Slow-time overlay ---------- */

  function buildSlowTimeEffect(container) {
    el("digital-grid", container);

    for (let i = 0; i < 20; i++) {
      const drop = el("digital-rain", container);
      drop.textContent = Math.floor(rand(0, 16)).toString(16);
      drop.style.left = `${rand(0, 100)}%`;
      drop.style.animationDuration = `${rand(2, 4)}s`;
      drop.style.animationDelay = `${rand(0, 2)}s`;
    }

    for (let i = 0; i < 15; i++) {
      const fragment = el("time-fragment", container);
      fragment.style.left = `${rand(0, 100)}%`;
      fragment.style.top = `${rand(0, 100)}%`;
      fragment.style.animationDuration = `${rand(3, 5)}s`;
    }

    const clock = el("time-clock", container);
    for (let i = 0; i < 3; i++) {
      const wave = el("time-wave", clock);
      wave.style.animationDuration = `${2 + i * 0.5}s`;
      wave.style.animationDelay = `${i * 0.5}s`;
    }
    el("time-clock-face", clock);
    el("time-clock-hand reverse", clock);
    el("time-clock-hand forward", clock);
    el("time-clock-center", clock);
  }

  /* ---------- Menus ---------- */

  /** Label/value cells for the end-of-game summary. */
  function renderResults(container, items) {
    container.replaceChildren(
      ...items.map(([label, value]) => {
        const cell = el("result");
        el("result-value", cell).textContent = value;
        el("result-label", cell).textContent = label;
        return cell;
      })
    );
  }

  function renderScoresTable(container, scores, highlightIndex = -1) {
    if (scores.length === 0) {
      container.innerHTML =
        '<p class="scores-empty">No scores yet. Go blast some words.</p>';
      return;
    }

    const table = el("scores-table", null, "table");
    table.innerHTML =
      "<thead><tr><th>#</th><th>Score</th><th>Level</th><th>WPM</th><th>Mode</th><th>Date</th></tr></thead>";
    const body = el("", table, "tbody");
    scores.forEach((entry, i) => {
      const row = el(i === highlightIndex ? "highlight" : "", body, "tr");
      const cells = [
        i + 1,
        Number(entry.score).toLocaleString(),
        entry.level,
        entry.wpm ?? "–",
        DIFFICULTIES[entry.mode]?.label ?? "–",
        entry.date ?? "–",
      ];
      for (const value of cells) el("", row, "td").textContent = value;
    });
    container.replaceChildren(table);
  }

  /** Restart a CSS animation that is tied to a class or to being shown. */
  function replay(node, className) {
    if (className) {
      node.classList.remove(className);
      void node.offsetWidth;
      node.classList.add(className);
    } else {
      node.hidden = true;
      void node.offsetWidth;
      node.hidden = false;
    }
  }

  Object.assign(WB, {
    ICONS,
    createStars,
    renderHearts,
    createAlienView,
    highlightLetters,
    createParticles,
    stepParticles,
    createLaser,
    createPowerUpView,
    renderActivePowerUps,
    buildSlowTimeEffect,
    renderResults,
    renderScoresTable,
    replay,
  });
})((window.WordBlast = window.WordBlast || {}));
