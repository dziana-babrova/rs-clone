import Ball from 'client/components/Ball';
import Character from 'client/components/Character';
import characters from 'client/const/Characters';
import { playerProps, powerIndicatorProps } from 'client/const/scenes/MultiplayerSceneConsts';
import { Scene } from 'phaser';
import CalculateService from 'client/services/CalculateService';
import { Position } from 'common/types/types';
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

  character: Character;

  constructor(scene: Scene, position: Position, isReverse: boolean, id: number) {
    this.scene = scene;
    this.position = position;
    this.balls = scene.add.group();
    this.character = new Character(scene, position, characters[id === 1 ? 0 : 1]);
    this.character.setDepth(50);
    this.currentBall = new Ball(this.scene, { x: position.x, y: position.y - 30 });
    if (isReverse) {
      this.currentBall.setTint(playerProps.secondBallColor);
      this.character.scaleX = -this.character.scaleX;
    }
    this.trajectory = new MultiplayerTrajectory(scene, position, isReverse);
    this.powerPanel = new PowerPanel(this.scene, position, isReverse);
    this.powerPanel.setDepth(105);
    this.isReverse = isReverse;
    this.id = id;
  }

  private addBall(position: Position) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const ball = new Ball(this.scene, { x: position.x, y: position.y - 30 });
        this.currentBall = ball;
        ball.setDepth(100);
        if (this.isReverse) {
          this.currentBall.setTint(playerProps.secondBallColor);
        }
        this.isAvailable = true;
        this.trajectory.resume();
        resolve(null);
      }, 1000);
    });
  }

  async hit(): Promise<void> {
    this.balls.add(this.currentBall!);
    const { angle } = this.trajectory;
    const power = this.powerPanel.indicator.width / powerIndicatorProps.width;
    const { velocityX, velocityY } = CalculateService.calculateVelocityByAngleInDegreesAndPower(
      -Math.abs(angle),
      power,
    );
    this.character.hit();
    this.currentBall?.hitBall(this.isReverse ? -velocityX : velocityX, velocityY);
    this.currentBall = null;
    this.isHit = false;
    this.isAvailable = false;
    await this.addBall(this.position);
  }

  public fixAngle(): void {
    this.trajectory.stop();
    this.isHit = true;
    this.character.prepare();
  }

  public showPower(): void {
    this.powerPanel.animate();
  }

  public fixPower(): void {
    this.powerPanel.stop();
  }

  destroyPlayer() {
    this.currentBall?.destroy();
    this.character.destroy();
    this.powerPanel.destroy();
    this.trajectory.destroy();
  }
}
