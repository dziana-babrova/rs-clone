import Phaser, { Game, Types, AUTO } from 'phaser';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import gameConfig from 'gameConfig';
import PreloadScene from 'scenes/preload-scene/PreloadScene';
import StartScene from 'scenes/start-scene/StartScene';
import GameScene from 'scenes/game-scene/GameScene';

import './styles/style.scss';

const pluginConfig = {
  plugin: PhaserMatterCollisionPlugin,
  key: 'matterCollision' as 'matterCollision',
  mapping: 'matterCollision' as 'matterCollision',
};

const config: Types.Core.GameConfig = {
  type: AUTO,
  parent: 'app',
  width: gameConfig.screenWidth,
  height: gameConfig.screenHeight,
  backgroundColor: gameConfig.backgroundColor,
  scene: [
    PreloadScene,
    StartScene,
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
  plugins: {
    scene: [
      pluginConfig,
    ],
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const game = new Game(config);
