// Menu Scene - Main menu with game mode and level selection
class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });
  }

  create() {
    const width = GameConfig.GAME_WIDTH;
    const height = GameConfig.GAME_HEIGHT;

    // Background with gradient
    const bgGraphics = this.add.graphics();
    bgGraphics.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x0f0f1e, 0x0f0f1e, 1);
    bgGraphics.fillRect(0, 0, width, height);

    // Animated grid background
    this.createAnimatedBackground();

    // Title
    const title = this.add
      .text(width / 2, 80, "🐍 ULTIMATE SNAKE", {
        fontSize: "56px",
        fontFamily: "Arial",
        color: "#00ff00",
        stroke: "#000000",
        strokeThickness: 8,
      })
      .setOrigin(0.5);

    // Pulsing animation for title
    this.tweens.add({
      targets: title,
      scale: { from: 1, to: 1.1 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });

    // High Score display
    const scoreManager = new ScoreManager();
    this.add
      .text(width / 2, 150, `High Score: ${scoreManager.getHighScore()}`, {
        fontSize: "24px",
        fontFamily: "Arial",
        color: "#ffff00",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Game Mode Selection
    this.add
      .text(width / 2, 200, "SELECT GAME MODE", {
        fontSize: "20px",
        fontFamily: "Arial",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    const modes = [
      {
        name: "Endless Mode",
        key: "endless",
        desc: "Play until you die",
        y: 250,
      },
      {
        name: "Time Attack",
        key: "timeAttack",
        desc: "Eat 20 food in 60s",
        y: 310,
      },
      {
        name: "Hard Mode",
        key: "hard",
        desc: "1.5x speed + obstacles",
        y: 370,
      },
      { name: "Kids Mode", key: "kids", desc: "Slow & easy", y: 430 },
    ];

    modes.forEach((mode) => {
      this.createModeButton(width / 2, mode.y, mode.name, mode.desc, mode.key);
    });

    // Level selection hint
    this.add
      .text(width / 2, 500, "Or select a specific level:", {
        fontSize: "16px",
        fontFamily: "Arial",
        color: "#aaaaaa",
      })
      .setOrigin(0.5);

    // Level buttons (1-10)
    const levelY = 540;
    const startX = width / 2 - 225;
    for (let i = 1; i <= 10; i++) {
      this.createLevelButton(startX + (i - 1) * 50, levelY, i);
    }

    // Instructions
    this.add
      .text(
        width / 2,
        height - 20,
        "Use Arrow Keys or WASD to move | ESC to pause",
        {
          fontSize: "14px",
          fontFamily: "Arial",
          color: "#888888",
        }
      )
      .setOrigin(0.5);
  }

  createAnimatedBackground() {
    // Create subtle moving grid
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x333333, 0.3);

    for (let x = 0; x < GameConfig.GAME_WIDTH; x += GameConfig.CELL_SIZE) {
      graphics.lineBetween(x, 0, x, GameConfig.GAME_HEIGHT);
    }
    for (let y = 0; y < GameConfig.GAME_HEIGHT; y += GameConfig.CELL_SIZE) {
      graphics.lineBetween(0, y, GameConfig.GAME_WIDTH, y);
    }
  }

  createModeButton(x, y, name, desc, modeKey) {
    // Shadow
    const shadow = this.add.rectangle(x + 2, y + 2, 400, 50, 0x000000, 0.3);
    shadow.setStrokeStyle(2, 0x000000, 0.3);

    // Button background with gradient effect
    const bgGraphics = this.add.graphics();
    bgGraphics.fillStyle(0x2a2a4e, 1);
    bgGraphics.fillRoundedRect(x - 200, y - 25, 400, 50, 8);
    bgGraphics.lineStyle(2, 0x00ff00, 1);
    bgGraphics.strokeRoundedRect(x - 200, y - 25, 400, 50, 8);

    // Highlight
    const highlight = this.add.graphics();
    highlight.fillStyle(0xffffff, 0.1);
    highlight.fillRoundedRect(x - 195, y - 20, 390, 15, 5);

    // Interactive zone
    const hitArea = this.add.rectangle(x, y, 400, 50, 0x000000, 0);
    hitArea.setInteractive({ useHandCursor: true });

    const nameText = this.add
      .text(x - 180, y, name, {
        fontSize: "20px",
        fontFamily: "Arial",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0, 0.5);

    const descText = this.add
      .text(x + 180, y, desc, {
        fontSize: "14px",
        fontFamily: "Arial",
        color: "#aaaaaa",
      })
      .setOrigin(1, 0.5);

    // Hover effects
    hitArea.on("pointerover", () => {
      bgGraphics.clear();
      bgGraphics.fillStyle(0x3a3a5e, 1);
      bgGraphics.fillRoundedRect(x - 200, y - 25, 400, 50, 8);
      bgGraphics.lineStyle(3, 0x00ff00, 1);
      bgGraphics.strokeRoundedRect(x - 200, y - 25, 400, 50, 8);
      nameText.setColor("#00ff00");
      this.tweens.add({
        targets: hitArea,
        scaleY: 1.05,
        duration: 100,
      });
    });

    hitArea.on("pointerout", () => {
      bgGraphics.clear();
      bgGraphics.fillStyle(0x2a2a4e, 1);
      bgGraphics.fillRoundedRect(x - 200, y - 25, 400, 50, 8);
      bgGraphics.lineStyle(2, 0x00ff00, 1);
      bgGraphics.strokeRoundedRect(x - 200, y - 25, 400, 50, 8);
      nameText.setColor("#ffffff");
      hitArea.scaleY = 1;
    });

    hitArea.on("pointerdown", () => {
      this.startGame(modeKey, 1);
    });
  }

  createLevelButton(x, y, levelNum) {
    // Shadow
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.3);
    shadow.fillRoundedRect(x - 18, y - 18, 40, 40, 6);

    // Button
    const bgGraphics = this.add.graphics();
    bgGraphics.fillStyle(0x2a2a4e, 1);
    bgGraphics.fillRoundedRect(x - 20, y - 20, 40, 40, 6);
    bgGraphics.lineStyle(2, 0x666666, 1);
    bgGraphics.strokeRoundedRect(x - 20, y - 20, 40, 40, 6);

    // Highlight
    const highlight = this.add.graphics();
    highlight.fillStyle(0xffffff, 0.15);
    highlight.fillRoundedRect(x - 18, y - 18, 36, 12, 4);

    const hitArea = this.add.rectangle(x, y, 40, 40, 0x000000, 0);
    hitArea.setInteractive({ useHandCursor: true });

    const text = this.add
      .text(x, y, levelNum.toString(), {
        fontSize: "18px",
        fontFamily: "Arial",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    hitArea.on("pointerover", () => {
      bgGraphics.clear();
      bgGraphics.fillStyle(0x3a3a5e, 1);
      bgGraphics.fillRoundedRect(x - 20, y - 20, 40, 40, 6);
      bgGraphics.lineStyle(3, 0x00ff00, 1);
      bgGraphics.strokeRoundedRect(x - 20, y - 20, 40, 40, 6);
      text.setColor("#00ff00");
      this.tweens.add({
        targets: text,
        scale: 1.1,
        duration: 100,
      });
    });

    hitArea.on("pointerout", () => {
      bgGraphics.clear();
      bgGraphics.fillStyle(0x2a2a4e, 1);
      bgGraphics.fillRoundedRect(x - 20, y - 20, 40, 40, 6);
      bgGraphics.lineStyle(2, 0x666666, 1);
      bgGraphics.strokeRoundedRect(x - 20, y - 20, 40, 40, 6);
      text.setColor("#ffffff");
      text.setScale(1);
    });

    hitArea.on("pointerdown", () => {
      this.startGame("endless", levelNum);
    });
  }

  startGame(mode, level) {
    this.scene.start("GameScene", { gameMode: mode, startLevel: level });
  }
}
