// Level 6 - Tiny Grid (Very small play area, high difficulty)
class Level6 extends BaseLevel {
  constructor() {
    super("Tiny Grid", "Limited space - Expert mode!");
    this.speedMultiplier = 1.5;
  }

  initialize(scene) {
    this.obstacles = [];
    this.portals = [];

    const maxX = Math.floor(GameConfig.GAME_WIDTH / GameConfig.CELL_SIZE);
    const maxY = Math.floor(GameConfig.GAME_HEIGHT / GameConfig.CELL_SIZE);

    // Create walls to make a smaller play area (center box)
    const borderSize = 8;

    // Top and bottom borders
    for (let x = 0; x < maxX; x++) {
      for (let y = 0; y < borderSize; y++) {
        this.obstacles.push({
          x,
          y,
          graphic: this.createObstacle(scene, x, y),
        });
      }
      for (let y = maxY - borderSize; y < maxY; y++) {
        this.obstacles.push({
          x,
          y,
          graphic: this.createObstacle(scene, x, y),
        });
      }
    }

    // Left and right borders
    for (let y = borderSize; y < maxY - borderSize; y++) {
      for (let x = 0; x < borderSize; x++) {
        this.obstacles.push({
          x,
          y,
          graphic: this.createObstacle(scene, x, y),
        });
      }
      for (let x = maxX - borderSize; x < maxX; x++) {
        this.obstacles.push({
          x,
          y,
          graphic: this.createObstacle(scene, x, y),
        });
      }
    }
  }
}
