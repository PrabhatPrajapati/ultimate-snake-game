// Level 1 - Classic (No walls, slow snake, perfect for beginners)
class Level1 extends BaseLevel {
  constructor() {
    super("Classic", "No obstacles - Learn the basics");
    this.speedMultiplier = 1.0;
  }

  initialize(scene) {
    this.obstacles = [];
    this.portals = [];
    // No obstacles in classic mode
  }
}
