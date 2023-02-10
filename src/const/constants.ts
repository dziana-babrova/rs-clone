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
  text: 'Ready!',
  style: {
    font: '15px monospace',
  },
  duration: 900,
};

export const trajectorySettings = {
  COLOR: 100000,
  NUM_OF_POINTS: 20,
  RADIUS: 10,
};
