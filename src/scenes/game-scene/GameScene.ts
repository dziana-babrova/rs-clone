import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import SceneKeys from 'const/SceneKeys';
import Phaser from 'phaser';
import HitHandler from 'handlers/HitHandler';
import { IComponent, IComponentManager } from 'types/types';
import NextLevelButton from './components/NextLevelButton';
import ElementsManager from './components/ElementsManager';

export default class GameScene extends Phaser.Scene implements IComponentManager {
  components: IComponent[] = [];

  public hitHandler!: HitHandler;

  elementsManager!: ElementsManager;

  level!: number;

  starsCount: number;

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
    this.elementsManager = new ElementsManager(this, this.level, 41);
    await this.elementsManager.create();

    this.addComponents(this.elementsManager.trajectory, this.elementsManager.ball);
    this.hitHandler = new HitHandler(
      this,
      this.elementsManager.ball,
      this.elementsManager.trajectory,
    );

    this.nextLevelButton = new NextLevelButton(this);
    this.nextLevelButton.on('pointerup', this.switchLevel.bind(this));
    this.matter.world.setBounds();
    await this.collectStar(this.elementsManager.ball, this.elementsManager.stars.getChildren());
  }

  private collectStar(
    objectA: Phaser.GameObjects.GameObject,
    objectB: Phaser.GameObjects.GameObject[],
  ): Promise<void> {
    return new Promise<void>((resolve) => {
      this.matterCollision.addOnCollideStart({
        objectA,
        objectB,
        callback: ({ gameObjectB }) => {
          gameObjectB?.destroy();
          this.starsCount += 1;
        },
      });
      resolve();
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
