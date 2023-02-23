/* eslint-disable no-param-reassign */
import { TextureKeys } from 'types/enums';
import Phaser from 'phaser';
import { LevelElements } from 'types/types';
import { textures } from 'const/TileConfig';

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
    const bodyHeight = this.setBodyHeight(tile, texture);
    const bodyWidth = this.setBodyWidth(tile, texture);
    tile.setBody({ width: bodyWidth, height: bodyHeight }, { isStatic: true, density: 100 });
    this.add(tile);
  }

  private setBodyHeight(tile: Phaser.Physics.Matter.Sprite, texture: string): number {
    if (
      texture === textures.ground
      || texture === textures.connectorRightBottom
      || texture === textures.connectorLeftBottom
      || texture === textures.holeEndRight
      || texture === textures.holeEndLeft
    ) {
      tile.setY(tile.y + 7.5);
      return tile.height - 15;
    // eslint-disable-next-line no-else-return
    } else if (texture === textures.holeBlackBottom) {
      return tile.height - 15;
    }

    return tile.height;
  }

  private setBodyWidth(tile: Phaser.Physics.Matter.Sprite, texture: string): number {
    if (
      texture === textures.holeEndRight
      || texture === textures.holeBlackRight
      || texture === textures.holeBlackRightBottom
      || texture === textures.holeEndLeft
      || texture === textures.holeBlackLeft
      || texture === textures.holeBlackLeftBottom
    ) {
      return tile.width - 5;
    }

    return tile.width;
  }
}
