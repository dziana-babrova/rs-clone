import Ball from 'components/Ball';
import Character from 'components/Character';
import Trajectory from 'components/Trajectory';
import characters from 'const/Characters';
import { ballSettings } from 'const/scenes/GameSceneConsts';
import { Scene } from 'phaser';
import CalculateService from 'services/CalculateService';
import { Controls } from 'types/enums';
import EventNames from 'types/events';
import { Position } from 'types/types';

export default class SingleplayerManager {
  scene: Scene;

  private ball: Ball;

  private trajectory: Trajectory;

  private isHit: boolean = false;

  private isActive: boolean = true;

  private startPosition: Position = { x: 0, y: 0 };

  private angle: number = ballSettings.DEFAULT_ANGLE;

  private distance: number = ballSettings.DEFAULT_DISTANCE;

  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  private controls: Controls | undefined;

  private character: Character;

  constructor(scene: Scene, ball: Ball, trajectory: Trajectory) {
    this.scene = scene;
    this.trajectory = trajectory;
    this.ball = ball;
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.character = new Character(scene, { x: -1000, y: -1000 }, characters[0]);
    this.ball.setDepth(100);
    this.character.setDepth(50).setAlpha(0);
    this.scene.events.on(EventNames.BallStop, this.showCharacter, this);
    this.scene.events.on(EventNames.ChangeTrajectory, this.changeCharacterScale, this);
    this.initEvents();
  }

  update() {
    // сheck ifActive - return
    if (!this.ball.isStopped) return;
    if (this.controls === Controls.Mouse) {
      this.setAngleAndDistance(this.scene.game.input.mousePointer);
      this.updateTrajectory();
      return;
    }
    this.handleKeyboardInput();
  }

  private initEvents() {
    this.scene.input.on('pointerdown', (event: PointerEvent, targets: unknown[]) => {
      // сheck ifActive - return
      if (targets.length) return;
      if (!this.ball.isStopped || this.isHit || this.controls === Controls.Keyboard) { return; }
      this.controls = Controls.Mouse;
      this.startAim({ x: event.x, y: event.y });
    });
    this.scene.input.on('pointerup', (event: PointerEvent) => {
      // сheck ifActive - return
      if (!this.isHit || this.controls !== Controls.Mouse) return;
      this.setAngleAndDistance({ x: event.x, y: event.y });
      this.hit();
    });
  }

  private handleKeyboardInput() {
    if (this.cursors.left.isDown) {
      this.distance -= 1;
      this.setKeyboardAsControl();
      this.updateTrajectory();
    }
    if (this.cursors.right.isDown) {
      this.distance += 1;
      this.setKeyboardAsControl();
      this.updateTrajectory();
    }
    if (this.cursors.down.isDown) {
      this.angle += 0.01;
      this.setKeyboardAsControl();
      this.updateTrajectory();
    }
    if (this.cursors.up.isDown) {
      this.angle -= 0.01;
      this.setKeyboardAsControl();
      this.updateTrajectory();
    }
    if (this.cursors.space.isDown) {
      this.hit();
    }
  }

  private setKeyboardAsControl() {
    if (this.controls !== Controls.Keyboard || !this.isHit) {
      this.controls = Controls.Keyboard;
      this.startAim({ x: 0, y: 0 });
    }
  }

  private updateTrajectory() {
    this.trajectory.hitAngle = this.angle;
    this.trajectory.distance = this.distance;
  }

  private startAim(position: Position) {
    if (!this.isHit) {
      this.startPosition = position;
      this.isHit = true;
      this.character.prepare();
    }
    this.scene.events.emit(
      EventNames.DragStart,
      { x: this.ball.x, y: this.ball.y },
    );
  }

  private setAngleAndDistance(endPoint: Position) {
    this.angle = Phaser.Math.Angle.Between(
      this.startPosition.x,
      this.startPosition.y,
      endPoint.x,
      endPoint.y,
    );
    this.distance = Phaser.Math.Distance.Between(
      this.startPosition.x,
      this.startPosition.y,
      endPoint.x,
      endPoint.y,
    );
  }

  private hit() {
    if (!this.isHit) return;
    this.character.hit();
    const { velocityX, velocityY } = CalculateService.calculateVelocityByAngleAndDistance(
      this.angle,
      this.distance,
    );
    this.ball.hitBall(velocityX, velocityY);
    if (Math.abs(velocityX) > 0.01 || Math.abs(velocityY) > 0.01) this.character.hide();
    this.scene.events.emit(EventNames.BallHit);
    this.setDefaultState();
  }

  private setDefaultState() {
    this.isHit = false;
    this.controls = undefined;
    this.angle = ballSettings.DEFAULT_ANGLE;
    this.distance = ballSettings.DEFAULT_DISTANCE;
  }

  private showCharacter() {
    this.character.setCharacterPosition({ x: this.ball.x, y: this.ball.y });
    this.character.show();
  }

  private changeCharacterScale(isPositive: boolean) {
    if (isPositive) {
      this.character.scaleX = Math.abs(this.character.scaleX);
    } else {
      this.character.scaleX = -Math.abs(this.character.scaleX);
    }
  }
}
