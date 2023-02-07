import { ballSettings, trajectorySettings } from 'const/constants';
import { GameObjects, Scene } from 'phaser';
import CalculateService from 'services/CalculateService';
import EventNames from 'types/events';
import { IComponent, Position } from 'types/types';

export default class Trajectory extends GameObjects.Group implements IComponent {
  scene: Scene;

  private ballPosition: Position = { x: 0, y: 0 };

  private isAiming = false;

  public hitAngle: number = 0;

  public distance: number = 0;

  constructor(scene: Scene) {
    super(scene);
    this.scene = scene;
    const { RADIUS, NUM_OF_POINTS, COLOR } = trajectorySettings;
    // Create circles
    for (let i = 0; i < NUM_OF_POINTS; i += 1) {
      const circle = scene.add.circle(-100, -100, RADIUS, COLOR);
      circle.setAlpha((NUM_OF_POINTS - (i - 2)) / NUM_OF_POINTS);
      this.add(circle);
    }
    // Add event listeners
    this.scene.events.on(EventNames.DragStart, this.startTraceHandler, this);
    this.scene.events.on(EventNames.BallHit, this.endTraceHandler, this);
  }

  private startTraceHandler(ballPosition: Position) {
    this.ballPosition = ballPosition;
    this.isAiming = true;
    // We need little delay before the balls appear so that
    // the update method has time to update its positions
    setTimeout(() => {
      this.getChildren().forEach((child, id) => {
        (child as GameObjects.Arc).setAlpha(
          (trajectorySettings.NUM_OF_POINTS - (id - 2)) / trajectorySettings.NUM_OF_POINTS,
        );
      });
    }, 50);
  }

  private endTraceHandler() {
    this.isAiming = false;
    this.children.iterate((child) => {
      this.scene.tweens.add({
        targets: child,
        ease: 'Linear',
        duration: 500,
        alpha: 0,
      });
    });
  }

  update() {
    if (!this.isAiming) return;
    // Get potential speed
    let { velocityX, velocityY } = CalculateService.calculateVelocityByAngleAndDistance(
      this.hitAngle,
      this.distance,
    );
    // Get x and y to all points
    this.getChildren().forEach((child, id) => {
      const time = id * 3.5;
      const x = this.ballPosition.x + velocityX * time;
      // Y with gravity correction
      const y = this.ballPosition.y + velocityY * time + 0.1619 * time * time;
      const arc = child as GameObjects.Arc;
      arc.x = x;
      arc.y = y;
      // Change velocity according to friction with air
      velocityX *= 1 - ballSettings.ballProps.frictionAir;
      velocityY *= 1 - ballSettings.ballProps.frictionAir;
    });
  }
}
