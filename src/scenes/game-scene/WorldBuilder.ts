import { Scene } from 'phaser';
import TunnelGroup from './components/golf-course/HoleGroup';
import MapCreatorService from '../../services/MapCreatorService';
import TilesGroup from './components/golf-course/PlatformGroup';
import SlopeGroup from './components/golf-course/SlopeLeftGroup';
import SlopeRightGroup from './components/golf-course/SlopeRightGroup';

export default class WorldBuilder {
  scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  build(level: number, tileSize: number) {
    const map = new MapCreatorService(level, tileSize);

    const ground = new TilesGroup(this.scene);
    const leftSlope = new SlopeGroup(this.scene);
    const rightSlope = new SlopeRightGroup(this.scene);
    const hole = new TunnelGroup(this.scene);

    ground.build(map.mapElements.filter((el) => el.type === 'tile'));
    leftSlope.build(map.mapElements.filter((el) => el.type === 'slope-left'));
    rightSlope.build(map.mapElements.filter((el) => el.type === 'slope-right'));
    hole.build(map.mapElements.filter((el) => el.type === 'hole'));
  }
}
