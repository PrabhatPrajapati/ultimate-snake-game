// Level 2 - Wall Corners (Blocks in four corners, slightly faster)
class Level2 extends BaseLevel {
  constructor() {
    super("Wall Corners", "Avoid the corner obstacles");
    this.speedMultiplier = 1.1;
  }

  initialize(scene) {
    this.obstacles = [];
    this.portals = [];

    const maxX = Math.floor(GameConfig.GAME_WIDTH / GameConfig.CELL_SIZE);
    const maxY = Math.floor(GameConfig.GAME_HEIGHT / GameConfig.CELL_SIZE);
    const size = 3; // 3x3 blocks in each corner

    // Top-left corner
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        this.obstacles.push({
          x,
          y,
          graphic: this.createObstacle(scene, x, y),
        });
      }
    }

    // Top-right corner
    for (let x = maxX - size; x < maxX; x++) {
      for (let y = 0; y < size; y++) {
        this.obstacles.push({
          x,
          y,
          graphic: this.createObstacle(scene, x, y),
        });
      }
    }

    // Bottom-left corner
    for (let x = 0; x < size; x++) {
      for (let y = maxY - size; y < maxY; y++) {
        this.obstacles.push({
          x,
          y,
          graphic: this.createObstacle(scene, x, y),
        });
      }
    }

    // Bottom-right corner
    for (let x = maxX - size; x < maxX; x++) {
      for (let y = maxY - size; y < maxY; y++) {
        this.obstacles.push({
          x,
          y,
          graphic: this.createObstacle(scene, x, y),
        });
      }
    }
  }
}
