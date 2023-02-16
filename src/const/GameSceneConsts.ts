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
      height: 300,
      radius: 10,
      lineColor: 0x000000,
      lineWidth: 5,
    },

    canvasStroke: {
      width: 616,
      height: 316,
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
      initialY: -1000,
      indexCenterX: 2.7,
      paddingX: 30,
      paddingY: 160,
      innerRadius: 45,
      outerRadius: 75,
      points: 5,
      lineWidth: 2,
      alpha: 1,
    },

    button: {
      lineWidth: 2,
      initialPaddingX: 300,
      finalPaddingX: 130,
      Y: 470,
      radius: 70,
    },
  },
};

export default GAME_SCENE;
