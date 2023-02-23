import Phaser from 'phaser';
import { LevelElements } from '../../../types/types';

export default class TunnelGroup extends Phaser.GameObjects.Group {
  bar!: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, tiles: LevelElements[]) {
    super(scene);

    tiles.forEach((tile) => {
      this.create(tile.x, tile.y, tile.texture);
    });
  }

  public create(x: number, y: number, texture: string): void {
    const tile = this.scene.matter.add.sprite(x, y, '', undefined);
    tile.setBody({ width: 41, height: 41 }, { isSensor: true, isStatic: true });
    this.add(tile);
    if (texture === 'hole-center.png') {
      tile.setY(tile.y + 7.5);
    }
  }
}
