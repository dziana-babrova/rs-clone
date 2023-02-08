import Ball from 'components/Ball';
import Trajectory from 'components/Trajectory';
import SceneKeys from 'const/SceneKeys';
import HitHandler from 'handlers/HitHandler';
import { IComponent, IComponentManager } from 'types/types';

export default class GameScene extends Phaser.Scene implements IComponentManager {
  components: IComponent[] = [];

  public hitHandler!: HitHandler;

  constructor() {
    super(SceneKeys.Game);
  }

  create() {
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
