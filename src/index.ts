import gameConfig from 'gameConfig';
import { Game, Types, AUTO } from 'phaser';
import GameScene from './scenes/GameScene';
import PreloadScene from './scenes/PreloadScene';

const config: Types.Core.GameConfig = {
  type: AUTO,
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

const g = new Game(config);
