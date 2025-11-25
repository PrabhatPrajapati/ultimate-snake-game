// Level 4 - Spiral Arena (Spiral wall structure)
class Level4 extends BaseLevel {
  constructor() {
    super("Spiral Arena", "Follow the spiral path");
    this.speedMultiplier = 1.3;
  }

  initialize(scene) {
    this.obstacles = [];
    this.portals = [];

    const maxX = Math.floor(GameConfig.GAME_WIDTH / GameConfig.CELL_SIZE);
    const maxY = Math.floor(GameConfig.GAME_HEIGHT / GameConfig.CELL_SIZE);

    // Create spiral pattern
    let x = Math.floor(maxX / 2);
    let y = Math.floor(maxY / 2);
    let dx = 0;
    let dy = -1;
    let segmentLength = 1;
    let segmentPassed = 0;
    let spiralSize = Math.min(maxX, maxY) / 2;

    for (let i = 0; i < spiralSize * 4; i++) {
      if (x >= 0 && x < maxX && y >= 0 && y < maxY) {
        this.obstacles.push({
          x,
          y,
          graphic: this.createObstacle(scene, x, y),
        });
      }

      x += dx;
      y += dy;
      segmentPassed++;

      if (segmentPassed === segmentLength) {
        segmentPassed = 0;
        const temp = dx;
        dx = -dy;
        dy = temp;

        if (dy === 0) {
          segmentLength++;
        }
      }
    }
  }
}
