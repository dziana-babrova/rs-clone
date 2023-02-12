const GAME_SCENE_ANIMATION = {
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
};

export default GAME_SCENE_ANIMATION;
