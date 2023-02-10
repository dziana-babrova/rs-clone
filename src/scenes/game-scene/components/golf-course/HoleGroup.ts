import Phaser from 'phaser';
import { LevelElements } from 'types/types';

export default class TunnelGroup extends Phaser.GameObjects.Group {
  scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.scene = scene;
  }

  public build(tiles: LevelElements[]): void {
    tiles.forEach((tile) => {
      this.create(tile.x, tile.y, tile.texture);
    });
  }

  public create(x: number, y: number, texture: string): void {
    const tile = this.scene.add.sprite(x, y, texture);

    tile.setTexture('platforms', texture);
    this.scene.add.existing(this);
  }
}
