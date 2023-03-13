import { TextureKeys } from 'common/types/enums';
import Phaser from 'phaser';
import { LevelElements } from 'common/types/types';

export default class SlopeRightGroup extends Phaser.GameObjects.Group {
  scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, tiles: LevelElements[]) {
    super(scene);
    this.scene = scene;

    tiles.forEach((tile) => {
      this.create(tile.x, tile.y, tile.texture);
    });
  }

  public create(x: number, y: number, texture: string): void {
    const tile = this.scene.matter.add.sprite(x - 6.5, y + 22.5, texture);
    tile.setTexture(TextureKeys.Platforms, texture);
    tile.setBody(
      {
        width: tile.width,
        height: tile.height,
      },
      {
        isStatic: true,
        vertices: [
          { x: 0, y: 0 },
          { x: tile.width, y: tile.height },
          { x: 0, y: tile.width },
        ],
      },
    );
    tile.setOrigin(0.35, 0.86);
    this.add(tile);
  }
}
