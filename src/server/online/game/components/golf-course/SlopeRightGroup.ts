import Phaser from 'phaser';
import { LevelElements } from '../../../../../common/types/types';

/* eslint @typescript-eslint/no-unused-vars: 0 */
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
    const tile = this.scene.matter.add.sprite(x - 6.5, y + 22.5, '');
    tile.setBody(
      {
        width: 41,
        height: 41,
      },
      {
        isStatic: true,
        vertices: [
          { x: 0, y: 0 },
          { x: 41, y: 41 },
          { x: 0, y: 41 },
        ],
      },
    );
    tile.setOrigin(0.35, 0.86);
    this.add(tile);
  }
}
