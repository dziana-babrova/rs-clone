import Phaser from 'phaser';
import { LevelElements } from '../../../../../common/types/types';

export default class TilesGroup extends Phaser.GameObjects.Group {
  constructor(scene: Phaser.Scene, tiles: LevelElements[]) {
    super(scene);

    tiles.forEach((tile) => {
      this.create(tile.x, tile.y, tile.texture);
    });
  }

  public create(x: number, y: number, texture: string): void {
    const tile = this.scene.matter.add.sprite(x, y, '');
    const bodyHeight = this.setBodyHeight(tile, texture);
    const bodyWidth = this.setBodyWidth(tile, texture);
    tile.setBody({ width: bodyWidth, height: bodyHeight }, { isStatic: true });
    this.add(tile);
  }

  private setBodyHeight(tile: Phaser.Physics.Matter.Sprite, texture: string): number {
    if (
      texture === 'ground.png'
      || texture === 'connector-right-bottom.png'
      || texture === 'connector-left-bootom.png'
      || texture === 'hole-end-right.png'
      || texture === 'hole-end-left.png'
    ) {
      tile.setY(tile.y + 7.5);
      return 41 - 15;
    // eslint-disable-next-line no-else-return
    } else if (texture === 'hole-black-bottom.png') {
      return 41 - 15;
    }

    return 41;
  }

  private setBodyWidth(tile: Phaser.Physics.Matter.Sprite, texture: string): number {
    if (
      texture === 'hole-end-right.png'
      || texture === 'hole-black-right.png'
      || texture === 'hole-black-right-bottom.png'
      || texture === 'hole-end-left.png'
      || texture === 'hole-black-left.png'
      || texture === 'hole-black-left-bottom.png'
    ) {
      return 36;
    }

    return 41;
  }
}
