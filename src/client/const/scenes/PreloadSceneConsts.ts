const PRELOAD_SCENE = {
  mainText: {
    x: 0,
    y: 0,
    style: {
      font: '20px Montserrat',
    },
  },

  secondaryText: {
    x: 0,
    y: 0,
    style: {
      font: '18px Montserrat',
    },
  },

  coloredRectangle: {
    color: 0xD78122,
    alpha: 1,
    x: 240,
    y: 280,
    width: 320,
    height: 30,
    strokeColor: 0x000000,
    strokeWidth: 2,
  },

  gradientRectangle: {
    x: 240,
    y: 280,
    width: 320,
    height: 30,
    alpha: 1,
    topLeft: 0x6BA310,
    topRight: 0x446B00,
    bottomLeft: 0x446B00,
    bottomRight: 0x7FAB1A,
  },

  fireworksTexture: {
    data: ['123...'],
    palette: {
      0: '#fff2',
      1: '#fff4',
      2: '#fff8',
      3: '#ffff',
      4: '#ffff',
      5: '#ffff',
      6: '#ffff',
      7: '#ffff',
      8: '#ffff',
      9: '#ffff',
      A: '#ffff',
      B: '#ffff',
      C: '#ffff',
      D: '#ffff',
      E: '#ffff',
      F: '#ffff',
    },
    pixelWidth: 6,
  },
};

export default PRELOAD_SCENE;
