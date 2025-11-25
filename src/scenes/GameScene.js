// Game Scene - Main gameplay
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  init(data) {
    this.gameMode = data.gameMode || "endless";
    this.startLevel = data.startLevel || 1;
  }

  create() {
    // Initialize game state
    this.setupGameState();
    this.setupLevel();
    this.setupEntities();
    this.setupUI();
    this.setupInput();

    // Start game loop
    this.startGameLoop();
  }

  setupGameState() {
    this.scoreManager = new ScoreManager();
    this.levelManager = new LevelManager();
    this.levelManager.setLevel(this.startLevel);

    this.currentSpeed = GameConfig.BASE_SPEED;
    this.moveTimer = 0;
    this.gameOver = false;
    this.isPaused = false;

    // Apply mode settings
    const modeSettings = GameConfig.MODE_SETTINGS[this.gameMode];
    this.currentSpeed /= modeSettings.speedMultiplier;
    this.enableSpeedIncrease = modeSettings.enableSpeedIncrease;

    // Time Attack specific
    if (this.gameMode === "timeAttack") {
      this.timeRemaining = GameConfig.TIME_ATTACK_DURATION;
      this.foodTarget = GameConfig.TIME_ATTACK_FOOD_TARGET;
    }

    // Boss level timer
    this.bossTimer = null;
  }

  setupLevel() {
    // Background with gradient
    const bgGraphics = this.add.graphics();
    bgGraphics.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x0f0f1e, 0x0f0f1e, 1);
    bgGraphics.fillRect(0, 0, GameConfig.GAME_WIDTH, GameConfig.GAME_HEIGHT);

    // Grid
    this.drawGrid();

    // Initialize level
    this.currentLevel = this.levelManager.getCurrentLevel();
    this.currentLevel.initialize(this);

    // Apply level speed multiplier
    this.currentSpeed /= this.currentLevel.speedMultiplier;
  }

  drawGrid() {
    const graphics = this.add.graphics();

    // Draw subtle grid with alternating opacity
    for (let x = 0; x < GameConfig.GAME_WIDTH; x += GameConfig.CELL_SIZE) {
      const opacity = (x / GameConfig.CELL_SIZE) % 2 === 0 ? 0.15 : 0.1;
      graphics.lineStyle(1, GameConfig.COLORS.GRID_LINE, opacity);
      graphics.lineBetween(x, 0, x, GameConfig.GAME_HEIGHT);
    }
    for (let y = 0; y < GameConfig.GAME_HEIGHT; y += GameConfig.CELL_SIZE) {
      const opacity = (y / GameConfig.CELL_SIZE) % 2 === 0 ? 0.15 : 0.1;
      graphics.lineStyle(1, GameConfig.COLORS.GRID_LINE, opacity);
      graphics.lineBetween(0, y, GameConfig.GAME_WIDTH, y);
    }

    // Add subtle checkerboard pattern
    graphics.fillStyle(0x000000, 0.05);
    for (let x = 0; x < GameConfig.GAME_WIDTH; x += GameConfig.CELL_SIZE * 2) {
      for (
        let y = 0;
        y < GameConfig.GAME_HEIGHT;
        y += GameConfig.CELL_SIZE * 2
      ) {
        graphics.fillRect(x, y, GameConfig.CELL_SIZE, GameConfig.CELL_SIZE);
        graphics.fillRect(
          x + GameConfig.CELL_SIZE,
          y + GameConfig.CELL_SIZE,
          GameConfig.CELL_SIZE,
          GameConfig.CELL_SIZE
        );
      }
    }
  }

  setupEntities() {
    const maxX = Math.floor(GameConfig.GAME_WIDTH / GameConfig.CELL_SIZE);
    const maxY = Math.floor(GameConfig.GAME_HEIGHT / GameConfig.CELL_SIZE);

    // Create player snake
    this.snake = new Snake(this, Math.floor(maxX / 2), Math.floor(maxY / 2));

    // Create AI snake if level requires it
    if (this.currentLevel.hasAI) {
      this.aiSnake = new AISnake(
        this,
        Math.floor(maxX / 4),
        Math.floor(maxY / 4)
      );
    } else {
      this.aiSnake = null;
    }

    // Create food manager
    this.food = new Food(this);
    // Spawn multiple fruits initially (2-3)
    this.spawnFood(true);
  }

  setupUI() {
    this.hud = new HUD(this);
    this.hud.create();
    this.updateHUD();

    this.pauseMenu = new PauseMenu(this);
    this.pauseMenu.create();
  }

  setupInput() {
    // Arrow keys
    this.cursors = this.input.keyboard.createCursorKeys();

    // WASD keys
    this.wasd = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    // Pause key (ESC)
    this.input.keyboard.on("keydown-ESC", () => {
      if (!this.gameOver) {
        this.pauseMenu.toggle();
        this.isPaused = !this.isPaused;
      }
    });
  }

  startGameLoop() {
    // Game loop runs in update()
  }

  update(time, delta) {
    if (this.gameOver || this.isPaused) return;

    // Handle input
    this.handleInput();

    // Update timers
    this.updateTimers(delta);

    // Move snake
    this.moveTimer += delta;

    // Calculate effective speed with power-up effects
    const effectiveSpeed = this.food.updateEffects(
      this.currentSpeed,
      Date.now()
    );

    if (this.moveTimer >= effectiveSpeed) {
      this.moveTimer = 0;

      // Update snake
      this.snake.update();

      // Update AI snake
      if (this.aiSnake && this.aiSnake.alive) {
        // Get first food position for AI targeting
        const foodPos =
          this.food.foods.length > 0 ? this.food.foods[0].gridPosition : null;
        this.aiSnake.updateAI(
          this.snake,
          foodPos,
          this.currentLevel.getObstacles(),
          delta
        );
        this.aiSnake.update();
      }

      // Check collisions
      this.checkCollisions();

      // Update level-specific mechanics
      this.updateLevelMechanics(delta);
    }

    // Update HUD
    this.updateHUD();
  }

  handleInput() {
    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      this.snake.setDirection(-1, 0);
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      this.snake.setDirection(1, 0);
    } else if (this.cursors.up.isDown || this.wasd.up.isDown) {
      this.snake.setDirection(0, -1);
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      this.snake.setDirection(0, 1);
    }
  }

  updateTimers(delta) {
    // Time Attack mode
    if (this.gameMode === "timeAttack") {
      this.timeRemaining -= delta / 1000;
      if (this.timeRemaining <= 0) {
        this.endGame(false); // Time's up
      }
    }

    // Boss level timer
    if (this.currentLevel.isBossLevel) {
      const remaining = this.currentLevel.updateTimer(delta);
      if (remaining <= 0) {
        // Victory! Survived boss level
        this.scoreManager.addLevelBonus(true);
        this.nextLevel();
      }
    }
  }

  updateLevelMechanics(delta) {
    // Update moving obstacles (Level 5)
    if (this.currentLevel.updateMovingObstacles) {
      this.currentLevel.updateMovingObstacles();
    }

    // Update boss obstacles (Level 10)
    if (this.currentLevel.updateBossObstacles) {
      this.currentLevel.updateBossObstacles(delta);
    }

    // Update dark mode lighting (Level 9)
    if (this.currentLevel.darkMode && this.currentLevel.updateDarkness) {
      this.currentLevel.updateDarkness(this, this.snake.getHead());
    }
  }

  checkCollisions() {
    const head = this.snake.getHead();

    // Check wall collision
    if (this.snake.checkWallCollision()) {
      this.endGame(false);
      return;
    }

    // Check self collision
    if (this.snake.checkSelfCollision()) {
      this.endGame(false);
      return;
    }

    // Check obstacle collision
    if (this.snake.checkObstacleCollision(this.currentLevel.getObstacles())) {
      this.endGame(false);
      return;
    }

    // Check portal collision (Level 7)
    if (this.currentLevel.checkPortalCollision) {
      const teleportPos = this.currentLevel.checkPortalCollision(head);
      if (teleportPos) {
        // Teleport snake
        this.snake.body[0] = { ...teleportPos };
      }
    }

    // Check AI snake collision
    if (this.aiSnake && this.aiSnake.alive) {
      // Check if player hits AI
      if (this.snake.checkCollisionWith(this.aiSnake)) {
        this.endGame(false);
        return;
      }

      // Check if AI hits player or itself
      if (
        this.aiSnake.checkCollisionWith(this.snake) ||
        this.aiSnake.checkSelfCollision() ||
        this.aiSnake.checkWallCollision() ||
        this.aiSnake.checkObstacleCollision(this.currentLevel.getObstacles())
      ) {
        // AI dies, player gets bonus
        this.aiSnake.destroy();
        this.scoreManager.score += 5;
      }
    }

    // Check food collision
    const collidedFood = this.food.checkCollision(head);
    if (collidedFood) {
      this.eatFood(collidedFood);
    }
  }

  eatFood(food) {
    const foodData = this.food.consume(food);

    // Add score
    const earnedScore = this.scoreManager.addFoodScore(
      foodData.type,
      Date.now()
    );

    // Grow or shrink snake
    if (foodData.growth > 0) {
      this.snake.grow(foodData.growth);
    } else if (foodData.growth < 0) {
      this.snake.shrink(Math.abs(foodData.growth));
    }

    // Apply power-up effect
    if (foodData.effect) {
      this.currentSpeed = this.food.applyEffect(
        foodData.effect,
        this.currentSpeed
      );
    }

    // Increase speed (if enabled)
    if (this.enableSpeedIncrease && foodData.score > 0) {
      this.currentSpeed = Math.max(
        GameConfig.MIN_SPEED,
        this.currentSpeed - GameConfig.SPEED_INCREASE_PER_FOOD
      );
    }

    // Check Time Attack goal
    if (
      this.gameMode === "timeAttack" &&
      this.scoreManager.getFoodEaten() >= this.foodTarget
    ) {
      // Victory!
      this.scoreManager.addLevelBonus(true);
      this.endGame(true);
      return;
    }

    // Spawn new food to maintain count
    this.spawnFood(false);

    // Visual feedback
    this.showScorePopup(earnedScore);
  }

  spawnFood(initial = false) {
    const excludePositions = [
      ...this.snake.getBody(),
      ...this.currentLevel.getObstacles(),
    ];

    if (this.aiSnake && this.aiSnake.alive) {
      excludePositions.push(...this.aiSnake.getBody());
    }

    if (initial) {
      // Spawn 2-3 fruits at game start
      this.food.spawnMultiple(excludePositions, 2);
    } else {
      // Spawn 1 fruit to maintain count
      this.food.spawn(excludePositions);
    }
  }

  showScorePopup(score) {
    const head = this.snake.getHead();
    const pos = GridHelper.gridToPixel(head.x, head.y);

    const text = this.add
      .text(pos.x, pos.y, `+${score}`, {
        fontSize: "20px",
        fontFamily: "Arial",
        color: score > 1 ? "#ffff00" : "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: text,
      y: pos.y - 50,
      alpha: 0,
      duration: 1000,
      onComplete: () => text.destroy(),
    });
  }

  updateHUD() {
    this.hud.updateScore(
      this.scoreManager.getScore(),
      this.scoreManager.getHighScore()
    );
    this.hud.updateSpeed(this.currentSpeed, GameConfig.BASE_SPEED);
    this.hud.updateLevel(
      this.levelManager.getLevelNumber(),
      this.currentLevel.name
    );
    this.hud.updateCombo(this.scoreManager.getComboMultiplier());

    // Update effects display
    if (this.food.hasActiveEffects()) {
      this.hud.updateEffects(this.food.getActiveEffectTypes());
    } else {
      this.hud.updateEffects([]);
    }

    // Update timer for Time Attack
    if (this.gameMode === "timeAttack") {
      this.hud.updateTimer(this.timeRemaining);
    }

    // Update timer for Boss Level
    if (this.currentLevel.isBossLevel) {
      const remaining = this.currentLevel.bossTimer;
      this.hud.updateTimer(remaining);
    }
  }

  nextLevel() {
    if (this.levelManager.nextLevel()) {
      // Restart scene with next level
      this.scene.restart({
        gameMode: this.gameMode,
        startLevel: this.levelManager.getLevelNumber(),
      });
    } else {
      // Completed all levels!
      this.endGame(true);
    }
  }

  endGame(victory = false) {
    this.gameOver = true;

    const isNewHighScore =
      this.scoreManager.getScore() > this.scoreManager.loadHighScore();

    // Transition to game over scene
    this.time.delayedCall(500, () => {
      this.scene.start("GameOverScene", {
        score: this.scoreManager.getScore(),
        highScore: this.scoreManager.getHighScore(),
        isNewHighScore: isNewHighScore,
        gameMode: this.gameMode,
        level: this.levelManager.getLevelNumber(),
      });
    });
  }
}
