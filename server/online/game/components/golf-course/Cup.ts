import { Scene } from 'phaser';
import { LevelElements } from '../../../types/types';

export default class Cup extends Phaser.Physics.Matter.Sprite {
  constructor(scene: Scene, tile: LevelElements) {
    const { x, y, texture } = tile;
    super(scene.matter.world, x, y, texture);

    this.setBody({ width: this.width, height: this.height }, { isSensor: true, isStatic: true });
    this.setZ(-1);
  }
}
