import Phaser from 'phaser';
import { RectangleObjectProps } from 'types/types';

export default class PowerWrapper extends Phaser.GameObjects.Graphics {
  constructor(scene: Phaser.Scene, rectangleProps: RectangleObjectProps) {
    super(scene);
    const {
      color, alpha, x, y, width, height,
    } = rectangleProps;
    this.fillStyle(color, alpha);
    this.fillRoundedRect(x, y, width, height, 1);
    scene.add.existing(this);
  }
}
