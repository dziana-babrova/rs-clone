import Phaser from 'phaser';
import { LevelElements } from 'types/types';

export default class SlopeGroup extends Phaser.GameObjects.Group {
  scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.scene = scene;
  }

  public build(tiles: LevelElements[]) {
    tiles.forEach((tile) => {
      this.create(tile.x, tile.y, tile.texture);
    });
  }

  public create(x: number, y: number, texture: string): void {
    const tile = this.scene.matter.add.sprite(x + 7, y + 15, texture);
    tile.setTexture('platforms', texture);
    tile.setBody(
      {
        width: tile.width,
        height: tile.height,
      },
      {
        isStatic: true,
        vertices: [
          { x: tile.width, y: tile.height },
          { x: 0, y: tile.height },
          { x: tile.width, y: 0 },
        ],
      },
    );
    tile.setOrigin(0.67, 0.86);
    this.scene.add.existing(this);
  }
}
