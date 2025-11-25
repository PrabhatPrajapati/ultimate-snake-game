// Game Over Scene - Display final score and options
class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }

  init(data) {
    this.finalScore = data.score || 0;
    this.highScore = data.highScore || 0;
    this.isNewHighScore = data.isNewHighScore || false;
    this.gameMode = data.gameMode || "endless";
    this.level = data.level || 1;
  }

  create() {
    const width = GameConfig.GAME_WIDTH;
    const height = GameConfig.GAME_HEIGHT;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

    // Game Over title
    const title = this.add
      .text(width / 2, 100, "GAME OVER", {
        fontSize: "64px",
        fontFamily: "Arial",
        color: "#ff0000",
        stroke: "#000000",
        strokeThickness: 8,
      })
      .setOrigin(0.5);

    // Pulse animation
    this.tweens.add({
      targets: title,
      scale: { from: 1, to: 1.1 },
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // New high score notification
    if (this.isNewHighScore) {
      const newHighText = this.add
        .text(width / 2, 180, "🎉 NEW HIGH SCORE! 🎉", {
          fontSize: "32px",
          fontFamily: "Arial",
          color: "#ffff00",
          stroke: "#000000",
          strokeThickness: 4,
        })
        .setOrigin(0.5);

      this.tweens.add({
        targets: newHighText,
        alpha: { from: 0.5, to: 1 },
        duration: 500,
        yoyo: true,
        repeat: -1,
      });
    }

    // Score display
    const scoreY = this.isNewHighScore ? 240 : 200;
    this.add
      .text(width / 2, scoreY, `Final Score: ${this.finalScore}`, {
        fontSize: "36px",
        fontFamily: "Arial",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, scoreY + 50, `High Score: ${this.highScore}`, {
        fontSize: "28px",
        fontFamily: "Arial",
        color: "#ffff00",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    // Game info
    const modeNames = {
      endless: "Endless Mode",
      timeAttack: "Time Attack",
      hard: "Hard Mode",
      kids: "Kids Mode",
    };

    this.add
      .text(
        width / 2,
        scoreY + 100,
        `Mode: ${modeNames[this.gameMode]} | Level: ${this.level}`,
        {
          fontSize: "20px",
          fontFamily: "Arial",
          color: "#aaaaaa",
        }
      )
      .setOrigin(0.5);

    // Buttons
    this.createButton(width / 2, height / 2 + 50, "Play Again", () => {
      this.scene.start("GameScene", {
        gameMode: this.gameMode,
        startLevel: this.level,
      });
    });

    this.createButton(width / 2, height / 2 + 120, "Main Menu", () => {
      this.scene.start("MenuScene");
    });

    // Tip
    this.add
      .text(
        width / 2,
        height - 30,
        "Tip: Collect golden food for bonus points!",
        {
          fontSize: "16px",
          fontFamily: "Arial",
          color: "#888888",
          fontStyle: "italic",
        }
      )
      .setOrigin(0.5);
  }

  createButton(x, y, text, callback) {
    // Shadow
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.3);
    shadow.fillRoundedRect(x - 123, y - 28, 250, 60, 10);

    // Button background
    const bgGraphics = this.add.graphics();
    bgGraphics.fillStyle(0x2a2a4e, 1);
    bgGraphics.fillRoundedRect(x - 125, y - 30, 250, 60, 10);
    bgGraphics.lineStyle(3, 0x00ff00, 1);
    bgGraphics.strokeRoundedRect(x - 125, y - 30, 250, 60, 10);

    // Highlight
    const highlight = this.add.graphics();
    highlight.fillStyle(0xffffff, 0.15);
    highlight.fillRoundedRect(x - 120, y - 25, 240, 20, 6);

    const hitArea = this.add.rectangle(x, y, 250, 60, 0x000000, 0);
    hitArea.setInteractive({ useHandCursor: true });

    const label = this.add
      .text(x, y, text, {
        fontSize: "28px",
        fontFamily: "Arial",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    hitArea.on("pointerover", () => {
      bgGraphics.clear();
      bgGraphics.fillStyle(0x3a3a5e, 1);
      bgGraphics.fillRoundedRect(x - 125, y - 30, 250, 60, 10);
      bgGraphics.lineStyle(4, 0x00ff00, 1);
      bgGraphics.strokeRoundedRect(x - 125, y - 30, 250, 60, 10);
      label.setColor("#00ff00");
      this.tweens.add({
        targets: label,
        scale: 1.05,
        duration: 100,
      });
    });

    hitArea.on("pointerout", () => {
      bgGraphics.clear();
      bgGraphics.fillStyle(0x2a2a4e, 1);
      bgGraphics.fillRoundedRect(x - 125, y - 30, 250, 60, 10);
      bgGraphics.lineStyle(3, 0x00ff00, 1);
      bgGraphics.strokeRoundedRect(x - 125, y - 30, 250, 60, 10);
      label.setColor("#ffffff");
      label.setScale(1);
    });

    hitArea.on("pointerdown", callback);
  }
}
