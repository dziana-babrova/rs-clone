import { Scene } from 'phaser';
import ElementTypeKeys from 'const/ElementTypeKeys';
import TweenAnimationService from 'utils/TweenAnimationBuilder';
import GAME_SCENE_ANIMATION from 'const/GameSceneAnimationConsts';
import TunnelGroup from './golf-course/HoleGroup';
import MapCreatorService from '../../../services/MapCreatorService';
import TilesGroup from './golf-course/PlatformGroup';
import SlopeLeftGroup from './golf-course/SlopeLeftGroup';
import SlopeRightGroup from './golf-course/SlopeRightGroup';

export default class World extends Phaser.GameObjects.Container {
  map: MapCreatorService;

  tweenAnimationService: TweenAnimationService;

  constructor(scene: Scene, level: number, tileSize: number) {
    super(scene);

    this.tweenAnimationService = new TweenAnimationService();
    this.map = new MapCreatorService(level, tileSize);
    this.build();
  }

  public build(): void {
    const groundConfig = this.map.mapElements.filter((el) => el.type === ElementTypeKeys.Tile);
    const leftSlopeConfig = this.map.mapElements.filter(
      (el) => el.type === ElementTypeKeys.LeftSlope,
    );
    const rightSlopeConfig = this.map.mapElements.filter(
      (el) => el.type === ElementTypeKeys.RightSlope,
    );
    const holeConfig = this.map.mapElements.filter(
      (el) => el.type === ElementTypeKeys.Hole || el.type === ElementTypeKeys.HoleWithCoin,
    );

    const ground = new TilesGroup(this.scene, groundConfig);
    const leftSlope = new SlopeLeftGroup(this.scene, leftSlopeConfig);
    const rightSlope = new SlopeRightGroup(this.scene, rightSlopeConfig);
    const hole = new TunnelGroup(this.scene, holeConfig);

    const groundElements = ground.getChildren();
    const leftSlopeElements = leftSlope.getChildren();
    const rightSlopeElements = rightSlope.getChildren();
    const holeElements = hole.getChildren();

    this.add([...groundElements, ...leftSlopeElements, ...rightSlopeElements, ...holeElements]);
    this.y = 10000;
    this.scene.add.existing(this);
  }

  public async animate() {
    await this.show();
    await this.jump();
  }

  public async show(): Promise<void> {
    await this.tweenAnimationService.moveY(
      this.scene,
      this,
      GAME_SCENE_ANIMATION.moveYAnimation.y,
      GAME_SCENE_ANIMATION.moveYAnimation.ease,
      GAME_SCENE_ANIMATION.moveYAnimation.duration,
    );
  }

  public async jump(): Promise<void> {
    await this.tweenAnimationService.moveYFrom(
      this.scene,
      this,
      GAME_SCENE_ANIMATION.moveFromYAnimation.from,
      GAME_SCENE_ANIMATION.moveFromYAnimation.to,
      GAME_SCENE_ANIMATION.moveFromYAnimation.ease,
      GAME_SCENE_ANIMATION.moveFromYAnimation.duration,
      GAME_SCENE_ANIMATION.moveFromYAnimation.yoyo,
    );
  }
}
