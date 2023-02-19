import { Scene } from 'phaser';

export default class SkyObject extends Phaser.Physics.Matter.Sprite {
  constructor(scene: Scene, x: number, minY: number, texture: string, frame: string, maxY: number) {
    super(scene.matter.world, x, minY, texture, frame, {
      isSensor: true,
      ignoreGravity: true,
      isStatic: true,
    });
    this.setX(this.x - this.width / 2);
    const randomY = this.getRandomY(minY, maxY);
    this.setY(randomY);
    scene.add.existing(this);
  }

  update(moveX: number, moveY: number, minY: number, maxY: number) {
    this.x += moveX;
    if (this.x > this.scene.scale.width / 2 - this.width / 2) {
      this.y += moveY;
    } else {
      this.y -= moveY;
    }
    if (this.x > this.scene.scale.width + this.width / 2) {
      this.setX(0 - this.width / 2);
      this.y = this.getRandomY(minY, maxY);
    }
  }

  getRandomY(minY: number, maxY: number) {
    return Phaser.Math.Between(minY, maxY);
  }
}
