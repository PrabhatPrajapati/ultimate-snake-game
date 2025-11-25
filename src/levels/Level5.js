// Level 5 - Diamond Box (Random moving obstacles)
class Level5 extends BaseLevel {
  constructor() {
    super("Diamond Box", "Watch out for moving obstacles!");
    this.speedMultiplier = 1.4;
    this.movingObstacles = [];
  }

  initialize(scene) {
    this.obstacles = [];
    this.portals = [];
    this.movingObstacles = [];

    const maxX = Math.floor(GameConfig.GAME_WIDTH / GameConfig.CELL_SIZE);
    const maxY = Math.floor(GameConfig.GAME_HEIGHT / GameConfig.CELL_SIZE);
    const centerX = Math.floor(maxX / 2);
    const centerY = Math.floor(maxY / 2);

    // Create diamond border
    const size = Math.min(maxX, maxY) / 3;

    for (let i = 0; i < size; i++) {
      // Top edges
      this.obstacles.push({
        x: centerX - i,
        y: centerY - size + i,
        graphic: this.createObstacle(scene, centerX - i, centerY - size + i),
      });
      this.obstacles.push({
        x: centerX + i,
        y: centerY - size + i,
        graphic: this.createObstacle(scene, centerX + i, centerY - size + i),
      });

      // Bottom edges
      this.obstacles.push({
        x: centerX - i,
        y: centerY + size - i,
        graphic: this.createObstacle(scene, centerX - i, centerY + size - i),
      });
      this.obstacles.push({
        x: centerX + i,
        y: centerY + size - i,
        graphic: this.createObstacle(scene, centerX + i, centerY + size - i),
      });
    }

    // Add 3 moving obstacles
    for (let i = 0; i < 3; i++) {
      const pos = GridHelper.getRandomGridPosition(this.obstacles);
      const pixelPos = GridHelper.gridToPixel(pos.x, pos.y);
      const obstacle = scene.add.rectangle(
        pixelPos.x,
        pixelPos.y,
        GameConfig.CELL_SIZE - 1,
        GameConfig.CELL_SIZE - 1,
        0xff0000
      );
      obstacle.setStrokeStyle(2, 0xffffff);

      this.movingObstacles.push({
        x: pos.x,
        y: pos.y,
        graphic: obstacle,
        vx: Phaser.Math.Between(-1, 1),
        vy: Phaser.Math.Between(-1, 1),
      });
    }
  }

  updateMovingObstacles() {
    const maxX = Math.floor(GameConfig.GAME_WIDTH / GameConfig.CELL_SIZE);
    const maxY = Math.floor(GameConfig.GAME_HEIGHT / GameConfig.CELL_SIZE);

    this.movingObstacles.forEach((obs) => {
      // Update position
      obs.x += obs.vx;
      obs.y += obs.vy;

      // Bounce off walls
      if (obs.x <= 0 || obs.x >= maxX - 1) {
        obs.vx *= -1;
        obs.x = Phaser.Math.Clamp(obs.x, 0, maxX - 1);
      }
      if (obs.y <= 0 || obs.y >= maxY - 1) {
        obs.vy *= -1;
        obs.y = Phaser.Math.Clamp(obs.y, 0, maxY - 1);
      }

      // Update graphic
      const pixelPos = GridHelper.gridToPixel(obs.x, obs.y);
      obs.graphic.setPosition(pixelPos.x, pixelPos.y);
    });
  }

  getObstacles() {
    return [...this.obstacles, ...this.movingObstacles];
  }
}
