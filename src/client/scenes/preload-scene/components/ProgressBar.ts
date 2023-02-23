import Phaser from 'phaser';
import { GradientRectangleObjectProps } from 'common/types/types';

export default class ProgressBar extends Phaser.GameObjects.Graphics {
  rectangleProps: GradientRectangleObjectProps;

  constructor(scene: Phaser.Scene, rectangleProps: GradientRectangleObjectProps) {
    super(scene);
    this.rectangleProps = rectangleProps;
    this.setPosition(this.scene.scale.width / 5, this.scene.scale.height / 5);
    scene.add.existing(this);
  }

  public fillProgressBar(value: number): void {
    const {
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
      x,
      y,
      width,
      height,
      alpha,
    } = this.rectangleProps;
    this.clear();
    this.fillGradientStyle(topLeft, topRight, bottomLeft, bottomRight, alpha);
    this.fillRect(x, y, width * value, height);
  }
}
