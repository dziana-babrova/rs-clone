import { ballSettings } from 'client/const/scenes/GameSceneConsts';
import { Position } from 'common/types/types';

export default class CalculateService {
  static calculateVelocityByPoints(
    start: Position,
    end: Position,
  ): { velocityX: number; velocityY: number } {
    const angle = Phaser.Math.Angle.Between(start.x, start.y, end.x, end.y);
    const distance = Phaser.Math.Distance.Between(start.x, start.y, end.x, end.y);
    return this.calculateVelocityByAngleAndDistance(angle, distance);
  }

  static calculateVelocityByAngleAndDistance(
    angle: number,
    distance: number,
  ): { velocityX: number; velocityY: number } {
    const mouseVelocityX = Math.cos(angle) * distance * ballSettings.SPEED;
    const mouseVelocityY = Math.sin(angle) * distance * ballSettings.SPEED;
    return {
      velocityX: CalculateService.calculateMaxVelocity(mouseVelocityX),
      velocityY: CalculateService.calculateMaxVelocity(mouseVelocityY),
    };
  }

  private static calculateMaxVelocity(velocity: number) {
    return velocity > 0
      ? Math.min(velocity, ballSettings.MAX_SPEED)
      : Math.max(velocity, -ballSettings.MAX_SPEED);
  }

  static calculateVelocityByAngleInDegreesAndPower(
    angle: number,
    power: number,
  ): { velocityX: number; velocityY: number } {
    return {
      velocityX: Math.cos((angle * Math.PI) / 180) * power * 40,
      velocityY: Math.sin((angle * Math.PI) / 180) * power * 40,
    };
  }
}
