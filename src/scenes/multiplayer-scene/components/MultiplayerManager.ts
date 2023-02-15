import { Scene } from 'phaser';
import ElementTypeKeys from 'const/ElementTypeKeys';
import MapService from 'services/MapService';
import Ball from 'components/Ball';
import Trajectory from 'components/Trajectory';
import MultiplayerService from 'services/MultiplayerService';
import Map from 'scenes/game-scene/components/Map';
import { multiPlayerMap, targets } from 'const/Multiplayer';
import { Level, Position } from 'types/types';
import { Template } from 'webpack';
import TweenAnimationBuilder from 'utils/TweenAnimationBuilder';
import MULTIPLAYER_ANIMATION from 'const/MultiplayerAnimation';

export default class MultiplayerManager extends Phaser.GameObjects.Container {
  mapService: MultiplayerService;

  map!: Map;

  target!: Map;

  ball!: Ball;

  trajectory!: Trajectory;
  animationBuilder: TweenAnimationBuilder;

  constructor(scene: Scene, tileSize: number) {
    super(scene);
    this.mapService = new MultiplayerService(tileSize);
    this.animationBuilder = new TweenAnimationBuilder();
  }

  async createMap() {
    this.map = this.createTemplate(multiPlayerMap);
    await this.map.animate();
    // this.ball = new Ball(this.scene, ballConfig);
    // this.trajectory = new Trajectory(this.scene);
  }

  async switchTarget(target: number) {
    if (this.target) {
      await this.hideTarget();
    }
    this.target = this.createTemplate(targets[target]);
    this.target.x = this.scene.cameras.main.centerX - this.target.getBounds().width / 2;
    this.target.y = 0;
    await this.showTarget();
  }

  private createTemplate(level: Level) {
    const mapElements = this.mapService.createLevelConfig(level);
    const groundConfig = mapElements.filter((el) => el.type === ElementTypeKeys.Tile);
    const leftSlopeConfig = mapElements.filter((el) => el.type === ElementTypeKeys.LeftSlope);
    const rightSlopeConfig = mapElements.filter((el) => el.type === ElementTypeKeys.RightSlope);
    const holeConfig = mapElements.filter(
      (el) => el.type === ElementTypeKeys.Hole || el.type === ElementTypeKeys.HoleWithCoin,
    );

    const starsConfig = mapElements.filter(
      (el) => el.type === ElementTypeKeys.Star || el.type === ElementTypeKeys.HoleWithCoin,
    );
    const ballConfig = mapElements.filter((el) => el.type === ElementTypeKeys.Ball);

    const template = new Map(
      this.scene,
      groundConfig,
      leftSlopeConfig,
      rightSlopeConfig,
      holeConfig
    );
    return template;
  }

  private hideTarget() {
    const { y, ease, duration } = MULTIPLAYER_ANIMATION.hideAnimation;
    this.animationBuilder.moveY(this.scene, this.target, y, ease, duration);
  }

  private showTarget() {
    const { y, ease, duration } = MULTIPLAYER_ANIMATION.showAnimation;
    this.animationBuilder.moveY(this.scene, this.target, y, ease, duration);
  }
}
