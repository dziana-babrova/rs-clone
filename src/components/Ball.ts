import { ballSettings } from 'const/constants';
import { Scene } from 'phaser';
import { IComponent, Position } from 'types/types';
import MapService from 'services/MapService';
import TweenAnimationBuilder from 'utils/TweenAnimationBuilder';
import BallText from './BallText';
import Pulse from './Pulse';

export default class Ball extends Phaser.Physics.Matter.Sprite implements IComponent {
  scene: Scene;

  mapService: MapService;

  tweenAnimationBuilder: TweenAnimationBuilder;

  public isStopped = false;

  private pulse: Pulse;

  private text: BallText;

  constructor(scene: Scene, props: Position, level: number, tileSize: number) {
    super(scene.matter.world, props.x, props.y, 'ball');
    this.scene = scene;
    this.tweenAnimationBuilder = new TweenAnimationBuilder();
    this.mapService = new MapService(level, tileSize);
    this.setBallBody();
    this.scene.add.existing(this);
    this.pulse = new Pulse(scene);
    this.text = new BallText(scene);
  }

  private setBallBody() {
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

  update(): void {
    if (!this.body) return;
    const isStopped = Math.abs(this.body.velocity.x) < 0.1 && Math.abs(this.body.velocity.y) < 0.1;
    if (this.isStopped !== isStopped) {
      this.isStopped = isStopped;
      this.updateCircle();
    }
  }

  private updateCircle() {
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
}
