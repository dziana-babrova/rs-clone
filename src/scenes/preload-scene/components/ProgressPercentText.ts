import Phaser from 'phaser';
import { TextObjectProps } from 'types/types';

export default class ProgressPercentText extends Phaser.GameObjects.Text {
  constructor(scene: Phaser.Scene, textObject: TextObjectProps) {
    const {
      x, y, text, style,
    } = textObject;
    super(scene, x, y, text, style);
    const { width, height } = scene.cameras.main;
    this.x = width / 2;
    this.y = height / 2 + 65;
    this.setOrigin(0.5, 0.5);
    scene.add.existing(this);
  }

  public updatePercentage(value: number): void {
    this.setText(`${Math.round(value * 100)}%`);
  }
}
