import { Scene } from 'phaser';
import { TextureKeys } from 'types/enums';
import { LevelElements } from 'types/types';

export default class HoleBar extends Phaser.Physics.Matter.Sprite {
  constructor(scene: Scene, tile: LevelElements) {
    const { x, y } = tile;
    super(scene.matter.world, x, y + 3, TextureKeys.Platforms, 'hole-grass.png', { isSensor: true, isStatic: true });
    this.width = 50;
    this.setDepth(100);
    scene.add.existing(this);
  }
}
