import { ballSettings } from 'const/constants';
import { Position } from 'types/types';

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
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      velocityX: cos * distance * ballSettings.SPEED,
      velocityY: sin * distance * ballSettings.SPEED,
    };
  }
}
