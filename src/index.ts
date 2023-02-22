import Phaser, { Game, Types, AUTO } from 'phaser';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import gameConfig from 'gameConfig';
import PreloadScene from 'scenes/preload-scene/PreloadScene';
import StartScene from 'scenes/start-scene/StartScene';
import GameScene from 'scenes/game-scene/GameScene';
import MultiPlayerScene from 'scenes/multiplayer-scene/MultiPlayerScene';

import './styles/style.scss';
import OnlineScene from 'scenes/online-scene/OnlineScene';

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
  scene: [PreloadScene, StartScene, GameScene, MultiPlayerScene, OnlineScene],
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
      gravity: true,
    },
  },
  plugins: {
    scene: [pluginConfig],
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const game = new Game(config);
