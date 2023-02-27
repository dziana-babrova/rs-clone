/* eslint-disable no-param-reassign */
import { Scene } from 'phaser';
import { Level, LevelElements, SawType } from 'common/types/types';
import { EventNames } from 'common/types/events';

export default class SawGroup extends Phaser.GameObjects.Group {
  coordinates: { x: number; y: number }[];

  directionX: number;

  directionY: number;

  rotationAngle: number;

  distance: number;

  sawType: SawType;

  duration: number;

  constructor(scene: Scene, tiles: LevelElements[], level: Level) {
    super(scene);
    this.coordinates = [];
    this.directionX = level.saw ? level.saw.directionX : 0;
    this.directionY = level.saw ? level.saw.directionY : 0;
    this.rotationAngle = level.saw ? level.saw.angle : 0;
    this.distance = level.saw ? level.saw.distance : 0;
    this.duration = level.saw ? level.saw.duration : 0;
    this.sawType = level.saw ? level.saw.type : '';

    tiles.forEach((tile, index) => {
      this.create(tile.x, tile.y, tile.texture, index);
      this.coordinates.push({ x: tile.x, y: tile.y });
    });

    this.scene.add.existing(this);
  }

  public create(x: number, y: number, texture: string, index: number): void {
    const saw = this.scene.matter.add.sprite(x, y, texture);
    saw.setX(saw.x - saw.width / 5);
    saw.setCircle(saw.width / 2, { isStatic: true });
    saw.displayHeight = saw.height * 0.75;
    saw.displayWidth = saw.width * 0.75;
    this.add(saw, true);
    if (this.sawType === 'move') this.move(saw, index);
  }

  public update(): void {
    this.getChildren().forEach((el, index) => {
      Phaser.Actions.Rotate([el], 0.5, 1);
      const saw = el as Phaser.GameObjects.Sprite;
      if (this.sawType === 'rotate') this.rotateSaw(saw, index);
    });
  }

  private rotateSaw(saw: Phaser.GameObjects.Sprite, index: number): void {
    Phaser.Actions.RotateAroundDistance(
      [saw],
      { x: this.coordinates[index].x, y: this.coordinates[index].y },
      this.rotationAngle,
      this.distance,
    );
  }

  private move(saw: Phaser.GameObjects.Sprite, index: number) {
    // eslint-disable-next-line no-nested-ternary
    const directionX = this.directionX === 0 ? 0 : index % 2 === 0 ? 1 : -1;
    console.log(directionX);
    const tween = this.scene.tweens.add({
      targets: saw,
      x: { from: saw.x, to: saw.x + (directionX * this.distance) },
      y: { from: saw.y, to: saw.y + (this.directionY * this.distance) },
      ease: 'Power0',
      duration: this.duration,
      yoyo: true,
      repeat: -1,
    });
    this.scene.events.on(EventNames.GameOver, () => {
      tween.complete(0);
    });
  }
}
