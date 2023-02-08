export default class Slope extends Phaser.Physics.Matter.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, moveValue: number) {
    super(scene.matter.world, x + moveValue, y + moveValue, texture);

    this.setTexture('platforms', texture);
    this.setBody(
      {
        width: this.width, height: this.height,
      },
      {
        isStatic: true,
        vertices: [
          { x: this.width, y: this.height }, { x: 0, y: this.height }, { x: this.width, y: 0 },
        ],
      },
    );
    scene.add.existing(this);
  }
}
