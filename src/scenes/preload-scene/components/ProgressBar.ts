import Phaser from 'phaser';

export default class ProgressBar extends Phaser.GameObjects.Graphics {
  private progressBar: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.progressBar = scene.add.graphics();
    this.progressBar.setPosition(this.scene.scale.width / 5, this.scene.scale.height / 5);
  }

  public fillProgressBar(value: number): void {
    this.progressBar.clear();
    this.progressBar.fillStyle(0xffffff, 1);
    this.progressBar.fillGradientStyle(0xff0000, 0xff0000, 0xffff00, 0xffff00, 1);
    this.progressBar.fillRect(250, 280, 300 * value, 30);
  }
}
