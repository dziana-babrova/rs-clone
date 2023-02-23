const POPUP = {
  y: -3000,
  moveY: 3000,

  canvas: {
    levels: {
      width: 1200,
      height: 400,
    },
    winners: {
      width: 600,
      height: 600,
    },
    landscape: {
      width: 900,
      height: 300,
    },
  },

  canvasFill: {
    radius: 10,
    lineColor: 0x000000,
    lineWidth: 5,
  },

  canvasStroke: {
    padding: 16,
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

  levels: {
    labelText: {
      font: '38px Montserrat',
      color: '#000000',
      align: 'center',
    },
  },
};

export const POPUP_ANIMATION = {
  ease: 'Sinusoidal',
  duration: 1000,
};

export default POPUP;
