import Phaser, { Game, Types, AUTO } from 'phaser';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import gameConfig from 'client/gameConfig';
import GameScene from 'client/scenes/game-scene/GameScene';
import MultiPlayerScene from 'client/scenes/multiplayer-scene/MultiPlayerScene';

import './styles/_style.scss';
import OnlineScene from 'client/scenes/online-scene/OnlineScene';
import PreloadScene from './scenes/preload-scene/PreloadScene';
import StartScene from './scenes/start-scene/StartScene';

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
  },
  physics: {
    default: 'matter',
    matter: {
      // debug: true,
      gravity: true,
    },
  },
  plugins: {
    scene: [pluginConfig],
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const game = new Game(config);
