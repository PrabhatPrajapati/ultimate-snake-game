// Level 10 - Boss Level (Survive 90 seconds with giant moving blocks)
class Level10 extends BaseLevel {
  constructor() {
    super("Boss Level", "Survive 90 seconds!");
    this.speedMultiplier = 1.6;
    this.isBossLevel = true;
    this.bossTimer = GameConfig.BOSS_DURATION;
    this.bossObstacles = [];
  }

  initialize(scene) {
    this.obstacles = [];
    this.portals = [];
    this.bossObstacles = [];

    const maxX = Math.floor(GameConfig.GAME_WIDTH / GameConfig.CELL_SIZE);
    const maxY = Math.floor(GameConfig.GAME_HEIGHT / GameConfig.CELL_SIZE);

    // Create border walls
    for (let x = 0; x < maxX; x++) {
      this.obstacles.push({
        x,
        y: 0,
        graphic: this.createObstacle(scene, x, 0),
      });
      this.obstacles.push({
        x,
        y: maxY - 1,
        graphic: this.createObstacle(scene, x, maxY - 1),
      });
    }
    for (let y = 1; y < maxY - 1; y++) {
      this.obstacles.push({
        x: 0,
        y,
        graphic: this.createObstacle(scene, 0, y),
      });
      this.obstacles.push({
        x: maxX - 1,
        y,
        graphic: this.createObstacle(scene, maxX - 1, y),
      });
    }

    // Create giant moving obstacles (3x3 blocks)
    for (let i = 0; i < GameConfig.BOSS_OBSTACLE_COUNT; i++) {
      const centerPos = GridHelper.getRandomGridPosition([
        ...this.obstacles,
        ...this.bossObstacles,
      ]);
      const graphics = [];

      // Create 3x3 block
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const x = centerPos.x + dx;
          const y = centerPos.y + dy;
          const pixelPos = GridHelper.gridToPixel(x, y);
          const block = scene.add.rectangle(
            pixelPos.x,
            pixelPos.y,
            GameConfig.CELL_SIZE - 1,
            GameConfig.CELL_SIZE - 1,
            0xff00ff
          );
          block.setStrokeStyle(2, 0xffffff);
          graphics.push({ x, y, graphic: block });
        }
      }

      this.bossObstacles.push({
        centerX: centerPos.x,
        centerY: centerPos.y,
        vx: Phaser.Math.Between(-1, 1) || 1,
        vy: Phaser.Math.Between(-1, 1) || 1,
        graphics: graphics,
      });
    }
  }

  updateBossObstacles(deltaTime) {
    const maxX = Math.floor(GameConfig.GAME_WIDTH / GameConfig.CELL_SIZE);
    const maxY = Math.floor(GameConfig.GAME_HEIGHT / GameConfig.CELL_SIZE);

    this.bossObstacles.forEach((boss) => {
      // Update position
      boss.centerX +=
        boss.vx * GameConfig.BOSS_OBSTACLE_SPEED * (deltaTime / 1000);
      boss.centerY +=
        boss.vy * GameConfig.BOSS_OBSTACLE_SPEED * (deltaTime / 1000);

      // Bounce off walls (with padding for 3x3 size)
      if (boss.centerX <= 2 || boss.centerX >= maxX - 3) {
        boss.vx *= -1;
        boss.centerX = Phaser.Math.Clamp(boss.centerX, 2, maxX - 3);
      }
      if (boss.centerY <= 2 || boss.centerY >= maxY - 3) {
        boss.vy *= -1;
        boss.centerY = Phaser.Math.Clamp(boss.centerY, 2, maxY - 3);
      }

      // Update graphics
      boss.graphics.forEach((block, index) => {
        const dx = (index % 3) - 1;
        const dy = Math.floor(index / 3) - 1;
        block.x = Math.floor(boss.centerX + dx);
        block.y = Math.floor(boss.centerY + dy);

        const pixelPos = GridHelper.gridToPixel(block.x, block.y);
        block.graphic.setPosition(pixelPos.x, pixelPos.y);
      });
    });
  }

  getObstacles() {
    const allObstacles = [...this.obstacles];
    this.bossObstacles.forEach((boss) => {
      boss.graphics.forEach((block) => {
        allObstacles.push(block);
      });
    });
    return allObstacles;
  }

  updateTimer(deltaTime) {
    this.bossTimer -= deltaTime / 1000;
    return this.bossTimer;
  }
}
