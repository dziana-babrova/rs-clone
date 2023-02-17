import { Scene } from 'phaser';
import { ElementTypeKeys } from 'types/enums';
import MapService from 'services/MapService';
import Ball from 'components/Ball';
import Trajectory from 'components/Trajectory';
import { Levels } from 'const/levels/Levels';
import { LevelElements } from 'types/types';
import StarsGroup from './StarsGroup';
import Map from './Map';
import Flag from './Flag';
import Cup from './golf-course/Cup';

export default class ElementsManager extends Phaser.GameObjects.Container {
  mapService: MapService;

  mapElements!: LevelElements[];

  map!: Map;

  stars!: StarsGroup;

  ball!: Ball;

  trajectory!: Trajectory;

  flag!: Flag;

  cup!: Cup;

  constructor(scene: Scene, level: number, tileSize: number) {
    super(scene);
    this.mapService = new MapService(tileSize);
    this.mapElements = this.mapService.createLevelConfig(Levels[level]);
  }

  async create() {
    const starsConfig = this.mapService.getFilteredElements(
      this.mapElements,
      ElementTypeKeys.Star,
      ElementTypeKeys.HoleWithCoin,
    );
    const ballConfig = this.mapService.getFilteredElements(this.mapElements, ElementTypeKeys.Ball);
    const flagConfig = this.mapService.getFilteredElements(
      this.mapElements,
      ElementTypeKeys.Flag,
    )[0];
    const cupConfig = this.mapService.getFilteredElements(this.mapElements, ElementTypeKeys.Cup)[0];

    this.map = this.mapService.createMap(this.scene, this.mapElements);
    await this.map.animate();
    this.stars = new StarsGroup(this.scene, starsConfig);
    await this.stars.scale();
    this.ball = new Ball(this.scene, {
      x: ballConfig[0].x,
      y: ballConfig[0].y - 200,
    });
    this.trajectory = new Trajectory(this.scene);
    this.flag = new Flag(this.scene, flagConfig.x, flagConfig.y);
    await this.flag.animate();
    this.cup = new Cup(this.scene, cupConfig);
  }
}
