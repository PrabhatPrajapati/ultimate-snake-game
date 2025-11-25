// Snake Entity - Main player snake
class Snake {
  constructor(scene, startX, startY, isAI = false) {
    this.scene = scene;
    this.isAI = isAI;

    // Snake body as grid positions
    this.body = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY },
    ];

    // Movement
    this.direction = { x: 1, y: 0 }; // Start moving right
    this.nextDirection = { x: 1, y: 0 };

    // Graphics
    this.graphics = [];
    this.headColor = isAI
      ? GameConfig.COLORS.SNAKE_AI
      : GameConfig.COLORS.SNAKE_HEAD;
    this.bodyColor = isAI
      ? Phaser.Display.Color.ValueToColor(GameConfig.COLORS.SNAKE_AI).darken(20)
          .color
      : GameConfig.COLORS.SNAKE_BODY;

    this.createGraphics();

    // State
    this.alive = true;
    this.growing = false;
  }

  createGraphics() {
    // Clear existing graphics
    this.graphics.forEach((g) => g.destroy());
    this.graphics = [];

    // Create graphics for each body segment with enhanced visuals
    this.body.forEach((segment, index) => {
      const pos = GridHelper.gridToPixel(segment.x, segment.y);
      const isHead = index === 0;
      const size = GameConfig.CELL_SIZE - 2;

      // Create rounded rectangle using graphics object for better control
      const graphics = this.scene.add.graphics();

      if (isHead) {
        // Head with gradient effect
        graphics.fillStyle(this.headColor, 1);
        graphics.fillRoundedRect(
          pos.x - size / 2,
          pos.y - size / 2,
          size,
          size,
          6
        );

        // Add highlight for 3D effect
        graphics.fillStyle(0xffffff, 0.3);
        graphics.fillRoundedRect(
          pos.x - size / 2 + 2,
          pos.y - size / 2 + 2,
          size - 8,
          size / 3,
          3
        );

        // Add border
        graphics.lineStyle(2, 0x000000, 0.3);
        graphics.strokeRoundedRect(
          pos.x - size / 2,
          pos.y - size / 2,
          size,
          size,
          6
        );
      } else {
        // Body segments with gradient
        const bodyShade = this.isAI
          ? Phaser.Display.Color.ValueToColor(this.bodyColor).darken(index * 2)
              .color
          : Phaser.Display.Color.ValueToColor(this.bodyColor).darken(
              index * 1.5
            ).color;

        graphics.fillStyle(bodyShade, 1);
        graphics.fillRoundedRect(
          pos.x - size / 2,
          pos.y - size / 2,
          size,
          size,
          5
        );

        // Add subtle highlight
        graphics.fillStyle(0xffffff, 0.15);
        graphics.fillRoundedRect(
          pos.x - size / 2 + 2,
          pos.y - size / 2 + 2,
          size - 8,
          size / 4,
          2
        );

        // Add border
        graphics.lineStyle(1, 0x000000, 0.2);
        graphics.strokeRoundedRect(
          pos.x - size / 2,
          pos.y - size / 2,
          size,
          size,
          5
        );
      }

      this.graphics.push(graphics);

      // Add eyes to head
      if (isHead && !this.isAI) {
        this.addEyes(pos, size);
      }
    });
  }

  addEyes(headPos, size) {
    const eyeSize = 4;
    const pupilSize = 2;
    const eyeOffset = 6;

    // Determine eye position based on direction
    let eye1X = 0,
      eye1Y = 0,
      eye2X = 0,
      eye2Y = 0;

    if (this.direction.x === 1) {
      // Right
      eye1X = eyeOffset;
      eye1Y = -eyeOffset;
      eye2X = eyeOffset;
      eye2Y = eyeOffset;
    } else if (this.direction.x === -1) {
      // Left
      eye1X = -eyeOffset;
      eye1Y = -eyeOffset;
      eye2X = -eyeOffset;
      eye2Y = eyeOffset;
    } else if (this.direction.y === 1) {
      // Down
      eye1X = -eyeOffset;
      eye1Y = eyeOffset;
      eye2X = eyeOffset;
      eye2Y = eyeOffset;
    } else {
      // Up
      eye1X = -eyeOffset;
      eye1Y = -eyeOffset;
      eye2X = eyeOffset;
      eye2Y = -eyeOffset;
    }

    // Create eye whites
    const eye1 = this.scene.add.circle(
      headPos.x + eye1X,
      headPos.y + eye1Y,
      eyeSize,
      0xffffff
    );

    const eye2 = this.scene.add.circle(
      headPos.x + eye2X,
      headPos.y + eye2Y,
      eyeSize,
      0xffffff
    );

    // Create pupils
    const pupil1 = this.scene.add.circle(
      headPos.x + eye1X,
      headPos.y + eye1Y,
      pupilSize,
      0x000000
    );

    const pupil2 = this.scene.add.circle(
      headPos.x + eye2X,
      headPos.y + eye2Y,
      pupilSize,
      0x000000
    );

    // Add eye highlights for realism
    const highlight1 = this.scene.add.circle(
      headPos.x + eye1X + 1,
      headPos.y + eye1Y - 1,
      1,
      0xffffff
    );

    const highlight2 = this.scene.add.circle(
      headPos.x + eye2X + 1,
      headPos.y + eye2Y - 1,
      1,
      0xffffff
    );

    this.graphics.push(eye1, eye2, pupil1, pupil2, highlight1, highlight2);
  }

  setDirection(x, y) {
    // Prevent 180-degree turns
    if (this.direction.x === -x && this.direction.y === -y) {
      return;
    }

    this.nextDirection = { x, y };
  }

  update() {
    if (!this.alive) return false;

    // Update direction
    this.direction = { ...this.nextDirection };

    // Calculate new head position
    const head = this.body[0];
    const newHead = {
      x: head.x + this.direction.x,
      y: head.y + this.direction.y,
    };

    // Add new head
    this.body.unshift(newHead);

    // Remove tail if not growing
    if (!this.growing) {
      this.body.pop();
    } else {
      this.growing = false;
    }

    // Update graphics
    this.updateGraphics();

    return true;
  }

  updateGraphics() {
    // Destroy old graphics
    this.graphics.forEach((g) => g.destroy());
    this.graphics = [];

    // Create new graphics
    this.createGraphics();
  }

  grow(amount = 1) {
    for (let i = 0; i < amount; i++) {
      this.growing = true;
      // Add duplicate of tail
      const tail = this.body[this.body.length - 1];
      this.body.push({ ...tail });
    }
  }

  shrink(amount = 2) {
    // Don't shrink below minimum length
    const minLength = 3;
    const shrinkAmount = Math.min(amount, this.body.length - minLength);

    for (let i = 0; i < shrinkAmount; i++) {
      this.body.pop();
    }

    this.updateGraphics();
  }

  checkSelfCollision() {
    const head = this.body[0];

    // Check if head collides with body (skip first segment which is the head)
    for (let i = 1; i < this.body.length; i++) {
      if (head.x === this.body[i].x && head.y === this.body[i].y) {
        return true;
      }
    }

    return false;
  }

  checkWallCollision() {
    const head = this.body[0];
    const maxX = Math.floor(GameConfig.GAME_WIDTH / GameConfig.CELL_SIZE);
    const maxY = Math.floor(GameConfig.GAME_HEIGHT / GameConfig.CELL_SIZE);

    return head.x < 0 || head.x >= maxX || head.y < 0 || head.y >= maxY;
  }

  checkObstacleCollision(obstacles) {
    const head = this.body[0];
    return obstacles.some((obs) => obs.x === head.x && obs.y === head.y);
  }

  checkCollisionWith(otherSnake) {
    const head = this.body[0];
    return otherSnake.body.some(
      (segment) => segment.x === head.x && segment.y === head.y
    );
  }

  getHead() {
    return this.body[0];
  }

  getBody() {
    return this.body;
  }

  getLength() {
    return this.body.length;
  }

  destroy() {
    this.alive = false;
    this.graphics.forEach((g) => g.destroy());
    this.graphics = [];
  }
}
