const GAME_SCENE = {
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

export default GAME_SCENE;
