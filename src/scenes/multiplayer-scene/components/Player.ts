import Ball from 'components/Ball';
import { Scene } from 'phaser';
import CalculateService from 'services/CalculateService';
import { IComponent, IComponentManager, Position } from 'types/types';
import MultiplayerTrajectory from './MultiplayerTrajectory';
import PowerPanel from './PowerPanel';

export default class Player {
  isReverse: boolean;
  position: Position;
  scene: Scene;
  balls: Phaser.GameObjects.Group;
  currentBall: Ball | null;
  trajectory: MultiplayerTrajectory;
  powerPanel: PowerPanel;
  isAvailable = true;
  isHit = false;

  constructor(scene: Scene, position: Position, isReverse: boolean) {
    this.scene = scene;
    this.position = position;
    this.balls = scene.add.group();
    this.currentBall = new Ball(this.scene, { x: position.x, y: position.y - 30 });
    if (isReverse) {
      this.currentBall.setTint(0x00ffff);
    }
    this.trajectory = new MultiplayerTrajectory(scene, position, isReverse);
    this.powerPanel = new PowerPanel(this.scene, position, isReverse);
    this.isReverse = isReverse;
  }

  addBall(position: Position) {
    setTimeout(() => {
      const ball = new Ball(this.scene, { x: position.x, y: position.y - 30 });
      this.balls.add(ball);
      this.currentBall = ball;
      if (this.isReverse) {
        this.currentBall.setTint(0xFF00000);
      }
      this.isAvailable = true;
      this.trajectory.resume();
    }, 1000);
  }

  hit() {
    const angle = this.trajectory.angle;
    const power = this.powerPanel.indicator.width / 200;
    console.log(-Math.abs(angle));
    const { velocityX, velocityY } = CalculateService.calculateVelocityByAngleInDegreesAndPower(
      -Math.abs(angle),
      power,
    );
    console.log(velocityX, velocityY);
    this.currentBall?.hitBall(this.isReverse ? -velocityX : velocityX, velocityY);
    this.currentBall = null;
    this.isHit = false;
    this.isAvailable = false;
    this.addBall(this.position);
  }

  fixAngle() {
    this.trajectory.stop();
    this.isHit = true;
  }

  showPower() {
    this.powerPanel.animate();
  }

  fixPower() {
    this.powerPanel.stop();
  }
}
