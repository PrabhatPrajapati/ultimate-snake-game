// Level 7 - Teleport Portals (Blue and orange portals)
class Level7 extends BaseLevel {
  constructor() {
    super("Teleport Portals", "Use portals to teleport!");
    this.speedMultiplier = 1.3;
  }

  initialize(scene) {
    this.obstacles = [];
    this.portals = [];

    const maxX = Math.floor(GameConfig.GAME_WIDTH / GameConfig.CELL_SIZE);
    const maxY = Math.floor(GameConfig.GAME_HEIGHT / GameConfig.CELL_SIZE);

    // Create some obstacles
    const centerX = Math.floor(maxX / 2);
    const centerY = Math.floor(maxY / 2);

    // Center vertical wall
    for (let y = centerY - 5; y <= centerY + 5; y++) {
      if (y !== centerY) {
        // Leave gap in center
        this.obstacles.push({
          x: centerX,
          y,
          graphic: this.createObstacle(scene, centerX, y),
        });
      }
    }

    // Create blue portal (left side)
    const bluePos = { x: Math.floor(maxX * 0.25), y: centerY };
    const blueGraphic = this.createPortal(
      scene,
      bluePos.x,
      bluePos.y,
      GameConfig.COLORS.PORTAL_BLUE
    );

    // Create orange portal (right side)
    const orangePos = { x: Math.floor(maxX * 0.75), y: centerY };
    const orangeGraphic = this.createPortal(
      scene,
      orangePos.x,
      orangePos.y,
      GameConfig.COLORS.PORTAL_ORANGE
    );

    this.portals = [
      { x: bluePos.x, y: bluePos.y, graphic: blueGraphic, linkedTo: 1 },
      { x: orangePos.x, y: orangePos.y, graphic: orangeGraphic, linkedTo: 0 },
    ];
  }

  checkPortalCollision(snakeHead) {
    for (let i = 0; i < this.portals.length; i++) {
      const portal = this.portals[i];
      if (snakeHead.x === portal.x && snakeHead.y === portal.y) {
        const targetPortal = this.portals[portal.linkedTo];
        return { x: targetPortal.x, y: targetPortal.y };
      }
    }
    return null;
  }
}
