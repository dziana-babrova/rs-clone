<<<<<<< HEAD
import Phaser from 'phaser';
import GameScene from 'scenes/game-scene/GameScene';
=======
import gameConfig from 'gameConfig';
import { Game, Types, AUTO } from 'phaser';
>>>>>>> f1064bd0c8b7ac459abc0127d6b8fc09150c6362
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
<<<<<<< HEAD
  scene: [PreloadScene, GameScene],
=======
>>>>>>> f1064bd0c8b7ac459abc0127d6b8fc09150c6362
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const game = new Game(config);
