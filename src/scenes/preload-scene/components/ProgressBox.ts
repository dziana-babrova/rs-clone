import Phaser from 'phaser';

export default class ProgressBox extends Phaser.GameObjects.Graphics {
  constructor(scene: Phaser.Scene) {
    super(scene);
    this.fillStyle(0x222222, 0.8);
    this.fillRoundedRect(240, 270, 320, 50);
    this.setPosition(this.scene.scale.width / 5, this.scene.scale.height / 5);
    scene.add.existing(this);
  }
}
