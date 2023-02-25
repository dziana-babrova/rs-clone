import { botAngle, botPower, botTimer } from 'client/const/scenes/MultiplayerSceneConsts';
import { EventNames } from 'common/types/events';
import { Position } from 'common/types/types';
import { Scene } from 'phaser';
import Player from './Player';

export default class GameBot extends Player {
  timer: NodeJS.Timeout | null = null;

  constructor(scene: Scene, position: Position, isReverse: boolean, id: number) {
    super(scene, position, isReverse, id);
    this.trajectory.stop();
    this.trajectory.alpha = 0;
  }

  public startBot(): void {
    this.timer = setTimeout(this.tick.bind(this), this.getRandomNum(botTimer.start, botTimer.end));
  }

  public stopBot() {
    if (this.timer) clearTimeout(this.timer);
  }

  private getRandomNum(start: number, end: number): number {
    return Math.floor(Math.random() * (start - end + 1) + end);
  }

  async tick(): Promise<void> {
    await this.hitBotBall();
    this.timer = setTimeout(this.tick.bind(this), this.getRandomNum(botTimer.start, botTimer.end));
  }

  protected async hitBotBall(): Promise<void> {
    if (!this.isAvailable) return;
    this.trajectory.angle = -this.getRandomNum(botAngle.start, botAngle.end);
    this.powerPanel.indicator.width = this.getRandomNum(botPower.start, botPower.end);
    await this.hit();
    this.scene.events.emit(EventNames.GameBotHit);
  }
}
