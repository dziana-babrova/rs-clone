import '@geckos.io/phaser-on-nodejs';
import { HEADLESS, Types } from 'phaser';
import OnlineScene from './scene/OnlineScene';
import PreloadScene from './scene/PreloadScene';

const config: Types.Core.GameConfig = {
  type: HEADLESS,
  parent: 'app',
  width: 1366,
  height: 768,
  scene: [PreloadScene, OnlineScene],
  scale: {
    mode: Phaser.Scale.FIT,
  },
  dom: {
    createContainer: true,
    // behindCanvas: false,
  },
  physics: {
    default: 'matter',
    matter: {
      debug: true,
      gravity: true,
    },
  },
};

export default config;
