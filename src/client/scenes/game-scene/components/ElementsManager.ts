import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import SoundService from 'client/services/SoundService';
import { Scene } from 'phaser';
import { ElementTypeKeys, SoundsKeys } from 'common/types/enums';
import { EventNames } from 'common/types/events';
import MapService from 'client/services/MapService';
import Ball from 'client/components/Ball';
import Trajectory from 'client/components/Trajectory';
import {
  Level, LevelElements, IComponent, IComponentManager, ElementsConfig,
} from 'common/types/types';
import StarsGroup from './StarsGroup';
import Map from './Map';
import Flag from './Flag';
import Cup from './golf-course/Cup';
import SawGroup from './SawGroup';
import HoleBar from './golf-course/HoleBar';
import DestroyedBall from './DestroyedBall';

export default class ElementsManager
  extends Phaser.GameObjects.Container implements IComponentManager {
  components: IComponent[] = [];

  mapService: MapService;

  levelConfig: Level;

  mapElements!: LevelElements[];

  map!: Map;

  stars!: StarsGroup;

  ball!: Ball;

  trajectory!: Trajectory;

  flag!: Flag;

  cup!: Cup;

  saws!: SawGroup;

  matterCollision!: PhaserMatterCollisionPlugin;

  constructor(
    scene: Scene,
    level: Level,
    tileSize: number,
    matterCollision?: PhaserMatterCollisionPlugin,
  ) {
    super(scene);
    this.matterCollision = matterCollision as PhaserMatterCollisionPlugin;
    this.mapService = new MapService(tileSize);
    this.mapElements = this.mapService.createLevelConfig(level.map);
    this.levelConfig = level;
  }

  async create(): Promise<void> {
    const config = this.createConfig();
    await this.createElements(config);
    this.addComponents(this.trajectory, this.ball);
    this.initCollisions();
  }

  private createConfig(): ElementsConfig {
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
    return {
      starsConfig, ballConfig, flagConfig, cupConfig, sawConfig,
    };
  }

  private async createElements(config: ElementsConfig): Promise<void> {
    const {
      starsConfig, ballConfig, flagConfig, cupConfig, sawConfig,
    } = config;
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
    this.saws = new SawGroup(this.scene, sawConfig, this.levelConfig);
    const bar = new HoleBar(this.scene, flagConfig);
    bar.setDepth(300);
  }

  update() {
    this.ball.checkBallPosition(this.scene.data.values.isGameOver);
    this.saws.update();
    this.components.forEach((el) => el.update());
  }

  public addComponents(...args: IComponent[]): void {
    args.forEach((el) => this.components.push(el));
  }

  private initCollisions() {
    if (this.matterCollision) {
      this.collectStar(this.ball, this.stars.getChildren());
      this.collideWithSaw(this.ball, this.saws.getChildren());
      this.detectWin(this.ball, this.cup);
    }
  }

  private collectStar(
    objectA: Phaser.GameObjects.GameObject,
    objectB: Phaser.GameObjects.GameObject[],
  ) {
    this.matterCollision.addOnCollideStart({
      objectA,
      objectB,
      callback: ({ gameObjectB }) => {
        gameObjectB?.destroy();
        this.scene.data.values.stars += 1;
        SoundService.playSound(this.scene, SoundsKeys.Star);
      },
    });
  }

  private collideWithSaw(
    objectA: Phaser.GameObjects.GameObject,
    objectB: Phaser.GameObjects.GameObject[],
  ) {
    this.matterCollision.addOnCollideStart({
      objectA,
      objectB,
      callback: () => {
        this.scene.events.emit(EventNames.GameOver);
        const ball = new DestroyedBall();
        ball.create(this.scene, this.ball.x, this.ball.y);
        this.ball.destroy();
      },
    });
  }

  private detectWin(
    objectA: Phaser.GameObjects.GameObject,
    objectB: Phaser.GameObjects.GameObject,
  ) {
    this.matterCollision.addOnCollideStart({
      objectA,
      objectB,
      callback: () => {
        this.scene.events.emit(EventNames.Win);
      },
    });
  }

  public destroyElements(): void {
    this.stars.clear();
    this.map.destroy();
    this.cup.destroy();
    this.ball.destroy();
  }
}
