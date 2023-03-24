import Phaser from 'phaser';
import { RectangleObjectProps } from 'common/types/types';

export default class ProgressBox extends Phaser.GameObjects.Graphics {
  constructor(scene: Phaser.Scene, rectangleProps: RectangleObjectProps) {
    super(scene);
    const {
      color, alpha, x, y, width, height,
    } = rectangleProps;
    this.fillStyle(color, alpha);
    this.fillRoundedRect(x, y, width, height, 10);
    this.setPosition(this.scene.scale.width / 5, this.scene.scale.height / 5);
    this.lineStyle(2, 0x000000, 1);
    this.strokeRoundedRect(x, y, width, height, 10);
    scene.add.existing(this);
  }
}
