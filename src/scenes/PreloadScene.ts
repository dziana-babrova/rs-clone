export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    this.load.image('ball', '../assets/Golf-Ball-big.png');
    this.load.json('ball-shape', '../assets/ball.json');
  }

  create() {
    this.scene.start('GameScene');
  }
}
