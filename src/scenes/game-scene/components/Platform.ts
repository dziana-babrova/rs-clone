export default class TilesSingle extends Phaser.Physics.Matter.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene.matter.world, x, y, texture);

    this.setOrigin(0, 0);
    this.setTexture('platforms', texture);
    this.setStatic(true);
    scene.add.existing(this);
  }
}
