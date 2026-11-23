# Word Blast 🚀

A fast-paced typing game where you defend Earth from alien words by typing them correctly. Blast aliens with your laser typing skills and collect power-ups to help you survive the invasion!

<p align="center">
  <a href="https://youtu.be/your-video-id">
    <img src="word-blast-preview.png" alt="Word Blast Game Demo" width="600">
  </a>
  <br>
  <em>Click the image to watch the gameplay demo</em>
</p>

## 🎮 Play Now!

You can play Word Blast right now in your browser:
[**Play Word Blast**](https://word-blast-game.vercel.app/)

## ✨ Features

- **Fast-paced Typing Action**: Type words to destroy alien planets before they reach Earth
- **Progressive Difficulty**: Game gets harder as you advance through levels with more challenging words
- **Power-ups System**: Collect special power-ups like shields and time-slowing abilities to gain advantages
- **Visual Effects**: Stunning lasers, explosions, and space-themed visuals enhance the gameplay experience
- **Sound Effects**: Immersive sound design with background atmosphere and reactive action sounds
- **Level Progression**: Complete levels by destroying a specific number of aliens, with increasing challenge
- **Score System**: Earn points based on word length and typing speed

## 🎮 How to Play

1. **Start the Game**: Click the "START" button on the main screen
2. **Type Words**: Type the words displayed on the alien planets to destroy them
3. **Avoid Invasions**: Don't let the aliens reach the bottom of the screen or you'll lose lives
4. **Collect Power-ups**: Type special power-up words when they appear:
   - 🛡️ **SHIELD**: Temporarily protects you from aliens reaching Earth
   - ⏰ **SLOW**: Slows down all aliens on screen for a limited time
5. **Complete Levels**: Destroy the required number of aliens to advance to the next level
6. **Survive**: Try to reach the highest level and score possible!

## 🚀 Getting Started

Word Blast is a static site with no build step and no dependencies. To run it locally, open `index.html` in your browser, or serve the folder:

```bash
# Clone the repository
git clone https://github.com/yourusername/word-blast.git
cd word-blast

# Serve the folder with any static file server
python3 -m http.server 8000
```

Open http://localhost:8000 in your browser to see the game in action.

## 🛠️ Technologies Used

- HTML - A single page, no framework
- CSS - Styling, animations and visual effects
- JavaScript - Game loop, state and DOM rendering
- HTML Audio - For sound effects and background music

## 🔧 Project Structure

    word-blast/
    ├── index.html    # Page markup for every screen
    ├── styles.css    # All styling and animations
    ├── js/
    │   ├── main.js       # Game state, rules and main loop
    │   ├── view.js       # DOM builders (planets, lasers, effects)
    │   ├── config.js     # Tuning values and level formulas
    │   ├── words.js      # Word lists by difficulty
    │   ├── sound.js      # Sound effects and background loop
    │   └── highscore.js  # High scores in localStorage
    └── sounds/       # Game sound effects

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository
2. Create a feature branch ( git checkout -b feature/amazing-feature )
3. Commit your changes ( git commit -m 'Add some amazing feature' )
4. Push to the branch ( git push origin feature/amazing-feature )
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
