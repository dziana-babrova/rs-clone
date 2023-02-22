import Phaser from 'phaser';
import { LevelElements } from 'types/types';
import { TextureKeys } from 'types/enums';

export default class WaterGroup extends Phaser.GameObjects.Group {
  constructor(scene: Phaser.Scene, tiles: LevelElements[]) {
    super(scene);

    tiles.forEach((tile) => {
      this.create(tile.x, tile.y, tile.texture);
    });

    scene.add.existing(this);
  }

  public create(x: number, y: number, texture: string): void {
    const tile = this.scene.add.sprite(x, y, TextureKeys.Platforms, texture);
    this.add(tile);
  }
}
