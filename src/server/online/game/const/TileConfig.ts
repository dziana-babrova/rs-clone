import { TilesConfig } from '../../../../common/types/types';

const config: TilesConfig = {
  '.': {
    type: 'tile',
    texture: 'bottom.png',
  },
  '<': {
    type: 'tile',
    texture: 'hole-black-left-bottom.png',
  },
  '>': {
    type: 'tile',
    texture: 'hole-black-right-bottom.png',
  },
  '-': {
    type: 'tile',
    texture: 'hole-black-bottom.png',
  },
  '[': {
    type: 'tile',
    texture: 'hole-black-left.png',
  },
  ']': {
    type: 'tile',
    texture: 'hole-black-right.png',
  },
  '|': {
    type: 'hole',
    texture: 'hole-black.png',
  },
  '*': {
    type: 'cup',
    texture: 'hole-black.png',
  },
  '^': {
    type: 'coin-in-hole',
    texture: 'hole-black.png',
  },
  T: {
    type: 'tile',
    texture: 'ground.png',
  },
  '{': {
    type: 'tile',
    texture: 'hole-end-left.png',
  },
  '}': {
    type: 'tile',
    texture: 'hole-end-right.png',
  },
  '+': {
    type: 'flag',
    texture: 'hole-center.png',
  },
  '~': {
    type: 'hole',
    texture: 'hole-center.png',
  },
  '!': {
    type: 'tile',
    texture: 'connector-left-bootom.png',
  },
  '/': {
    type: 'slope-left',
    texture: 'left.png',
  },
  '?': {
    type: 'tile',
    texture: 'connector-right-bottom.png',
  },
  '\\': {
    type: 'slope-right',
    texture: 'right.png',
  },
  B: {
    type: 'ball',
    texture: 'goal',
  },
  O: {
    type: 'star',
    texture: 'star.png',
  },
  '#': {
    type: 'saw',
    texture: 'saw',
  },
};

export default config;
