import Phaser, { Game, Types, AUTO } from 'phaser';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import gameConfig from 'client/gameConfig';
import PreloadScene from 'client/scenes/preload-scene/PreloadScene';
import StartScene from 'client/scenes/start-scene/StartScene';
import GameScene from 'client/scenes/game-scene/GameScene';
import MultiPlayerScene from 'client/scenes/multiplayer-scene/MultiPlayerScene';

import './styles/style.scss';
import OnlineScene from 'client/scenes/online-scene/OnlineScene';

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
      debug: true,
      gravity: true,
    },
  },
  plugins: {
    scene: [pluginConfig],
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const game = new Game(config);
