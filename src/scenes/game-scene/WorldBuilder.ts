import { Scene } from 'phaser';
import TunnelGroup from './components/golf-course/HoleGroup';
import MapCreatorService from '../../services/MapCreatorService';
import TilesGroup from './components/golf-course/PlatformGroup';
import SlopeGroup from './components/golf-course/SlopeLeftGroup';
import SlopeRightGroup from './components/golf-course/SlopeRightGroup';

export default class World {
  scene: Scene;

  map!: MapCreatorService;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  build(level: number, tileSize: number) {
    this.map = new MapCreatorService(level, tileSize);

    const ground = new TilesGroup(this.scene);
    const leftSlope = new SlopeGroup(this.scene);
    const rightSlope = new SlopeRightGroup(this.scene);
    const hole = new TunnelGroup(this.scene);

    ground.build(this.map.mapElements.filter((el) => el.type === 'tile'));
    leftSlope.build(this.map.mapElements.filter((el) => el.type === 'slope-left'));
    rightSlope.build(this.map.mapElements.filter((el) => el.type === 'slope-right'));
    hole.build(
      this.map.mapElements.filter((el) => el.type === 'hole' || el.type === 'coin-in-hole'),
    );
  }
}
