export default class TilesSingle extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    this.setOrigin(0, 0);
    this.setTexture('platforms', texture);
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
  }
}
