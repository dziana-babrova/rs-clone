export default class TilesSingle extends Phaser.Physics.Matter.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene.matter.world, x, y, texture);

    this.setTexture('platforms', texture);
    this.setBody({ width: this.width, height: this.height }, { isStatic: true });
    scene.add.existing(this);
  }
}
