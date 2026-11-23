# Word Blast

A browser typing game. Planets carrying words fall toward your ship; type a word to lock on and destroy its planet before it lands.

**[Play it in your browser](https://word-blast-game.vercel.app/)**

<p align="center">
  <img src="word-blast-preview.png" alt="Word Blast gameplay" width="600">
</p>

## Features

- **Target lock.** The first letter you type locks on to a planet, and wrong letters are rejected rather than left in the input.
- **Difficulty modes.** Easy, Normal, Hard, and Zen, a practice mode with no lives and no game over.
- **Combo multiplier.** Consecutive kills without a typo or a miss multiply your score, up to ×5.
- **Enemy types.** Fast planets, armoured planets that take two words, and splitters that break into two.
- **Boss fights.** Every fifth level ends with a boss that you defeat by typing a phrase.
- **Power-ups.** Shield, slow time, freeze, double score, bomb, and extra life.
- **Statistics.** Words per minute, accuracy, and best combo after each game, with a top-ten high-score table stored in the browser.
- **Mobile support.** The layout adapts to small screens and on-screen keyboards.
- **Settings.** Volume control and a reduced-motion option that turns off screen shake and flashing.

## How to play

1. Choose a difficulty and select **Start Game**.
2. Type the word on a planet. The first letter locks on, and finishing the word destroys the planet.
3. Press Space or Enter to release a target and choose another.
4. Keep planets away from your ship. Each one that reaches it costs a life and resets your combo.
5. Type the word under a power-up to collect it.
6. On every fifth level, type the boss's phrase word by word before it lands.

Press Esc to pause.

### Power-ups

| Word     | Effect                                         |
| -------- | ---------------------------------------------- |
| `SHIELD` | Planets that reach the ship do no damage.      |
| `SLOW`   | Everything falls at less than half speed.      |
| `FREEZE` | Planets stop completely for a few seconds.     |
| `DOUBLE` | Double score.                                  |
| `BOMB`   | Destroys every planet on screen.               |
| `LIFE`   | Adds one life, up to a maximum of five.        |

## Running locally

Word Blast is a static site with no build step and no dependencies. Clone the repository and open `index.html` in a browser:

```bash
git clone https://github.com/samizak/word-blast.git
cd word-blast
```

To serve it over HTTP instead, use any static file server:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Project structure

```
word-blast/
├── index.html        Page markup for every screen
├── styles.css        Styling and animations
├── js/
│   ├── main.js       Game state, rules, and main loop
│   ├── view.js       DOM builders for planets, lasers, and effects
│   ├── config.js     Difficulty modes, tuning values, and level formulas
│   ├── words.js      Word tiers and boss phrases
│   ├── sound.js      Sound files, synthesized effects, and volume
│   └── highscore.js  High scores and settings in localStorage
└── sounds/           Sound effects
```

The game is written in plain HTML, CSS, and JavaScript with no framework. Gameplay values such as spawn rates, fall speeds, and power-up durations are in `js/config.js`.

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes.
4. Push the branch and open a pull request.

## License

Released under the MIT License. See [LICENSE](LICENSE) for details.
