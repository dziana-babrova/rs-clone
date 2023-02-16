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

  nextLevelPopup: {
    y: -3000,

    canvasFill: {
      width: 600,
      height: 400,
      radius: 10,
      lineColor: 0x000000,
      lineWidth: 5,
    },

    canvasStroke: {
      width: 616,
      height: 416,
      radius: 10,
      lineColor: 0x000000,
      lineWidth: 5,
    },

    labelFill: {
      width: 400,
      height: 60,
      radius: 30,
      lineColor: 0x000000,
      lineWidth: 5,
    },

    labelText: {
      font: '38px Montserrat',
      color: '#ffffff',
      align: 'center',
    },

    star: {
      paddingX: 20,
      paddingY: 160,
      innerRadius: 45,
      outerRadius: 75,
      points: 5,
    },
  },
};

export default GAME_SCENE;
