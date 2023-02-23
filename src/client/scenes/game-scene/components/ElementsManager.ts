import { Scene } from 'phaser';
import { ElementTypeKeys } from 'common/types/enums';
import MapService from 'client/services/MapService';
import Ball from 'client/components/Ball';
import Trajectory from 'client/components/Trajectory';
import { Levels } from 'client/const/levels/Levels';
import { LevelElements } from 'common/types/types';
import StarsGroup from './StarsGroup';
import Map from './Map';
import Flag from './Flag';
import Cup from './golf-course/Cup';
import SawGroup from './SawGroup';
import HoleBar from './golf-course/HoleBar';

export default class ElementsManager extends Phaser.GameObjects.Container {
  mapService: MapService;

  mapElements!: LevelElements[];

  level: number;

  map!: Map;

  stars!: StarsGroup;

  ball!: Ball;

  trajectory!: Trajectory;

  flag!: Flag;

  cup!: Cup;

  saws!: SawGroup;

  constructor(scene: Scene, level: number, tileSize: number) {
    super(scene);
    this.mapService = new MapService(tileSize);
    this.mapElements = this.mapService.createLevelConfig(Levels[level].map);
    this.level = level;
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
    const sawConfig = this.mapService.getFilteredElements(this.mapElements, ElementTypeKeys.Saw);

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
    this.saws = new SawGroup(this.scene, sawConfig, Levels[this.level]);
    const bar = new HoleBar(this.scene, flagConfig);
    bar.setDepth(300);
  }
}
