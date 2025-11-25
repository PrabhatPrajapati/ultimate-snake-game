// Level Manager - Handles level configurations and progression
class LevelManager {
  constructor() {
    this.currentLevel = 1;
    this.levels = {
      1: new Level1(),
      2: new Level2(),
      3: new Level3(),
      4: new Level4(),
      5: new Level5(),
      6: new Level6(),
      7: new Level7(),
      8: new Level8(),
      9: new Level9(),
      10: new Level10(),
    };
  }

  getCurrentLevel() {
    return this.levels[this.currentLevel];
  }

  setLevel(levelNumber) {
    if (levelNumber >= 1 && levelNumber <= 10) {
      this.currentLevel = levelNumber;
      return true;
    }
    return false;
  }

  nextLevel() {
    if (this.currentLevel < 10) {
      this.currentLevel++;
      return true;
    }
    return false;
  }

  getLevelNumber() {
    return this.currentLevel;
  }

  reset() {
    this.currentLevel = 1;
  }
}

// Base Level Class
class BaseLevel {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.obstacles = [];
    this.portals = [];
    this.speedMultiplier = 1.0;
    this.darkMode = false;
    this.hasAI = false;
    this.isBossLevel = false;
  }

  initialize(scene) {
    // Override in subclasses
    this.obstacles = [];
    this.portals = [];
  }

  getObstacles() {
    return this.obstacles;
  }

  getPortals() {
    return this.portals;
  }

  createObstacle(scene, x, y) {
    const pos = GridHelper.gridToPixel(x, y);
    const wall = scene.add.rectangle(
      pos.x,
      pos.y,
      GameConfig.CELL_SIZE - 1,
      GameConfig.CELL_SIZE - 1,
      GameConfig.COLORS.WALL
    );
    wall.setStrokeStyle(1, 0x000000);
    return wall;
  }

  createPortal(scene, x, y, color) {
    const pos = GridHelper.gridToPixel(x, y);
    const portal = scene.add.circle(
      pos.x,
      pos.y,
      GameConfig.CELL_SIZE / 2,
      color
    );

    // Pulsing animation
    scene.tweens.add({
      targets: portal,
      alpha: { from: 0.5, to: 1 },
      scale: { from: 0.9, to: 1.1 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });

    return portal;
  }
}
