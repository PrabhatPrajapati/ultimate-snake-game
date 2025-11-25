# 🐍 Snake Game

A modern, feature-rich snake game built with **Phaser 3** game framework. Enjoy multiple game modes, various power-ups, challenging levels, and smooth gameplay mechanics.

## 🎮 Game Features

- **Multiple Game Modes**
  - Endless Mode: Play until you lose
  - Time Attack: Score as much as you can in 60 seconds
  - Hard Mode: Increased difficulty and faster snake
  - Kids Mode: Slower speeds, great for beginners

- **10 Progressive Levels** with increasing difficulty
  - Level 1: Classic (learn the basics)
  - Levels 2-10: Walls, obstacles, portals, and AI opponents

- **Food Types & Power-ups**
  - 🍎 Normal Apple: Basic food (+1 score)
  - ⭐ Golden Apple: Rare, high value (+5 score)
  - 💣 Bomb: Shrinks your snake (-2 score)
  - ⚡ Speed Boost: Temporarily speeds up your snake
  - ⏱ Slow Time: Temporarily slows down your snake

- **AI Snake Opponent** in advanced levels
- **Portals** for level traversal (Levels 5+)
- **Obstacle Walls** increasing with difficulty
- **Score System** with combo multipliers
- **High Score Tracking**

## 🚀 How to Run

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No installation required!

### Quick Start
1. Navigate to the game folder
2. Open `index.html` in your web browser
3. Start playing!

**Or use a local server (recommended):**

```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (if installed)
npx http-server
```

Then open `http://localhost:8000` in your browser.

## 🎮 How to Play

### Controls
- **Arrow Keys** or **WASD** - Move the snake in different directions
- **ESC** - Pause/Resume game
- **P** - Toggle pause menu

### Game Rules
1. Guide the snake to eat food and grow longer
2. Avoid hitting walls, obstacles, and your own body
3. In higher levels, avoid the AI snake
4. Collect power-ups strategically
5. Reach the food target or survive as long as possible depending on mode

### Scoring
- Each normal apple eaten: **+1 point**
- Golden apple: **+5 points**
- Bombs eaten: **-2 points** (also shrinks your snake)
- Level completion bonus: **+20 points**
- No death bonus: **+10 points**
- Combo multiplier: Eat 3+ foods quickly for 2x-3x multiplier

## 📁 Project Structure

```
snake-game/
├── index.html              # Main HTML file
├── styles.css              # Game styling
├── README.md               # This file
└── src/
    ├── config.js           # Game configuration & constants
    ├── main.js             # Game initialization
    ├── entities/
    │   ├── Snake.js        # Player snake class
    │   ├── AISnake.js      # AI opponent class
    │   └── Food.js         # Food spawning & management
    ├── levels/
    │   ├── LevelManager.js # Level control system
    │   ├── Level1.js       # Level 1 configuration
    │   ├── Level2.js - Level10.js  # Additional levels
    ├── scenes/
    │   ├── PreloadScene.js # Asset loading
    │   ├── MenuScene.js    # Main menu
    │   ├── GameScene.js    # Main gameplay
    │   └── GameOverScene.js# Game over screen
    ├── ui/
    │   ├── HUD.js          # Heads-up display (score, level, speed)
    │   └── PauseMenu.js    # Pause menu
    └── utils/
        ├── GridHelper.js   # Grid position calculations
        └── ScoreManager.js # Score tracking & combos
```

## 🛠️ Technical Stack

- **Phaser 3.55.0** - Game framework
- **Vanilla JavaScript** - Core game logic
- **HTML5 Canvas** - Graphics rendering
- **CSS3** - Styling

## 📊 Game Configuration

Edit `src/config.js` to customize:
- Grid size and cell size
- Game speed and speed increases
- Food spawn probabilities
- Power-up effects and durations
- AI behavior
- Scoring system

## 🎯 Level Progression

| Level | Name | Features | Difficulty |
|-------|------|----------|------------|
| 1 | Classic | None | Easy |
| 2 | Walls | Static obstacles | Medium |
| 3 | Maze | Complex walls | Medium |
| 4 | AI Rival | AI snake opponent | Hard |
| 5 | Portals | Warp zones + walls | Hard |
| 6 | Speed Run | Faster snake speed | Very Hard |
| 7 | Spiral | Rotating obstacles | Very Hard |
| 8 | Chaos | Multiple obstacles + AI | Extreme |
| 9 | Boss Battle | Boss obstacle patterns | Extreme |
| 10 | Ultimate | All features combined | Extreme |

## 🐛 Known Issues & Future Features

### Future Enhancements
- [ ] Mobile touch controls
- [ ] Multiplayer mode
- [ ] Custom level editor
- [ ] Leaderboard system
- [ ] Sound effects & music
- [ ] Particle effects
- [ ] Themes/skins
- [ ] Achievements/badges

## 📝 License

This project is open source and available for personal use and modification.

## 🤝 Contributing

Feel free to fork, modify, and improve this game! Some ideas:
- Add new power-ups
- Create more levels
- Improve UI/UX
- Add animations
- Optimize performance

## ⚙️ Installation for Development

If you want to modify the game:

1. Clone or download the repository
2. Install a code editor (VS Code recommended)
3. Install dependencies:
   ```bash
   npm install  # If you want to set up a build process
   ```
4. Open `index.html` in a browser or use a local server
5. Edit files in the `src/` folder
6. Refresh the browser to see changes

## 🎓 Learning Resources

- [Phaser 3 Documentation](https://photonstorm.github.io/phaser3-docs/)
- [Phaser Examples](https://phaser.io/examples)
- [MDN Web Docs - Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

## 💡 Tips for Success

1. **Learn the basic mechanics** - Start on Level 1 to understand controls
2. **Master timing** - Predict where food will spawn
3. **Plan ahead** - Don't trap yourself in corners
4. **Use power-ups wisely** - Speed boosts help escape danger
5. **Avoid bombs** - They shrink your snake!
6. **Practice makes perfect** - Each level teaches new strategies

---

**Enjoy the game! 🎮** Happy snake hunting! 🐍

