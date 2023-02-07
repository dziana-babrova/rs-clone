import Phaser from 'phaser';
import GameScene from 'scenes/game-scene/GameScene';
import PreloadScene from 'scenes/preload-scene/PreloadScene';

const config = {
  type: Phaser.AUTO,
  parent: 'app',
  width: 1366,
  height: 768,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
      debug: true,
    },
  },
  scene: [PreloadScene, GameScene],
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const game = new Phaser.Game(config);
