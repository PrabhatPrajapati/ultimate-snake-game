// Game Configuration Constants
const GameConfig = {
  // Grid settings
  GRID_SIZE: 30,
  CELL_SIZE: 20,

  // Game dimensions
  GAME_WIDTH: 800,
  GAME_HEIGHT: 600,

  // Speed settings
  BASE_SPEED: 150, // milliseconds per move (lower = faster)
  SPEED_INCREASE_PER_FOOD: 3, // decrease in ms per food eaten
  MIN_SPEED: 30, // maximum speed cap (5x faster than base)

  // Food settings
  FOOD_TYPES: {
    NORMAL: {
      name: "apple",
      score: 1,
      growth: 1,
      weight: 70, // spawn probability weight
      color: 0xff0000,
    },
    GOLDEN: {
      name: "golden",
      score: 5,
      growth: 2,
      weight: 10,
      color: 0xffd700,
      spawnInterval: [5, 8], // appears every 5-8 normal foods
    },
    BOMB: {
      name: "bomb",
      score: -2,
      growth: -2, // shrinks snake
      weight: 15,
      color: 0x333333,
    },
    SPEED_BOOST: {
      name: "speed",
      score: 2,
      growth: 1,
      weight: 8,
      color: 0x0066ff,
      effect: {
        type: "speed",
        multiplier: 1.3,
        duration: 5000, // 5 seconds
      },
    },
    SLOW_TIME: {
      name: "slow",
      score: 2,
      growth: 1,
      weight: 7,
      color: 0x00ff00,
      effect: {
        type: "slow",
        multiplier: 0.5,
        duration: 3000, // 3 seconds
      },
    },
  },

  // Scoring
  COMBO_THRESHOLDS: {
    LEVEL_1: { count: 3, multiplier: 2 },
    LEVEL_2: { count: 6, multiplier: 3 },
  },
  COMBO_TIME_WINDOW: 2000, // 2 seconds to maintain combo
  LEVEL_COMPLETION_BONUS: 20,
  NO_DEATH_BONUS: 10,

  // Game modes
  GAME_MODES: {
    ENDLESS: "endless",
    TIME_ATTACK: "timeAttack",
    HARD: "hard",
    KIDS: "kids",
  },

  // Time Attack settings
  TIME_ATTACK_DURATION: 60, // seconds
  TIME_ATTACK_FOOD_TARGET: 20,

  // Difficulty multipliers per mode
  MODE_SETTINGS: {
    endless: {
      speedMultiplier: 1.0,
      enableSpeedIncrease: true,
    },
    timeAttack: {
      speedMultiplier: 1.2,
      enableSpeedIncrease: true,
    },
    hard: {
      speedMultiplier: 1.5,
      enableSpeedIncrease: true,
    },
    kids: {
      speedMultiplier: 0.7,
      enableSpeedIncrease: false,
    },
  },

  // Colors
  COLORS: {
    SNAKE_HEAD: 0x00ff00,
    SNAKE_BODY: 0x00cc00,
    SNAKE_AI: 0xff6600,
    WALL: 0x8b4513,
    GRID_LINE: 0x333333,
    BACKGROUND: 0x1a1a2e,
    PORTAL_BLUE: 0x00bfff,
    PORTAL_ORANGE: 0xff8c00,
  },

  // Portal settings
  PORTAL_ANIMATION_SPEED: 0.05,

  // AI Snake settings
  AI_THINK_INTERVAL: 200, // ms between AI decisions
  AI_AGGRESSION: 0.3, // 30% chance to move toward player instead of food

  // Boss level settings
  BOSS_DURATION: 90, // seconds
  BOSS_OBSTACLE_COUNT: 5,
  BOSS_OBSTACLE_SPEED: 2,
};
