import { Scene } from 'phaser';
import TweenAnimationBuilder from 'utils/TweenAnimationBuilder';
import GAME_SCENE_ANIMATION from 'const/GameSceneAnimationConsts';
import { LevelElements, Position } from 'types/types';
import TunnelGroup from './golf-course/HoleGroup';
import TilesGroup from './golf-course/PlatformGroup';
import SlopeLeftGroup from './golf-course/SlopeLeftGroup';
import SlopeRightGroup from './golf-course/SlopeRightGroup';

export default class Map extends Phaser.GameObjects.Container {
  tweenAnimationBuilder: TweenAnimationBuilder;

  constructor(
    scene: Scene,
    groundConfig: LevelElements[],
    leftSlopeConfig: LevelElements[],
    rightSlopeConfig: LevelElements[],
    holeConfig: LevelElements[],
  ) {
    super(scene);
    this.tweenAnimationBuilder = new TweenAnimationBuilder();
    this.build(groundConfig, leftSlopeConfig, rightSlopeConfig, holeConfig);
  }

  private build(
    groundConfig: LevelElements[],
    leftSlopeConfig: LevelElements[],
    rightSlopeConfig: LevelElements[],
    holeConfig: LevelElements[],
  ): void {
    const ground = new TilesGroup(this.scene, groundConfig);
    const leftSlope = new SlopeLeftGroup(this.scene, leftSlopeConfig);
    const rightSlope = new SlopeRightGroup(this.scene, rightSlopeConfig);
    const hole = new TunnelGroup(this.scene, holeConfig);

    const groundElements = ground.getChildren();
    const leftSlopeElements = leftSlope.getChildren();
    const rightSlopeElements = rightSlope.getChildren();
    const holeElements = hole.getChildren();

    this.scene.matter.add.gameObject(this, {
      isStatic: true,
    });
    this.add([...groundElements, ...leftSlopeElements, ...rightSlopeElements, ...holeElements]);
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
