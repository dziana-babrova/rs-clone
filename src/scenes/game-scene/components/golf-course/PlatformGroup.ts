import { TextureKeys } from 'types/enums';
import Phaser from 'phaser';
import { LevelElements } from 'types/types';

export default class TilesGroup extends Phaser.GameObjects.Group {
  constructor(scene: Phaser.Scene, tiles: LevelElements[]) {
    super(scene);

    tiles.forEach((tile) => {
      this.create(tile.x, tile.y, tile.texture);
    });
  }

  public create(x: number, y: number, texture: string): void {
    const tile = this.scene.matter.add.sprite(x, y, texture);

    tile.setTexture(TextureKeys.Platforms, texture);
    tile.setBody({ width: tile.width, height: tile.height - 15 }, { isStatic: true });
    this.add(tile);
  }
}
