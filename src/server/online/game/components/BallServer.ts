import { Scene } from 'phaser';
import { ServerSideEvents } from '../../../../common/types/events';
import { Position } from '../../../../common/types/types';
import { ballSettings } from '../const/OnlineGameProps';

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
  }

  private setBallBody(): void {
    const props = ballSettings.BALL_PROPS;
    this.displayHeight = props.circleRadius * 2;
    this.displayWidth = props.circleRadius * 2;
    this.setCircle(props.circleRadius);
    this.setBounce(props.bounce);
    (this.body as MatterJS.BodyType).render.lineThickness = 10;
  }

  hitBall(velocityX: number, velocityY: number) {
    this.setVelocity(velocityX, velocityY);
  }

  public checkBallPosition(): void {
    if (
      this.x < -100
      || this.x > this.scene.scale.width + 100
      || this.y > this.scene.scale.height + 100
    ) {
      this.scene.events.emit(ServerSideEvents.DestroyBall, this);
    }
  }

  updatePosition() {
    this.prevX = this.x;
    this.prevY = this.y;
    this.isNew = false;
    this.checkBallPosition();
  }
}
