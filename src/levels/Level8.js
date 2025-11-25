// Level 8 - Enemy Snake (AI opponent)
class Level8 extends BaseLevel {
  constructor() {
    super("Enemy Snake", "Compete against AI snake!");
    this.speedMultiplier = 1.2;
    this.hasAI = true;
  }

  initialize(scene) {
    this.obstacles = [];
    this.portals = [];

    const maxX = Math.floor(GameConfig.GAME_WIDTH / GameConfig.CELL_SIZE);
    const maxY = Math.floor(GameConfig.GAME_HEIGHT / GameConfig.CELL_SIZE);

    // Add some obstacles to make it interesting
    const centerX = Math.floor(maxX / 2);
    const centerY = Math.floor(maxY / 2);

    // Horizontal bars
    for (let x = centerX - 8; x <= centerX + 8; x++) {
      if (Math.abs(x - centerX) > 2) {
        this.obstacles.push({
          x,
          y: centerY - 5,
          graphic: this.createObstacle(scene, x, centerY - 5),
        });
        this.obstacles.push({
          x,
          y: centerY + 5,
          graphic: this.createObstacle(scene, x, centerY + 5),
        });
      }
    }
  }
}
