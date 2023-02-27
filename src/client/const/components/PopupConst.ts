const POPUP = {
  canvas: {
    levels: {
      width: 1200,
      height: 400,
      shift: -40,
      perPage: 30,
      arrowSize: 50,
      arrowGap: 20,
      bottomPadding: 20,
    },
    winners: {
      width: 600,
      height: 600,
      shift: -40,
    },
    landscape: {
      width: 700,
      height: 440,
      shift: -60,
    },

    switchLevel: {
      width: 600,
      height: 300,
      shift: 75,
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

  textBold: {
    font: '600 35px Montserrat',
    color: '#000000',
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
  duration: 500,
};

export default POPUP;
