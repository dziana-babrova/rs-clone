export const GAME_SCENE = {
  fireworks: {
    alpha: { start: 1, end: 0, ease: 'Cubic.easeIn' },
    angle: { start: 180, end: 360, steps: 20 },
    blendMode: 'ADD',
    gravityY: 128,
    lifespan: 3000,
    quantity: 100,
    reserve: 500,
    speed: { min: 128, max: 256 },
  },
};

export const ballSettings = {
  SPEED: 0.1,
  MAX_SPEED: 25,
  DEFAULT_ANGLE: -1,
  DEFAULT_DISTANCE: 100,
  BALL_PROPS: {
    label: 'ball',
    bounce: 0.2,
    friction: 0.7,
    frictionAir: 0.01,
    frictionStatic: 1,
    mass: 100,
    circleRadius: 15,
  },
};

export const pulseSettings = {
  color: 0xffffff,
  size: 70,
  minAlpha: 0.2,
  duration: 900,
};

export const ballText = {
  style: {
    font: '15px monospace',
  },
  duration: 900,
};

export const trajectorySettings = {
  COLOR: 0xffffff,
  NUM_OF_POINTS: 20,
  RADIUS: 5,
};