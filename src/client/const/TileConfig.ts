import { TilesConfig } from 'common/types/types';

const textures = {
  bottom: 'bottom.png',
  holeBlackLeftBottom: 'hole-black-left-bottom.png',
  holeBlackRightBottom: 'hole-black-right-bottom.png',
  holeBlackBottom: 'hole-black-bottom.png',
  holeBlackRight: 'hole-black-right.png',
  holeBlackLeft: 'hole-black-left.png',
  holeBlack: 'hole-black.png',
  ground: 'ground.png',
  holeEndLeft: 'hole-end-left.png',
  holeEndRight: 'hole-end-right.png',
  holeCenter: 'hole-center.png',
  connectorLeftBottom: 'connector-left-bootom.png',
  connectorRightBottom: 'connector-right-bottom.png',
  left: 'left.png',
  right: 'right.png',
  goal: 'goal',
  saw: 'saw',
  star: 'star.png',
  waterTop: 'water-top.png',
  water: 'water.png',
  bar: 'hole-grass.png',
};

const config: TilesConfig = {
  '.': {
    type: 'tile',
    texture: textures.bottom,
  },
  '<': {
    type: 'tile',
    texture: textures.holeBlackLeftBottom,
  },
  '>': {
    type: 'tile',
    texture: textures.holeBlackRightBottom,
  },
  '-': {
    type: 'tile',
    texture: textures.holeBlackBottom,
  },
  '[': {
    type: 'tile',
    texture: textures.holeBlackLeft,
  },
  ']': {
    type: 'tile',
    texture: textures.holeBlackRight,
  },
  '|': {
    type: 'hole',
    texture: textures.holeBlack,
  },
  '*': {
    type: 'cup',
    texture: textures.holeBlack,
  },
  '^': {
    type: 'coin-in-hole',
    texture: textures.holeBlack,
  },
  T: {
    type: 'tile',
    texture: textures.ground,
  },
  '{': {
    type: 'tile',
    texture: textures.holeEndLeft,
  },
  '}': {
    type: 'tile',
    texture: textures.holeEndRight,
  },
  '+': {
    type: 'flag',
    texture: textures.holeCenter,
  },
  '~': {
    type: 'hole',
    texture: textures.holeCenter,
  },
  '!': {
    type: 'tile',
    texture: textures.connectorLeftBottom,
  },
  '/': {
    type: 'slope-left',
    texture: textures.left,
  },
  '?': {
    type: 'tile',
    texture: textures.connectorRightBottom,
  },
  '\\': {
    type: 'slope-right',
    texture: textures.right,
  },
  B: {
    type: 'ball',
    texture: textures.goal,
  },
  O: {
    type: 'star',
    texture: textures.star,
  },
  '#': {
    type: 'saw',
    texture: textures.saw,
  },
  W: {
    type: 'water',
    texture: textures.waterTop,
  },
  w: {
    type: 'water',
    texture: textures.water,
  },
};

export default config;
export { textures };
