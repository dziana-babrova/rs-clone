const PRELOAD_SCENE = {
  mainText: {
    x: 0,
    y: 0,
    style: {
      font: '20px monospace',
    },
  },

  secondaryText: {
    x: 0,
    y: 0,
    style: {
      font: '18px monospace',
    },
  },

  coloredRectangle: {
    color: 0x222222,
    alpha: 0.8,
    x: 240,
    y: 270,
    width: 320,
    height: 50,
  },

  gradientRectangle: {
    x: 250,
    y: 280,
    width: 300,
    height: 30,
    alpha: 1,
    topLeft: 0xff0000,
    topRight: 0xff0000,
    bottomLeft: 0xffff00,
    bottomRight: 0xffff00,
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
