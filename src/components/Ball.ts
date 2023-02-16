import { ballSettings } from 'const/constants';
import { Scene } from 'phaser';
import { IComponent, LevelElements, Position } from 'types/types';
import TweenAnimationBuilder from 'utils/TweenAnimationBuilder';
import BallText from './BallText';
import Pulse from './Pulse';

export default class Ball extends Phaser.Physics.Matter.Sprite implements IComponent {
  scene: Scene;

  public isStopped = false;

  private pulse: Pulse;

  private text: BallText;

  constructor(scene: Scene, position: Position) {
    super(scene.matter.world, position.x, position.y, 'ball');
    this.scene = scene;

    this.setBallBody();
    this.scene.add.existing(this);
    this.pulse = new Pulse(scene);
    this.text = new BallText(scene);
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

  hitBall(velocityX: number, velocityY: number) {
    this.setVelocity(velocityX, velocityY);
  }

  public deactivate(): void {
    this.pulse.destroy();
    this.text.destroy();
    this.isStopped = false;
    this.update = () => { };
  }
}
