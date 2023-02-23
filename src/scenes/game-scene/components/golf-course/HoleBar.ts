import { textures } from 'const/TileConfig';
import { Scene } from 'phaser';
import { TextureKeys } from 'types/enums';
import EventNames from 'types/events';
import { LevelElements } from 'types/types';

export default class HoleBar extends Phaser.Physics.Matter.Sprite {
  constructor(scene: Scene, tile: LevelElements) {
    const { x, y } = tile;
    super(scene.matter.world, x, y + 3, TextureKeys.Platforms, textures.bar, {
      isSensor: true,
      isStatic: true,
    });
    this.width = 50;
    this.setDepth(90);
    scene.add.existing(this);
    scene.events.on(EventNames.Win, this.remove.bind(this));
  }

  remove() {
    this.destroy();
  }
}
