import Phaser from 'phaser';
import { LevelElements } from 'types/types';
import TextureKeys from 'const/TextureKeys';
import TweenAnimationBuilder from 'utils/TweenAnimationBuilder';

export default class StarsGroup extends Phaser.GameObjects.Group {
  tweenAnimationBuilder: TweenAnimationBuilder;

  constructor(scene: Phaser.Scene, tiles: LevelElements[]) {
    super(scene);
    this.tweenAnimationBuilder = new TweenAnimationBuilder();

    tiles.forEach((tile) => {
      this.create(tile.x, tile.y, tile.texture);
    });
  }

  public create(x: number, y: number, texture: string): void {
    const tile = this.scene.add.sprite(x, y, texture);

    tile.setTexture(TextureKeys.Platforms, texture);
    this.add(tile);
  }

  public show() {
    this.tweenAnimationBuilder.moveY(this.scene, this, 300, 'Quad', 100);
  }
}
