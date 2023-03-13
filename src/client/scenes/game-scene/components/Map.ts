import { Scene } from 'phaser';
import TweenAnimationBuilder from 'client/utils/TweenAnimationBuilder';
import { GAME_SCENE_ANIMATION } from 'client/const/scenes/GameSceneConsts';
import { LevelElements } from 'common/types/types';
import TunnelGroup from './golf-course/HoleGroup';
import TilesGroup from './golf-course/PlatformGroup';
import SlopeLeftGroup from './golf-course/SlopeLeftGroup';
import SlopeRightGroup from './golf-course/SlopeRightGroup';
import WaterGroup from './golf-course/WaterGroup';

export default class Map extends Phaser.GameObjects.Container {
  tweenAnimationBuilder: TweenAnimationBuilder;

  constructor(
    scene: Scene,
    groundConfig: LevelElements[],
    leftSlopeConfig: LevelElements[],
    rightSlopeConfig: LevelElements[],
    holeConfig: LevelElements[],
    waterConfig?: LevelElements[],
  ) {
    super(scene);
    this.tweenAnimationBuilder = new TweenAnimationBuilder();
    this.build(groundConfig, leftSlopeConfig, rightSlopeConfig, holeConfig, waterConfig);
  }

  private build(
    groundConfig: LevelElements[],
    leftSlopeConfig: LevelElements[],
    rightSlopeConfig: LevelElements[],
    holeConfig: LevelElements[],
    waterConfig?: LevelElements[],
  ): void {
    const ground = new TilesGroup(this.scene, groundConfig);
    const leftSlope = new SlopeLeftGroup(this.scene, leftSlopeConfig);
    const rightSlope = new SlopeRightGroup(this.scene, rightSlopeConfig);
    const hole = new TunnelGroup(this.scene, holeConfig);
    const water = new WaterGroup(this.scene, waterConfig || []);
    water.setDepth(200);

    const groundElements = ground.getChildren();
    const leftSlopeElements = leftSlope.getChildren();
    const rightSlopeElements = rightSlope.getChildren();
    const holeElements = hole.getChildren();
    const waterElements = water.getChildren();

    this.scene.matter.add.gameObject(this, {
      isStatic: true,
    });
    this.add([
      ...waterElements,
      ...groundElements,
      ...leftSlopeElements,
      ...rightSlopeElements,
      ...holeElements,
    ]);
    this.y = 3000;
    this.scene.add.existing(this);
  }

  public async animate() {
    await this.show();
    await this.jump();
  }

  public async show(): Promise<void> {
    await this.tweenAnimationBuilder.moveY(
      this.scene,
      this,
      GAME_SCENE_ANIMATION.moveYAnimation.y,
      GAME_SCENE_ANIMATION.moveYAnimation.ease,
      GAME_SCENE_ANIMATION.moveYAnimation.duration,
    );
  }

  public async jump(): Promise<void> {
    await this.tweenAnimationBuilder.moveYFrom(
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
