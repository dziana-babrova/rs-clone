import Phaser from 'phaser';

export default class ProgressBox extends Phaser.GameObjects.Graphics {
  constructor(scene: Phaser.Scene) {
    super(scene);
    const progressBox = scene.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRoundedRect(240, 270, 320, 50);
    progressBox.setPosition(this.scene.scale.width / 5, this.scene.scale.height / 5);
  }
}
