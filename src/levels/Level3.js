// Level 3 - Cross Maze (X-shaped wall pattern)
class Level3 extends BaseLevel {
  constructor() {
    super("Cross Maze", "Navigate the X-shaped obstacles");
    this.speedMultiplier = 1.2;
  }

  initialize(scene) {
    this.obstacles = [];
    this.portals = [];

    const maxX = Math.floor(GameConfig.GAME_WIDTH / GameConfig.CELL_SIZE);
    const maxY = Math.floor(GameConfig.GAME_HEIGHT / GameConfig.CELL_SIZE);
    const centerX = Math.floor(maxX / 2);
    const centerY = Math.floor(maxY / 2);

    // Create X pattern
    const length = Math.min(maxX, maxY) / 2;

    for (let i = 0; i < length; i++) {
      // Top-left to bottom-right diagonal
      const x1 = centerX - i;
      const y1 = centerY - i;
      if (x1 >= 0 && y1 >= 0) {
        this.obstacles.push({
          x: x1,
          y: y1,
          graphic: this.createObstacle(scene, x1, y1),
        });
      }

      const x2 = centerX + i;
      const y2 = centerY + i;
      if (x2 < maxX && y2 < maxY) {
        this.obstacles.push({
          x: x2,
          y: y2,
          graphic: this.createObstacle(scene, x2, y2),
        });
      }

      // Top-right to bottom-left diagonal
      const x3 = centerX + i;
      const y3 = centerY - i;
      if (x3 < maxX && y3 >= 0) {
        this.obstacles.push({
          x: x3,
          y: y3,
          graphic: this.createObstacle(scene, x3, y3),
        });
      }

      const x4 = centerX - i;
      const y4 = centerY + i;
      if (x4 >= 0 && y4 < maxY) {
        this.obstacles.push({
          x: x4,
          y: y4,
          graphic: this.createObstacle(scene, x4, y4),
        });
      }
    }
  }
}
