import Phaser from 'phaser';
import { LevelElements } from 'types/types';
import TilesSingle from './Platform';

export default class TilesGroup extends Phaser.GameObjects.Group {
  constructor(scene: Phaser.Scene, tiles: LevelElements[]) {
    super(scene);

    tiles.forEach((tile) => {
      this.add(new TilesSingle(scene, tile.x, tile.y, tile.texture));
    });
  }
}
