import Ball from 'components/Ball';
import { playerProps, powerIndicatorProps } from 'const/scenes/MultiplayerSceneConsts';
import { Scene } from 'phaser';
import CalculateService from 'services/CalculateService';
import { Position } from 'types/types';
import MultiplayerTrajectory from './MultiplayerTrajectory';
import PowerPanel from './PowerPanel';

export default class Player {
  id: number;

  isReverse: boolean;

  position: Position;

  scene: Scene;

  balls: Phaser.GameObjects.Group;

  currentBall: Ball | null;

  trajectory: MultiplayerTrajectory;

  powerPanel: PowerPanel;

  isAvailable = true;

  isHit = false;

  score = 0;

  constructor(scene: Scene, position: Position, isReverse: boolean, id: number) {
    this.scene = scene;
    this.position = position;
    this.balls = scene.add.group();
    this.currentBall = new Ball(this.scene, { x: position.x, y: position.y - 30 });
    if (isReverse) {
      this.currentBall.setTint(playerProps.secondBallColor);
    }
    this.trajectory = new MultiplayerTrajectory(scene, position, isReverse);
    this.powerPanel = new PowerPanel(this.scene, position, isReverse);
    this.isReverse = isReverse;
    this.id = id;
  }

  addBall(position: Position) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const ball = new Ball(this.scene, { x: position.x, y: position.y - 30 });
        this.currentBall = ball;
        if (this.isReverse) {
          this.currentBall.setTint(playerProps.secondBallColor);
        }
        this.isAvailable = true;
        this.trajectory.resume();
        resolve(null);
      }, 1000);
    });
  }

  async hit() {
    this.balls.add(this.currentBall!);
    const { angle } = this.trajectory;
    const power = this.powerPanel.indicator.width / powerIndicatorProps.width;
    const { velocityX, velocityY } = CalculateService.calculateVelocityByAngleInDegreesAndPower(
      -Math.abs(angle),
      power,
    );
    this.currentBall?.hitBall(this.isReverse ? -velocityX : velocityX, velocityY);
    this.currentBall = null;
    this.isHit = false;
    this.isAvailable = false;
    await this.addBall(this.position);
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
