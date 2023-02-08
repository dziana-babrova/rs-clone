import gameConfig from 'gameConfig';
import { Game, Types, AUTO } from 'phaser';
import PreloadScene from 'scenes/preload-scene/PreloadScene';
import GameScene from './scenes/game-scene/GameScene';

const config: Types.Core.GameConfig = {
  type: AUTO,
  parent: 'app',
  width: gameConfig.screenWidth,
  height: gameConfig.screenHeight,
  backgroundColor: gameConfig.backgroundColor,
  scene: [
    PreloadScene,
    GameScene,
  ],
  scale: {
    mode: Phaser.Scale.FIT,
  },
  physics: {
    default: 'matter',
    matter: {
      debug: true,
      gravity: true,
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const game = new Game(config);
