import { ColorsNumber } from 'common/types/enums';
import { STYLE } from '../AppConstants';

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

  destroyedBall: {
    alpha: { start: 1, end: 0, ease: 'Cubic.easeIn' },
    blendMode: 'ADD',
    gravityY: 500,
    lifespan: 3000,
    quantity: 200,
    speed: { min: 300, max: 350 },
  },

  topPanel: {
    paddingY: 50,
    paddingX: 70,
  },

  nextLevelPopup: {
    y: -3000,

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

  background: {
    sun: {
      moveX: 0.3,
      moveY: 0.1,
      initialY: 200,
      initialX: 0,
    },

    cloud: {
      MinMoveX: 0.4,
      MaxMoveX: 0.5,
      moveY: 0,
    },
  },
};

export const GAME_SCENE_ANIMATION = {
  moveYAnimation: {
    y: 0,
    ease: 'Quad',
    duration: 1000,
  },

  moveFromYAnimation: {
    from: 0,
    to: 100,
    ease: 'Quad',
    duration: 500,
    yoyo: true,
  },

  scaleToBig: {
    scale: 1.2,
    duration: 200,
  },

  flagAnimation: {
    ease: 'Back',
    duration: 1000,
  },

  popupAnimation: {
    ease: 'Sinusoidal',
    duration: 2000,
  },

  starAnimation: {
    ease: 'Exponential',
    duration: 500,
  },

  nextLevelpopupButtonsAnimation: {
    ease: 'Quad',
    duration: 1000,
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
  color: ColorsNumber.Primary,
  size: 70,
  minAlpha: 0.2,
  duration: 900,
};

export const ballText = {
  style: {
    fontFamily: STYLE.font,
    fontSize: '15px',
  },
  duration: 900,
};

export const trajectorySettings = {
  COLOR: ColorsNumber.Primary,
  NUM_OF_POINTS: 20,
  RADIUS: 5,
};

export const levelText = {
  fontFamily: STYLE.font,
  fontSize: '35px',
  fontStyle: '600',
  color: STYLE.lightText,
  align: 'center',
};
