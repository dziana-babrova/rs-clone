export const firstPlayerPosition = { x: 70, y: 550 };
export const secondPlayerPosition = { x: 1290, y: 550 };

export const scoreBlockSettings = {
  width: 100,
  height: 100,
  radius: 20,
  alpha: 0.8,
  padding: 10,
  color1: 0x808080,
  color2: 0x606060,
};

export const powerIndicatorProps = {
  width: 200,
  height: 20,
  duration: 1000,
  stopTimeout: 300,
};

export const playerProps = {
  secondBallColor: 0xd97373,
};

export const trajectoryProps = {
  radius: 5,
  color: 0xffffff,
  padding: 20,
  distance: 15,
  alpha: 0.8,
  duration: 1000,
};

export const animations = {
  hideAnimation: {
    y: 3000,
    ease: 'Quad',
    duration: 500,
  },
  showAnimation: {
    y: 0,
    ease: 'Quad',
    duration: 500,
  },

};
