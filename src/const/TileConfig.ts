import { TilesConfig } from 'types/types';

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
    type: 'tile',
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
    type: 'tile',
    texture: 'hole-center.png',
  },
  '!': {
    type: 'tile',
    texture: 'connector-left-bootom.png',
  },
  '/': {
    type: 'slope',
    texture: 'left.png',
  },
  G: {
    type: 'goal',
    texture: 'goal',
  },
  O: {
    type: 'coin',
    texture: 'coin',
  },
  S: {
    type: 'enemy',
    texture: 'slime',
  },
  B: {
    type: 'enemy',
    texture: 'bee',
  },
  P: {
    type: 'player',
    texture: 'player',
  },
};

export default config;
