import Phaser from 'phaser';
import { LevelElements } from 'common/types/types';
import { TextureKeys } from 'common/types/enums';
import { textures } from 'client/const/TileConfig';

export default class TunnelGroup extends Phaser.GameObjects.Group {
  constructor(scene: Phaser.Scene, tiles: LevelElements[]) {
    super(scene);

    tiles.forEach((tile) => {
      this.create(tile.x, tile.y, tile.texture);
    });
  }

  public create(x: number, y: number, texture: string): void {
    const tile = this.scene.matter.add.sprite(x, y, texture, undefined);
    tile.setTexture(TextureKeys.Platforms, texture);
    tile.setBody({ width: tile.width, height: tile.height }, { isSensor: true, isStatic: true });
    this.add(tile);
    if (texture === textures.holeCenter) {
      tile.setY(tile.y + 7.5);
    }
  }
}
