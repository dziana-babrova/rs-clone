import Ball from 'client/components/Ball';
import {
  animations,
  playerProps,
  powerIndicatorProps,
} from 'client/const/scenes/MultiplayerSceneConsts';
import Map from 'client/scenes/game-scene/components/Map';
import Player from 'client/scenes/multiplayer-scene/components/Player';
import TweenAnimationBuilder from 'client/utils/TweenAnimationBuilder';
import { Position, ServerBalls } from 'common/types/types';
import { Scene } from 'phaser';
import CalculateService from './CalculateService';

export default class OnlineSceneService {
  scene: Scene;

  animationBuilder: TweenAnimationBuilder;

  constructor(scene: Scene) {
    this.scene = scene;
    this.animationBuilder = new TweenAnimationBuilder();
  }

  public deserializeBalls(balls: string): ServerBalls {
    const init: ServerBalls = {};
    const arr = balls.split('#');
    arr.pop();
    return arr.reduce((acc, el) => {
      const elems = el.split('%');
      const id = elems[0];
      acc[id] = {
        player: elems[1],
        x: parseInt(elems[2], 36),
        y: parseInt(elems[3], 36),
      };
      return acc;
    }, init);
  }

  public mapServerBallsToBalls(serverBalls: ServerBalls): { [key: string]: Ball } {
    const balls: { [key: string]: Ball } = {};
    Object.entries(serverBalls).forEach((el) => {
      const ball = new Ball(this.scene, { x: Number(el[1].x), y: Number(el[1].y) });
      if (el[1].player === '2') {
        ball.setTint(playerProps.secondBallColor);
      }
      ball.setDepth(100);
      (ball.body as MatterJS.BodyType).isStatic = true;
      (ball.body as MatterJS.BodyType).circleRadius = 0;
      const id = el[0];
      balls[id] = ball;
    });
    return balls;
  }

  /* eslint-disable no-param-reassign */
  public updateBalls(sceneBalls: { [key: string]: Ball }, ballsString: string): void {
    const arr = ballsString.split('#');
    arr.pop();
    arr.forEach((el) => {
      const elems = el.split('%');
      const [id, player, x, y] = elems;
      const numX = parseInt(x, 36);
      const numY = parseInt(y, 36);
      const target = sceneBalls[id];
      if (target) {
        target.x = numX;
        target.y = numY;
      } else {
        const ball = new Ball(this.scene, { x: numX, y: numY });
        if (player === '2') {
          ball.setTint(playerProps.secondBallColor);
        }
        ball.setDepth(100);
        (ball.body as MatterJS.BodyType).isStatic = true;
        (ball.body as MatterJS.BodyType).circleRadius = 0;
        sceneBalls[id] = ball;
      }
    });
  }
  /* eslint-enable no-param-reassign */

  public createStaticPlayer(position: Position, isReverse: boolean, id: number): Player {
    const player = new Player(this.scene, { x: position.x, y: position.y }, isReverse, id);
    player.isAvailable = false;
    player.trajectory.stop();
    player.currentBall?.destroy();
    return player;
  }

  async hideTarget(target: Map): Promise<void> {
    const { y, ease, duration } = animations.hideAnimation;
    await this.animationBuilder.moveY(this.scene, target, y, ease, duration);
  }

  async showTarget(target: Map): Promise<void> {
    const { y, ease, duration } = animations.showAnimation;
    await this.animationBuilder.moveY(this.scene, target, y, ease, duration);
  }

  public getBallVelocity(player: Player): { velocityX: number; velocityY: number } {
    const { angle } = player.trajectory;
    const power = player.powerPanel.indicator.width / powerIndicatorProps.width;
    return CalculateService.calculateVelocityByAngleInDegreesAndPower(-Math.abs(angle), power);
  }
}
