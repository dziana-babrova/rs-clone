import { Scene } from 'phaser';
import { Position } from '../../types/types';
import { ballSettings } from '../const/BallProps';

export default class BallServer extends Phaser.Physics.Matter.Sprite {
  scene: Scene;
  player: 1 | 2;
  id: number;
  prevX: number;
  prevY: number;
  isNew = true;

  constructor(scene: Scene, position: Position, player: 1 | 2, id: number) {
    super(scene.matter.world, position.x, position.y, 'ball');
    this.scene = scene;
    this.player = player;
    this.prevX = position.x;
    this.prevY = position.y;
    this.id = id;
    this.setBallBody();
    this.scene.add.existing(this);
    this.body.gameObject.label = 'ball';
  }

  private setBallBody(): void {
    const props = ballSettings.BALL_PROPS;
    this.displayHeight = props.circleRadius * 2;
    this.displayWidth = props.circleRadius * 2;
    this.setCircle(props.circleRadius);
    this.setBounce(props.bounce);
    this.setFrictionAir(props.frictionAir);
    this.setFriction(props.friction);
    this.setFrictionStatic(props.frictionStatic);
    this.setMass(props.mass);
  }

  update(...args: any[]): void {
    this.checkBallPosition();
  }

  hitBall(velocityX: number, velocityY: number) {
    this.setVelocity(velocityX, velocityY);
  }

  public checkBallPosition(): void {
    if (this.x < 0 || this.x > this.scene.scale.width || this.y > this.scene.scale.height) {
      this.scene.events.emit('destroy-ball', this);
    }
  }

  updatePosition(){
    this.prevX = this.x;
    this.prevY = this.y;
    this.isNew = false;
    this.checkBallPosition();
  }

}
