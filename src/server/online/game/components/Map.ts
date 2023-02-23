import { GameObjects, Scene } from 'phaser';
import { LevelElements } from '../../../../common/types/types';
import TunnelGroup from './golf-course/HoleGroup';
import TilesGroup from './golf-course/PlatformGroup';
import SlopeLeftGroup from './golf-course/SlopeLeftGroup';
import SlopeRightGroup from './golf-course/SlopeRightGroup';

export default class Map extends GameObjects.Container {
  constructor(
    scene: Scene,
    groundConfig: LevelElements[],
    leftSlopeConfig: LevelElements[],
    rightSlopeConfig: LevelElements[],
    holeConfig: LevelElements[],
  ) {
    super(scene);
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
    this.add([
      ...groundElements,
      ...leftSlopeElements,
      ...rightSlopeElements,
      ...holeElements,
    ]);
    this.y = 0;
    this.scene.add.existing(this);
  }
}
