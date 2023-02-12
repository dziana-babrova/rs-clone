import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import Ball from 'components/Ball';
import SceneKeys from 'const/SceneKeys';
import Phaser from 'phaser';
import Trajectory from 'components/Trajectory';
import HitHandler from 'handlers/HitHandler';
import { IComponent, IComponentManager } from 'types/types';
import Map from './components/Map';
import NextLevelButton from './components/NextLevelButton';
import StarsGroup from './components/StarsGroup';

export default class GameScene extends Phaser.Scene implements IComponentManager {
  components: IComponent[] = [];

  public hitHandler!: HitHandler;

  level!: number;

  starsCount: number;

  map!: Map;

  nextLevelButton!: NextLevelButton;

  matterCollision!: PhaserMatterCollisionPlugin;

  constructor() {
    super(SceneKeys.Game);
    this.starsCount = 0;
  }

  init(props: { level?: number }) {
    const { level = 0 } = props;
    this.level = level;
  }

  async create() {
    this.cameras.main.fadeIn();
    this.map = new Map(this, this.level, 41);
    const stars = new StarsGroup(this, this.level, 41);
    await this.map.animate();
    await stars.scale();
    const ball = new Ball(this, { x: 100, y: 0 }, this.level, 41);

    const trajectory = new Trajectory(this);
    this.addComponents(trajectory, ball);
    this.hitHandler = new HitHandler(this, ball, trajectory);

    this.nextLevelButton = new NextLevelButton(this);
    this.nextLevelButton.on('pointerup', this.switchLevel.bind(this));
    this.matter.world.setBounds();
    this.collectStar(ball, stars.getChildren());
  }

  private collectStar(
    objectA: Phaser.GameObjects.GameObject,
    objectB: Phaser.GameObjects.GameObject[],
  ): void {
    this.matterCollision.addOnCollideStart({
      objectA,
      objectB,
      callback: ({ gameObjectB }) => {
        gameObjectB?.destroy();
        this.starsCount += 1;
      },
    });
  }

  update() {
    try {
      this.components.forEach((el) => el.update());
      this.hitHandler.update();
    } catch (e) {
      console.log();
    }
  }

  addComponents(...args: IComponent[]) {
    args.forEach((el) => this.components.push(el));
  }

  switchLevel() {
    this.cameras.main.fadeOut();
    this.destroySprites();
    this.starsCount = 0;
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
