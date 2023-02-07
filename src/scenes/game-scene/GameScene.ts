import Ball from 'components/Ball';
import SceneKeys from 'const/SceneKeys';
import Phaser from 'phaser';
import Trajectory from 'components/Trajectory';
import HitHandler from 'handlers/HitHandler';
import { IComponent, IComponentManager } from 'types/types';
import Map from './components/Map';
import TilesGroup from './components/PlatfromGroup';

export default class GameScene extends Phaser.Scene implements IComponentManager {
  components: IComponent[] = [];

  public hitHandler!: HitHandler;

  level!: number;

  map!: Map;

  constructor() {
    super(SceneKeys.Game);
  }

  init(props: { level?: number }) {
    const { level = 0 } = props;
    this.level = level;
  }

  create() {
    const map = new Map(this.level, 41);
    const ground = new TilesGroup(
      this,
      map.info.filter((el) => el.type === 'tile'),
    );

    this.matter.world.setBounds();
    const trajectory = new Trajectory(this);
    const ball = new Ball(this, { x: 100, y: 0 });
    this.addComponents(trajectory, ball);
    this.hitHandler = new HitHandler(this, ball, trajectory);
  }

  update() {
    this.components.forEach((el) => el.update());
    this.hitHandler.update();
  }

  addComponents(...args: IComponent[]) {
    args.forEach((el) => this.components.push(el));
  }
}
