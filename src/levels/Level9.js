// Level 9 - Cave Adventure (Explore the mysterious dungeon!)
class Level9 extends BaseLevel {
  constructor() {
    super("Cave Adventure", "Explore the mysterious dungeon!");
    this.speedMultiplier = 1.1;
    this.darkMode = true;
  }

  initialize(scene) {
    this.obstacles = [];
    this.portals = [];
    this.torches = [];
    this.treasures = [];
    this.scene = scene;

    const maxX = Math.floor(GameConfig.GAME_WIDTH / GameConfig.CELL_SIZE);
    const maxY = Math.floor(GameConfig.GAME_HEIGHT / GameConfig.GAME_SIZE);

    // Create cave walls (rocky obstacles)
    const obstacleCount = 35;
    for (let i = 0; i < obstacleCount; i++) {
      const pos = GridHelper.getRandomGridPosition(this.obstacles);
      this.obstacles.push({
        x: pos.x,
        y: pos.y,
        graphic: this.createCaveRock(scene, pos.x, pos.y),
      });
    }

    // Place torches around the cave (light sources)
    const torchCount = 6;
    for (let i = 0; i < torchCount; i++) {
      const pos = GridHelper.getRandomGridPosition([
        ...this.obstacles,
        ...this.torches,
      ]);
      const pixelPos = GridHelper.gridToPixel(pos.x, pos.y);

      // Torch base
      const torchBase = scene.add.rectangle(
        pixelPos.x,
        pixelPos.y,
        GameConfig.CELL_SIZE - 4,
        GameConfig.CELL_SIZE - 4,
        0x8b4513
      );

      // Flame
      const flame = scene.add.circle(
        pixelPos.x,
        pixelPos.y - 8,
        6,
        0xff6600,
        1
      );

      // Flame glow
      const glow = scene.add.circle(
        pixelPos.x,
        pixelPos.y - 8,
        12,
        0xff6600,
        0.3
      );

      // Flickering animation
      scene.tweens.add({
        targets: [flame, glow],
        alpha: { from: 0.7, to: 1 },
        scale: { from: 0.9, to: 1.1 },
        duration: 200 + Math.random() * 200,
        yoyo: true,
        repeat: -1,
      });

      this.torches.push({
        x: pos.x,
        y: pos.y,
        base: torchBase,
        flame: flame,
        glow: glow,
      });
    }

    // Add treasure chests (bonus visual elements)
    const treasureCount = 3;
    for (let i = 0; i < treasureCount; i++) {
      const pos = GridHelper.getRandomGridPosition([
        ...this.obstacles,
        ...this.torches,
        ...this.treasures,
      ]);
      const pixelPos = GridHelper.gridToPixel(pos.x, pos.y);

      // Chest
      const chest = scene.add.rectangle(
        pixelPos.x,
        pixelPos.y,
        GameConfig.CELL_SIZE - 2,
        GameConfig.CELL_SIZE - 2,
        0xdaa520
      );

      // Sparkle effect
      const sparkle = scene.add.circle(
        pixelPos.x,
        pixelPos.y - 8,
        3,
        0xffff00,
        0.8
      );

      scene.tweens.add({
        targets: sparkle,
        alpha: { from: 0.3, to: 1 },
        scale: { from: 0.5, to: 1.2 },
        duration: 800,
        yoyo: true,
        repeat: -1,
      });

      this.treasures.push({
        x: pos.x,
        y: pos.y,
        chest: chest,
        sparkle: sparkle,
      });
    }

    // Create atmospheric darkness overlay (lighter for better visibility)
    this.darknessLayer = scene.add.rectangle(
      GameConfig.GAME_WIDTH / 2,
      GameConfig.GAME_HEIGHT / 2,
      GameConfig.GAME_WIDTH,
      GameConfig.GAME_HEIGHT,
      0x0a0a1a,
      0.7
    );
    this.darknessLayer.setDepth(100);

    // Add mysterious fog effect
    this.fogParticles = [];
    for (let i = 0; i < 15; i++) {
      const fog = scene.add.circle(
        Math.random() * GameConfig.GAME_WIDTH,
        Math.random() * GameConfig.GAME_HEIGHT,
        20 + Math.random() * 30,
        0x888888,
        0.1
      );
      fog.setDepth(98);

      scene.tweens.add({
        targets: fog,
        x: fog.x + (Math.random() - 0.5) * 100,
        y: fog.y + (Math.random() - 0.5) * 100,
        alpha: { from: 0.05, to: 0.15 },
        duration: 3000 + Math.random() * 2000,
        yoyo: true,
        repeat: -1,
      });

      this.fogParticles.push(fog);
    }
  }

  createCaveRock(scene, gridX, gridY) {
    const pos = GridHelper.gridToPixel(gridX, gridY);
    const graphics = scene.add.graphics();

    // Rocky texture with irregular shape
    graphics.fillStyle(0x4a4a4a, 1);
    graphics.fillRoundedRect(pos.x - 9, pos.y - 9, 18, 18, 3);

    // Darker shading
    graphics.fillStyle(0x2a2a2a, 0.5);
    graphics.fillRoundedRect(pos.x - 9, pos.y - 5, 18, 10, 2);

    // Highlight
    graphics.fillStyle(0x6a6a6a, 0.4);
    graphics.fillCircle(pos.x - 4, pos.y - 4, 3);

    return graphics;
  }

  updateDarkness(scene, snakeHead) {
    // Create adventurous light around snake (like a lantern)
    if (this.lightCircle) {
      this.lightCircle.destroy();
    }
    if (this.lightGlow) {
      this.lightGlow.destroy();
    }

    const pos = GridHelper.gridToPixel(snakeHead.x, snakeHead.y);

    // Main light (brighter and larger)
    this.lightCircle = scene.add.circle(
      pos.x,
      pos.y,
      GameConfig.CELL_SIZE * 6,
      0xffcc66,
      0.5
    );
    this.lightCircle.setDepth(99);

    // Outer glow (brighter)
    this.lightGlow = scene.add.circle(
      pos.x,
      pos.y,
      GameConfig.CELL_SIZE * 8,
      0xffaa44,
      0.25
    );
    this.lightGlow.setDepth(99);

    // Flickering lantern effect
    scene.tweens.add({
      targets: [this.lightCircle, this.lightGlow],
      alpha: {
        from: this.lightCircle.alpha * 0.9,
        to: this.lightCircle.alpha * 1.1,
      },
      duration: 150,
      yoyo: true,
      repeat: 0,
    });
  }
}
