import Phaser from 'phaser';
import { LevelElements } from 'types/types';
import Slope from './Slope';

export default class SlopeGroup extends Phaser.GameObjects.Group {
  constructor(scene: Phaser.Scene, tiles: LevelElements[]) {
    super(scene);

    tiles.forEach((tile) => {
      this.add(new Slope(scene, tile.x, tile.y, tile.texture, 6));
    });
  }
}
