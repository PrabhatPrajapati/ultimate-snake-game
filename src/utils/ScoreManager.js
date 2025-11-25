// Score Manager - Handles scoring, combos, and high scores
class ScoreManager {
  constructor() {
    this.score = 0;
    this.highScore = this.loadHighScore();
    this.foodEaten = 0;
    this.comboCount = 0;
    this.comboMultiplier = 1;
    this.lastFoodTime = 0;
    this.levelCompletionBonus = 0;
  }

  reset() {
    this.score = 0;
    this.foodEaten = 0;
    this.comboCount = 0;
    this.comboMultiplier = 1;
    this.lastFoodTime = 0;
    this.levelCompletionBonus = 0;
  }

  addFoodScore(foodType, currentTime) {
    const baseScore = GameConfig.FOOD_TYPES[foodType].score;

    // Update combo
    this.updateCombo(currentTime);

    // Calculate score with multiplier
    const earnedScore = baseScore * this.comboMultiplier;
    this.score += earnedScore;

    // Track food eaten
    if (baseScore > 0) {
      this.foodEaten++;
      this.comboCount++;
    }

    this.lastFoodTime = currentTime;

    // Update high score
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.saveHighScore();
    }

    return earnedScore;
  }

  updateCombo(currentTime) {
    // Check if combo window expired
    if (currentTime - this.lastFoodTime > GameConfig.COMBO_TIME_WINDOW) {
      this.comboCount = 0;
      this.comboMultiplier = 1;
      return;
    }

    // Update multiplier based on combo count
    if (this.comboCount >= GameConfig.COMBO_THRESHOLDS.LEVEL_2.count) {
      this.comboMultiplier = GameConfig.COMBO_THRESHOLDS.LEVEL_2.multiplier;
    } else if (this.comboCount >= GameConfig.COMBO_THRESHOLDS.LEVEL_1.count) {
      this.comboMultiplier = GameConfig.COMBO_THRESHOLDS.LEVEL_1.multiplier;
    } else {
      this.comboMultiplier = 1;
    }
  }

  addLevelBonus(noDeath = false) {
    this.score += GameConfig.LEVEL_COMPLETION_BONUS;
    if (noDeath) {
      this.score += GameConfig.NO_DEATH_BONUS;
    }

    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.saveHighScore();
    }
  }

  getScore() {
    return this.score;
  }

  getHighScore() {
    return this.highScore;
  }

  getComboMultiplier() {
    return this.comboMultiplier;
  }

  getFoodEaten() {
    return this.foodEaten;
  }

  loadHighScore() {
    const saved = localStorage.getItem("snakeHighScore");
    return saved ? parseInt(saved) : 0;
  }

  saveHighScore() {
    localStorage.setItem("snakeHighScore", this.highScore.toString());
  }
}
