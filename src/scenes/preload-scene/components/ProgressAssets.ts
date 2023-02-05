import Phaser from 'phaser';

export default class ProgressAssets extends Phaser.GameObjects.Text {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    style: Phaser.Types.GameObjects.Text.TextStyle,
  ) {
    super(scene, x, y, text, style);
    const { width, height } = scene.cameras.main;
    this.x = width / 2;
    this.y = height / 2 + 105;
    this.setOrigin(0.5, 0.5);
    scene.add.existing(this);
  }

  public updateAssetName(image: Phaser.Loader.File): void {
    this.setText(`Loading asset: ${image.key}`);
  }
}
