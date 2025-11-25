// Grid Helper - Utilities for grid-based positioning
class GridHelper {
  static gridToPixel(gridX, gridY) {
    return {
      x: gridX * GameConfig.CELL_SIZE + GameConfig.CELL_SIZE / 2,
      y: gridY * GameConfig.CELL_SIZE + GameConfig.CELL_SIZE / 2,
    };
  }

  static pixelToGrid(x, y) {
    return {
      x: Math.floor(x / GameConfig.CELL_SIZE),
      y: Math.floor(y / GameConfig.CELL_SIZE),
    };
  }

  static getRandomGridPosition(excludePositions = []) {
    const maxX = Math.floor(GameConfig.GAME_WIDTH / GameConfig.CELL_SIZE);
    const maxY = Math.floor(GameConfig.GAME_HEIGHT / GameConfig.CELL_SIZE);

    let position;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      position = {
        x: Phaser.Math.Between(0, maxX - 1),
        y: Phaser.Math.Between(0, maxY - 1),
      };
      attempts++;
    } while (
      attempts < maxAttempts &&
      excludePositions.some(
        (pos) => pos.x === position.x && pos.y === position.y
      )
    );

    return position;
  }

  static isPositionValid(x, y, obstacles = []) {
    const maxX = Math.floor(GameConfig.GAME_WIDTH / GameConfig.CELL_SIZE);
    const maxY = Math.floor(GameConfig.GAME_HEIGHT / GameConfig.CELL_SIZE);

    // Check boundaries
    if (x < 0 || x >= maxX || y < 0 || y >= maxY) {
      return false;
    }

    // Check obstacles
    return !obstacles.some((obs) => obs.x === x && obs.y === y);
  }

  static getDistance(pos1, pos2) {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
  }
}
