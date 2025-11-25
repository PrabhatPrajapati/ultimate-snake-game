// Pause Menu
class PauseMenu {
  constructor(scene) {
    this.scene = scene;
    this.container = null;
    this.isVisible = false;
  }

  create() {
    // Semi-transparent overlay (non‑interactive, behind buttons)
    const overlay = this.scene.add.rectangle(
      GameConfig.GAME_WIDTH / 2,
      GameConfig.GAME_HEIGHT / 2,
      GameConfig.GAME_WIDTH,
      GameConfig.GAME_HEIGHT,
      0x000000,
      0.7
    );
    overlay.setDepth(0);

    // Menu background
    const menuBg = this.scene.add.rectangle(
      GameConfig.GAME_WIDTH / 2,
      GameConfig.GAME_HEIGHT / 2,
      400,
      300,
      0x1a1a2e
    );
    menuBg.setStrokeStyle(4, 0x00ff00);

    // Title
    const title = this.scene.add
      .text(
        GameConfig.GAME_WIDTH / 2,
        GameConfig.GAME_HEIGHT / 2 - 100,
        "PAUSED",
        {
          fontSize: "48px",
          fontFamily: "Arial",
          color: "#00ff00",
          stroke: "#000000",
          strokeThickness: 6,
        }
      )
      .setOrigin(0.5);

    // Resume button
    const resumeBtn = this.createButton(
      GameConfig.GAME_WIDTH / 2,
      GameConfig.GAME_HEIGHT / 2 - 20,
      "Resume",
      () => {
        this.hide();
        this.scene.isPaused = false; // unpause the game
      }
    );

    // Restart button
    const restartBtn = this.createButton(
      GameConfig.GAME_WIDTH / 2,
      GameConfig.GAME_HEIGHT / 2 + 40,
      "Restart",
      () => {
        this.hide();
        this.scene.scene.restart();
      }
    );

    // Main Menu button
    const menuBtn = this.createButton(
      GameConfig.GAME_WIDTH / 2,
      GameConfig.GAME_HEIGHT / 2 + 100,
      "Main Menu",
      () => {
        this.hide();
        this.scene.scene.start("MenuScene");
      }
    );

    // Group all elements
    this.container = this.scene.add.container(0, 0, [
      overlay,
      menuBg,
      title,
      resumeBtn.bg,
      resumeBtn.text,
      restartBtn.bg,
      restartBtn.text,
      menuBtn.bg,
      menuBtn.text,
    ]);

    this.container.setVisible(false);
    this.container.setDepth(1000);
  }

  createButton(x, y, text, callback) {
    const bg = this.scene.add.rectangle(x, y, 200, 50, 0x2a2a4e);
    bg.setStrokeStyle(2, 0x00ff00);
    bg.setInteractive({ useHandCursor: true });

    const label = this.scene.add
      .text(x, y, text, {
        fontSize: "24px",
        fontFamily: "Arial",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // Hover effects
    bg.on("pointerover", () => {
      bg.setFillStyle(0x3a3a5e);
      label.setColor("#00ff00");
    });

    bg.on("pointerout", () => {
      bg.setFillStyle(0x2a2a4e);
      label.setColor("#ffffff");
    });

    bg.on("pointerdown", callback);

    return { bg, text: label };
  }

  show() {
    if (this.container) {
      this.container.setVisible(true);
      this.isVisible = true;
      // Do NOT pause the scene here; GameScene handles isPaused flag
    }
  }

  hide() {
    if (this.container) {
      this.container.setVisible(false);
      this.isVisible = false;
      // Do NOT resume the scene here; GameScene will handle resuming
    }
  }

  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }
}
