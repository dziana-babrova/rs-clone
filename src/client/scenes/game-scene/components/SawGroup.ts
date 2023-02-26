/* eslint-disable no-param-reassign */
import { Scene } from 'phaser';
import { Level, LevelElements, SawType } from 'common/types/types';

export default class SawGroup extends Phaser.GameObjects.Group {
  coordinates: { x: number; y: number }[];

  directionX: number;

  directionY: number;

  rotationAngle: number;

  distance: number;

  sawType: SawType;

  constructor(scene: Scene, tiles: LevelElements[], level: Level) {
    super(scene);
    this.coordinates = [];
    this.directionX = level.saw ? level.saw.directionX : 0;
    this.directionY = level.saw ? level.saw.directionY : 0;
    this.rotationAngle = level.saw ? level.saw.angle : 0;
    this.distance = level.saw ? level.saw.distance : 0;
    this.sawType = level.saw ? level.saw.type : '';

    tiles.forEach((tile) => {
      this.create(tile.x, tile.y, tile.texture);
      this.coordinates.push({ x: tile.x, y: tile.y });
    });

    this.scene.add.existing(this);
  }

  public create(x: number, y: number, texture: string): void {
    const saw = this.scene.matter.add.sprite(x, y, texture);
    saw.setX(saw.x - (saw.width / 5));
    saw.setCircle(saw.width / 2, { isStatic: true });
    saw.displayHeight = saw.height * 0.75;
    saw.displayWidth = saw.width * 0.75;
    this.add(saw, true);
  }

  public update(): void {
    this.getChildren().forEach((el, index) => {
      Phaser.Actions.Rotate([el], 0.5, 1);
      const saw = el as Phaser.GameObjects.Sprite;
      this.defineSawType(this.sawType, saw, index);
    });
  }

  private defineSawType(sawType: SawType, saw: Phaser.GameObjects.Sprite, index: number): void {
    switch (sawType) {
      case 'rotate':
        this.rotateSaw(saw, index);
        break;
      case 'move':
        this.move(saw, index);
        break;
      default:
        break;
    }
  }

  private rotateSaw(saw: Phaser.GameObjects.Sprite, index: number): void {
    Phaser.Actions.RotateAroundDistance(
      [saw],
      { x: this.coordinates[index].x, y: this.coordinates[index].y },
      this.rotationAngle,
      this.distance,
    );
  }

  private move(saw: Phaser.GameObjects.Sprite, index: number): void {
    saw.x += this.directionX;
    saw.y += this.directionY;

    if (saw.x > this.coordinates[index].x + this.distance) {
      console.log(saw.x);
      this.directionX = -this.directionX;
    } else if (saw.x < this.coordinates[index].x - this.distance) {
      console.log(saw.x);
      this.directionX = -this.directionX;
    }

    if (saw.y > this.coordinates[index].y + this.distance) {
      this.directionY = -this.directionY;
    } else if (saw.y < this.coordinates[index].y - this.distance) {
      this.directionY = -this.directionY;
    }
  }
}
