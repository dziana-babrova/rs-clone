import { ballSettings } from 'client/const/scenes/GameSceneConsts';
import SoundService from 'client/services/SoundService';
import { SoundsKeys, TextureKeys } from 'common/types/enums';
import { EventNames } from 'common/types/events';
import { IComponent, Position } from 'common/types/types';
import { Scene } from 'phaser';
import BallText from './BallText';
import Pulse from './Pulse';

export default class Ball extends Phaser.Physics.Matter.Sprite implements IComponent {
  scene: Scene;

  public isStopped = false;

  private pulse: Pulse;

  private text: BallText;

  constructor(scene: Scene, position: Position) {
    super(scene.matter.world, position.x, position.y, TextureKeys.Ball);
    this.scene = scene;
    this.setBallBody();
    this.scene.add.existing(this);
    this.pulse = new Pulse(scene);
    this.text = new BallText(scene);
    this.setDepth(100);
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

  public update(): void {
    if (!this.body) return;
    const isStopped = Math.abs(this.body.velocity.x) < 0.1 && Math.abs(this.body.velocity.y) < 0.1;
    if (this.isStopped !== isStopped) {
      this.isStopped = isStopped;
      this.updateCircle();
      setTimeout(() => {
        if (this.isStopped) this.scene.events.emit(EventNames.BallStop);
      }, 200);
    }
  }

  private updateCircle(): void {
    if (this.isStopped) {
      this.pulse.x = this.x;
      this.pulse.y = this.y;
      this.pulse.pulse();
      this.text.x = this.x;
      this.text.y = this.y;
      this.text.show();
    } else {
      this.pulse.stopPulse();
      this.text.stop();
    }
  }

  public hitBall(velocityX: number, velocityY: number): void {
    this.setVelocity(velocityX, velocityY);
    SoundService.playSound(this.scene, SoundsKeys.Hit);
  }

  public checkBallPosition(isGameOver: boolean): void {
    if (
      !isGameOver
      && (this.x < 0
        || this.x > this.scene.scale.width
        || this.y > this.scene.scale.height)
    ) {
      this.scene.events.emit(EventNames.GameOver);
    }
  }

  public deactivate(): void {
    this.setDepth(0);
    this.pulse.destroy();
    this.text.destroy();
    this.isStopped = false;
    this.update = () => {};
  }
}
