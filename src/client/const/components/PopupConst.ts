import { STYLE } from '../AppConstants';

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
      xCorrection: 13,
    },

    winners: {
      width: 580,
      height: 680,
      shift: -10,
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

    error: {
      width: 600,
      height: 200,
      shift: 0,
    },
  },

  canvasFill: {
    radius: 10,
    lineWidth: 5,
  },

  canvasStroke: {
    padding: 16,
    radius: 10,
    lineWidth: 5,
  },

  labelFill: {
    width: 400,
    height: 60,
    radius: 30,
    lineWidth: 5,
  },

  labelText: {
    fontFamily: STYLE.font,
    fontSize: '38px',
    color: STYLE.lightText,
    align: 'center',
  },

  textBold: {
    fontFamily: STYLE.font,
    fontSize: '35px',
    fontStyle: '600',
    color: STYLE.darkText,
    align: 'center',
  },

  levels: {
    labelText: {
      fontFamily: STYLE.font,
      fontSize: '38px',
      color: STYLE.lightText,
      align: 'center',
    },
  },
};

export const POPUP_ANIMATION = {
  ease: 'Sinusoidal',
  duration: 500,
};

export default POPUP;
