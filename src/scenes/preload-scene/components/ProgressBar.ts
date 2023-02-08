import Phaser from 'phaser';

export default class ProgressBar extends Phaser.GameObjects.Graphics {
  constructor(scene: Phaser.Scene) {
    super(scene);
    this.setPosition(this.scene.scale.width / 5, this.scene.scale.height / 5);
    scene.add.existing(this);
  }

  public fillProgressBar(value: number): void {
    this.clear();
    this.fillStyle(0xffffff, 1);
    this.fillGradientStyle(0xff0000, 0xff0000, 0xffff00, 0xffff00, 1);
    this.fillRect(250, 280, 300 * value, 30);
  }
}
