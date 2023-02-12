import { Scene } from 'phaser';
import ElementTypeKeys from 'const/ElementTypeKeys';
import MapService from 'services/MapService';
import Ball from 'components/Ball';
import Trajectory from 'components/Trajectory';
import StarsGroup from './StarsGroup';
import Map from './Map';
import Flag from './Flag';

export default class ElementsManager extends Phaser.GameObjects.Container {
  mapService: MapService;

  map!: Map;

  stars!: StarsGroup;

  ball!: Ball;

  trajectory!: Trajectory;

  flag!: Flag;

  constructor(scene: Scene, level: number, tileSize: number) {
    super(scene);

    this.mapService = new MapService(level, tileSize);
  }

  async create() {
    const groundConfig = this.mapService.getFilteredElements(
      ElementTypeKeys.Tile,
    );
    const leftSlopeConfig = this.mapService.getFilteredElements(
      ElementTypeKeys.LeftSlope,
    );
    const rightSlopeConfig = this.mapService.getFilteredElements(ElementTypeKeys.RightSlope);
    const holeConfig = this.mapService.getFilteredElements(
      ElementTypeKeys.Hole,
      ElementTypeKeys.HoleWithCoin,
      ElementTypeKeys.Flag,
    );
    const starsConfig = this.mapService.getFilteredElements(
      ElementTypeKeys.Star,
      ElementTypeKeys.HoleWithCoin,
    );
    const ballConfig = this.mapService.getFilteredElements(
      ElementTypeKeys.Ball,
    );
    const flagConfig = this.mapService.getFilteredElements(ElementTypeKeys.Flag)[0];

    this.map = new Map(this.scene, groundConfig, leftSlopeConfig, rightSlopeConfig, holeConfig);
    await this.map.animate();
    this.stars = new StarsGroup(this.scene, starsConfig);
    await this.stars.scale();
    this.ball = new Ball(this.scene, ballConfig);
    this.trajectory = new Trajectory(this.scene);
    this.flag = new Flag(this.scene, flagConfig.x, flagConfig.y);
    await this.flag.animate();
  }
}
