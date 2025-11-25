// Food Manager - Handles all food types and spawning
class Food {
  constructor(scene) {
    this.scene = scene;
    this.foods = []; // Array of food objects
    this.normalFoodCount = 0; // Track for golden food spawning
    this.activeEffects = [];
    this.MAX_FOODS = 3; // Maximum number of fruits on screen
  }

  spawn(excludePositions = []) {
    // Don't spawn if we already have max foods
    if (this.foods.length >= this.MAX_FOODS) {
      return null;
    }

    // Determine food type
    const foodType = this.determineFoodType();

    // Get all current food positions to exclude
    const allExcluded = [
      ...excludePositions,
      ...this.foods.map((f) => f.gridPosition),
    ];

    // Get random position
    const position = GridHelper.getRandomGridPosition(allExcluded);
    const pixelPos = GridHelper.gridToPixel(position.x, position.y);

    // Create food visual with enhanced graphics
    const foodConfig = GameConfig.FOOD_TYPES[foodType];
    const foodVisuals = this.createFoodVisual(pixelPos, foodType, foodConfig);

    // Store food object
    const foodObject = {
      visual: foodVisuals.main,
      icon: foodVisuals.icon,
      extras: foodVisuals.extras || [],
      type: foodType,
      gridPosition: position,
    };

    this.foods.push(foodObject);

    return position;
  }

  createFoodVisual(pos, type, config) {
    const size = GameConfig.CELL_SIZE / 2 - 2;
    const visuals = { extras: [] };

    // Create shadow
    const shadow = this.scene.add.circle(
      pos.x + 1,
      pos.y + 1,
      size,
      0x000000,
      0.3
    );
    visuals.extras.push(shadow);

    // Create main food graphics
    const graphics = this.scene.add.graphics();

    switch (type) {
      case "NORMAL":
        // Apple - red with gradient
        graphics.fillStyle(config.color, 1);
        graphics.fillCircle(pos.x, pos.y, size);

        // Highlight
        graphics.fillStyle(0xff6666, 0.6);
        graphics.fillCircle(pos.x - 2, pos.y - 2, size / 2);

        // Shine spot
        graphics.fillStyle(0xffffff, 0.8);
        graphics.fillCircle(pos.x - 3, pos.y - 3, 2);

        // Stem
        const stem = this.scene.add.graphics();
        stem.lineStyle(2, 0x8b4513, 1);
        stem.lineBetween(pos.x, pos.y - size, pos.x + 2, pos.y - size - 3);
        visuals.extras.push(stem);
        break;

      case "GOLDEN":
        // Golden food with glow
        graphics.fillStyle(config.color, 1);
        graphics.fillCircle(pos.x, pos.y, size);

        // Inner glow
        graphics.fillStyle(0xffff00, 0.5);
        graphics.fillCircle(pos.x, pos.y, size - 2);

        // Highlight
        graphics.fillStyle(0xffffff, 0.7);
        graphics.fillCircle(pos.x - 2, pos.y - 2, size / 2);

        // Outer glow ring
        const glow = this.scene.add.circle(
          pos.x,
          pos.y,
          size + 2,
          config.color,
          0.3
        );
        visuals.extras.push(glow);

        // Pulsing animation
        this.scene.tweens.add({
          targets: [graphics, glow],
          scale: { from: 1, to: 1.2 },
          alpha: { from: 1, to: 0.7 },
          duration: 500,
          yoyo: true,
          repeat: -1,
        });
        break;

      case "BOMB":
        // Bomb with fuse
        graphics.fillStyle(config.color, 1);
        graphics.fillCircle(pos.x, pos.y, size);

        // Highlight
        graphics.fillStyle(0x555555, 0.5);
        graphics.fillCircle(pos.x - 2, pos.y - 2, size / 2);

        // Shine
        graphics.fillStyle(0xffffff, 0.3);
        graphics.fillCircle(pos.x - 3, pos.y - 3, 2);

        // Fuse
        const fuse = this.scene.add.graphics();
        fuse.lineStyle(2, 0x8b4513, 1);
        fuse.lineBetween(pos.x, pos.y - size, pos.x + 3, pos.y - size - 5);

        // Fuse spark
        const spark = this.scene.add.circle(
          pos.x + 3,
          pos.y - size - 5,
          2,
          0xff6600
        );
        this.scene.tweens.add({
          targets: spark,
          alpha: { from: 1, to: 0.3 },
          scale: { from: 1, to: 1.5 },
          duration: 300,
          yoyo: true,
          repeat: -1,
        });
        visuals.extras.push(fuse, spark);
        break;

      case "SPEED_BOOST":
        // Lightning bolt style
        graphics.fillStyle(config.color, 1);
        graphics.fillCircle(pos.x, pos.y, size);

        // Glow effect
        graphics.fillStyle(0x66b3ff, 0.5);
        graphics.fillCircle(pos.x, pos.y, size - 2);

        // Highlight
        graphics.fillStyle(0xffffff, 0.6);
        graphics.fillCircle(pos.x - 2, pos.y - 2, size / 2);

        // Electric glow
        const electricGlow = this.scene.add.circle(
          pos.x,
          pos.y,
          size + 3,
          0x0066ff,
          0.2
        );
        this.scene.tweens.add({
          targets: electricGlow,
          alpha: { from: 0.2, to: 0.5 },
          duration: 200,
          yoyo: true,
          repeat: -1,
        });
        visuals.extras.push(electricGlow);
        break;

      case "SLOW_TIME":
        // Clock style
        graphics.fillStyle(config.color, 1);
        graphics.fillCircle(pos.x, pos.y, size);

        // Inner circle
        graphics.fillStyle(0x00cc00, 0.7);
        graphics.fillCircle(pos.x, pos.y, size - 2);

        // Highlight
        graphics.fillStyle(0xffffff, 0.5);
        graphics.fillCircle(pos.x - 2, pos.y - 2, size / 2);

        // Glow pulse
        const timeGlow = this.scene.add.circle(
          pos.x,
          pos.y,
          size + 2,
          0x00ff00,
          0.3
        );
        this.scene.tweens.add({
          targets: timeGlow,
          scale: { from: 1, to: 1.3 },
          alpha: { from: 0.3, to: 0 },
          duration: 800,
          yoyo: true,
          repeat: -1,
        });
        visuals.extras.push(timeGlow);
        break;
    }

    visuals.main = graphics;

    // Add icon/symbol based on type
    visuals.icon = this.addFoodIcon(pos, type);

    return visuals;
  }

  // Spawn multiple fruits to maintain minimum count
  spawnMultiple(excludePositions = [], count = 2) {
    const spawned = [];
    for (let i = 0; i < count && this.foods.length < this.MAX_FOODS; i++) {
      const pos = this.spawn(excludePositions);
      if (pos) {
        spawned.push(pos);
      }
    }
    return spawned;
  }

  addFoodIcon(pos, type) {
    let icon;

    switch (type) {
      case "GOLDEN":
        icon = this.scene.add
          .text(pos.x, pos.y, "★", {
            fontSize: "16px",
            color: "#ffffff",
          })
          .setOrigin(0.5);
        break;
      case "BOMB":
        icon = this.scene.add
          .text(pos.x, pos.y, "💣", {
            fontSize: "14px",
          })
          .setOrigin(0.5);
        break;
      case "SPEED_BOOST":
        icon = this.scene.add
          .text(pos.x, pos.y, "⚡", {
            fontSize: "14px",
          })
          .setOrigin(0.5);
        break;
      case "SLOW_TIME":
        icon = this.scene.add
          .text(pos.x, pos.y, "⏱", {
            fontSize: "14px",
          })
          .setOrigin(0.5);
        break;
      default:
        // Normal apple - no icon needed
        break;
    }

    return icon;
  }

  determineFoodType() {
    // Check if golden food should spawn
    if (
      this.normalFoodCount >= GameConfig.FOOD_TYPES.GOLDEN.spawnInterval[0] &&
      this.normalFoodCount <= GameConfig.FOOD_TYPES.GOLDEN.spawnInterval[1]
    ) {
      this.normalFoodCount = 0;
      return "GOLDEN";
    }

    // Weighted random selection
    const weights = [];
    const types = [];

    Object.keys(GameConfig.FOOD_TYPES).forEach((type) => {
      if (type !== "GOLDEN") {
        // Golden is handled separately
        types.push(type);
        weights.push(GameConfig.FOOD_TYPES[type].weight);
      }
    });

    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < weights.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        const selectedType = types[i];
        if (selectedType === "NORMAL") {
          this.normalFoodCount++;
        }
        return selectedType;
      }
    }

    this.normalFoodCount++;
    return "NORMAL";
  }

  checkCollision(snakeHead) {
    for (let i = 0; i < this.foods.length; i++) {
      const food = this.foods[i];
      if (
        snakeHead.x === food.gridPosition.x &&
        snakeHead.y === food.gridPosition.y
      ) {
        return food; // Return the food object that was hit
      }
    }
    return null;
  }

  consume(food) {
    if (!food) return null;

    const config = GameConfig.FOOD_TYPES[food.type];

    // Find and remove from array
    const index = this.foods.indexOf(food);
    if (index > -1) {
      this.foods.splice(index, 1);
    }

    // Destroy food visuals
    if (food.icon) {
      food.icon.destroy();
    }
    if (food.visual) {
      food.visual.destroy();
    }
    if (food.extras && food.extras.length > 0) {
      food.extras.forEach((extra) => extra.destroy());
    }

    return {
      type: food.type,
      score: config.score,
      growth: config.growth,
      effect: config.effect || null,
    };
  }

  applyEffect(effect, currentSpeed) {
    if (!effect) return currentSpeed;

    const effectData = {
      type: effect.type,
      originalSpeed: currentSpeed,
      endTime: Date.now() + effect.duration,
      multiplier: effect.multiplier,
    };

    this.activeEffects.push(effectData);

    return currentSpeed * effect.multiplier;
  }

  updateEffects(currentSpeed, currentTime) {
    // Remove expired effects
    this.activeEffects = this.activeEffects.filter(
      (effect) => effect.endTime > currentTime
    );

    // Apply active effects
    let modifiedSpeed = currentSpeed;
    this.activeEffects.forEach((effect) => {
      if (effect.type === "speed") {
        modifiedSpeed *= effect.multiplier;
      } else if (effect.type === "slow") {
        modifiedSpeed *= effect.multiplier;
      }
    });

    return modifiedSpeed;
  }

  hasActiveEffects() {
    return this.activeEffects.length > 0;
  }

  getActiveEffectTypes() {
    return this.activeEffects.map((e) => e.type);
  }

  destroy() {
    this.foods.forEach((food) => {
      if (food.icon) {
        food.icon.destroy();
      }
      if (food.visual) {
        food.visual.destroy();
      }
      if (food.extras && food.extras.length > 0) {
        food.extras.forEach((extra) => extra.destroy());
      }
    });
    this.foods = [];
    this.activeEffects = [];
  }
}
