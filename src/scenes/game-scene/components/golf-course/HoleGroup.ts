import Phaser from 'phaser';
import { LevelElements } from 'types/types';
import TextureKeys from 'const/TextureKeys';

export default class TunnelGroup extends Phaser.GameObjects.Group {
  constructor(scene: Phaser.Scene, tiles: LevelElements[]) {
    super(scene);

    tiles.forEach((tile) => {
      this.create(tile.x, tile.y, tile.texture);
    });
  }

  public create(x: number, y: number, texture: string): void {
    const tile = this.scene.add.sprite(x, y, texture);

    tile.setTexture(TextureKeys.Platforms, texture);
    this.add(tile);
  }
}
