import Ball from 'components/Ball';
import SceneKeys from 'const/SceneKeys';
import Phaser from 'phaser';
import Trajectory from 'components/Trajectory';
import HitHandler from 'handlers/HitHandler';
import { IComponent, IComponentManager } from 'types/types';
import World from './WorldBuilder';
import NextLevelButton from './components/NextLevelButton';

export default class GameScene extends Phaser.Scene implements IComponentManager {
  components: IComponent[] = [];

  public hitHandler!: HitHandler;

  level!: number;

  World: World;

  nextLevelButton!: NextLevelButton;

  constructor() {
    super(SceneKeys.Game);
    this.World = new World(this);
  }

  init(props: { level?: number }) {
    const { level = 29 } = props;
    this.level = level;
  }

  create() {
    this.cameras.main.fadeIn();
    this.World.build(this.level, 41);
    this.nextLevelButton = new NextLevelButton(this);
    this.nextLevelButton.on('pointerup', this.switchLevel.bind(this));

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

  switchLevel() {
    this.cameras.main.fadeOut();
    this.destroySprites();
    this.time.addEvent({
      delay: 2000,
      callback: () => {
        this.scene.restart({ level: (this.level += 1) });
      },
    });
  }

  private destroySprites(): void {
    const allSprites = this.children.list.filter((x) => x instanceof Phaser.GameObjects.Sprite);
    allSprites.forEach((x) => x.destroy());
  }
}
