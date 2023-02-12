import { Scene } from 'phaser';
import ElementTypeKeys from 'const/ElementTypeKeys';
import MapService from 'services/MapService';
import Ball from 'components/Ball';
import Trajectory from 'components/Trajectory';
import StarsGroup from './StarsGroup';
import Map from './Map';

export default class ElementsManager extends Phaser.GameObjects.Container {
  mapService: MapService;

  map!: Map;

  stars!: StarsGroup;

  ball!: Ball;

  trajectory!: Trajectory;

  constructor(scene: Scene, level: number, tileSize: number) {
    super(scene);

    this.mapService = new MapService(level, tileSize);
  }

  async create() {
    const groundConfig = this.mapService.mapElements.filter(
      (el) => el.type === ElementTypeKeys.Tile,
    );
    const leftSlopeConfig = this.mapService.mapElements.filter(
      (el) => el.type === ElementTypeKeys.LeftSlope,
    );
    const rightSlopeConfig = this.mapService.mapElements.filter(
      (el) => el.type === ElementTypeKeys.RightSlope,
    );
    const holeConfig = this.mapService.mapElements.filter(
      (el) => el.type === ElementTypeKeys.Hole || el.type === ElementTypeKeys.HoleWithCoin,
    );

    const starsConfig = this.mapService.mapElements.filter(
      (el) => el.type === ElementTypeKeys.Star || el.type === ElementTypeKeys.HoleWithCoin,
    );
    const ballConfig = this.mapService.mapElements.filter(
      (el) => el.type === ElementTypeKeys.Ball,
    );

    this.map = new Map(this.scene, groundConfig, leftSlopeConfig, rightSlopeConfig, holeConfig);
    await this.map.animate();
    this.stars = new StarsGroup(this.scene, starsConfig);
    await this.stars.scale();
    this.ball = new Ball(this.scene, ballConfig);
    this.trajectory = new Trajectory(this.scene);
  }
}
