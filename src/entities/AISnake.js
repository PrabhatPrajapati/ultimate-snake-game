// AI Snake - Enemy snake for Level 8
class AISnake extends Snake {
  constructor(scene, startX, startY) {
    super(scene, startX, startY, true);
    this.thinkTimer = 0;
    this.target = null;
  }

  updateAI(playerSnake, foodPosition, obstacles, deltaTime) {
    if (!this.alive) return;

    this.thinkTimer += deltaTime;

    // Make decisions at intervals
    if (this.thinkTimer >= GameConfig.AI_THINK_INTERVAL) {
      this.thinkTimer = 0;
      this.makeDecision(playerSnake, foodPosition, obstacles);
    }
  }

  makeDecision(playerSnake, foodPosition, obstacles) {
    // Decide target: food or player
    const targetPlayer = Math.random() < GameConfig.AI_AGGRESSION;

    if (targetPlayer && playerSnake) {
      this.target = playerSnake.getHead();
    } else if (foodPosition) {
      this.target = foodPosition;
    } else {
      // Random movement
      this.randomMove(obstacles);
      return;
    }

    // Pathfind to target
    this.moveToward(this.target, obstacles);
  }

  moveToward(target, obstacles) {
    const head = this.getHead();

    // Calculate direction to target
    const dx = target.x - head.x;
    const dy = target.y - head.y;

    // Possible moves (prioritized by distance to target)
    const moves = [
      { x: Math.sign(dx), y: 0, priority: Math.abs(dx) },
      { x: 0, y: Math.sign(dy), priority: Math.abs(dy) },
      { x: -Math.sign(dx), y: 0, priority: 0 },
      { x: 0, y: -Math.sign(dy), priority: 0 },
    ];

    // Sort by priority
    moves.sort((a, b) => b.priority - a.priority);

    // Try each move
    for (const move of moves) {
      if (move.x === 0 && move.y === 0) continue;

      // Check if move is valid
      const newPos = {
        x: head.x + move.x,
        y: head.y + move.y,
      };

      // Don't move backward
      if (this.direction.x === -move.x && this.direction.y === -move.y) {
        continue;
      }

      // Check if position is safe
      if (this.isSafePosition(newPos, obstacles)) {
        this.setDirection(move.x, move.y);
        return;
      }
    }

    // If no safe move found, try random
    this.randomMove(obstacles);
  }

  randomMove(obstacles) {
    const head = this.getHead();
    const possibleMoves = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ];

    // Shuffle moves
    possibleMoves.sort(() => Math.random() - 0.5);

    for (const move of possibleMoves) {
      // Don't move backward
      if (this.direction.x === -move.x && this.direction.y === -move.y) {
        continue;
      }

      const newPos = {
        x: head.x + move.x,
        y: head.y + move.y,
      };

      if (this.isSafePosition(newPos, obstacles)) {
        this.setDirection(move.x, move.y);
        return;
      }
    }
  }

  isSafePosition(pos, obstacles) {
    // Check boundaries
    if (!GridHelper.isPositionValid(pos.x, pos.y, obstacles)) {
      return false;
    }

    // Check self collision
    const wouldCollide = this.body.some(
      (segment) => segment.x === pos.x && segment.y === pos.y
    );

    return !wouldCollide;
  }
}
