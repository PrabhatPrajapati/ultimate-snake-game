// HUD - Heads-Up Display
class HUD {
  constructor(scene) {
    this.scene = scene;
    this.scoreText = null;
    this.highScoreText = null;
    this.speedText = null;
    this.levelText = null;
    this.comboText = null;
    this.timerText = null;
    this.effectsText = null;
  }

  create() {
    const padding = 10;
    const fontSize = "18px";
    const fontFamily = "Arial";
    const color = "#ffffff";

    // Score (top-left)
    this.scoreText = this.scene.add.text(padding, padding, "Score: 0", {
      fontSize: fontSize,
      fontFamily: fontFamily,
      color: color,
      stroke: "#000000",
      strokeThickness: 3,
    });

    // High Score (top-left, below score)
    this.highScoreText = this.scene.add.text(padding, padding + 25, "High: 0", {
      fontSize: "14px",
      fontFamily: fontFamily,
      color: "#ffff00",
      stroke: "#000000",
      strokeThickness: 2,
    });

    // Level (top-center)
    this.levelText = this.scene.add
      .text(GameConfig.GAME_WIDTH / 2, padding, "Level 1", {
        fontSize: "20px",
        fontFamily: fontFamily,
        color: "#00ff00",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5, 0);

    // Speed (top-right)
    this.speedText = this.scene.add
      .text(GameConfig.GAME_WIDTH - padding, padding, "Speed: 1.0x", {
        fontSize: fontSize,
        fontFamily: fontFamily,
        color: color,
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(1, 0);

    // Combo (below level, hidden initially)
    this.comboText = this.scene.add
      .text(GameConfig.GAME_WIDTH / 2, padding + 30, "", {
        fontSize: "24px",
        fontFamily: fontFamily,
        color: "#ff00ff",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5, 0);
    this.comboText.setVisible(false);

    // Timer (for Time Attack and Boss Level)
    this.timerText = this.scene.add
      .text(GameConfig.GAME_WIDTH / 2, GameConfig.GAME_HEIGHT - padding, "", {
        fontSize: "22px",
        fontFamily: fontFamily,
        color: "#ff6600",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5, 1);
    this.timerText.setVisible(false);

    // Active Effects (bottom-left)
    this.effectsText = this.scene.add
      .text(padding, GameConfig.GAME_HEIGHT - padding, "", {
        fontSize: "16px",
        fontFamily: fontFamily,
        color: "#00ffff",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0, 1);
  }

  updateScore(score, highScore) {
    this.scoreText.setText(`Score: ${score}`);
    this.highScoreText.setText(`High: ${highScore}`);
  }

  updateSpeed(currentSpeed, baseSpeed) {
    const multiplier = (baseSpeed / currentSpeed).toFixed(1);
    this.speedText.setText(`Speed: ${multiplier}x`);
  }

  updateLevel(levelNumber, levelName) {
    this.levelText.setText(`Level ${levelNumber}: ${levelName}`);
  }

  updateCombo(multiplier) {
    if (multiplier > 1) {
      this.comboText.setText(`COMBO x${multiplier}!`);
      this.comboText.setVisible(true);

      // Pulse animation
      this.scene.tweens.add({
        targets: this.comboText,
        scale: { from: 1.2, to: 1 },
        duration: 200,
      });
    } else {
      this.comboText.setVisible(false);
    }
  }

  updateTimer(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    this.timerText.setText(`Time: ${mins}:${secs.toString().padStart(2, "0")}`);
    this.timerText.setVisible(true);

    // Warning color when low
    if (seconds < 10) {
      this.timerText.setColor("#ff0000");
    } else if (seconds < 30) {
      this.timerText.setColor("#ffaa00");
    } else {
      this.timerText.setColor("#ff6600");
    }
  }

  updateEffects(effectTypes) {
    if (effectTypes.length > 0) {
      const effectNames = effectTypes.map((type) => {
        if (type === "speed") return "⚡ SPEED BOOST";
        if (type === "slow") return "⏱ SLOW TIME";
        return type;
      });
      this.effectsText.setText(effectNames.join("\n"));
    } else {
      this.effectsText.setText("");
    }
  }

  hideTimer() {
    this.timerText.setVisible(false);
  }

  destroy() {
    if (this.scoreText) this.scoreText.destroy();
    if (this.highScoreText) this.highScoreText.destroy();
    if (this.speedText) this.speedText.destroy();
    if (this.levelText) this.levelText.destroy();
    if (this.comboText) this.comboText.destroy();
    if (this.timerText) this.timerText.destroy();
    if (this.effectsText) this.effectsText.destroy();
  }
}
