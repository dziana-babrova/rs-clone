import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import { SceneKeys } from 'types/enums';
import store from 'state/store';
import Phaser from 'phaser';
import EventNames from 'types/events';
import HitManager from 'managers/HitManager';
import { IComponent, IComponentManager } from 'types/types';
import SoundService from 'services/SoundService';
import NextLevelButton from './components/next-level-popup/NextLevelButton';
import ElementsManager from './components/ElementsManager';
import Fireworks from './components/Fireworks';
import Background from '../../components/background/Background';

export default class GameScene extends Phaser.Scene implements IComponentManager {
  components: IComponent[] = [];

  public hitHandler!: HitManager;

  elementsManager!: ElementsManager;

  background!: Background;

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
    this.background = new Background(this, store.getState().app.background);
  }

  async create() {
    this.cameras.main.fadeIn();
    this.elementsManager = new ElementsManager(this, this.level, 41);
    await this.elementsManager.create();

    this.addComponents(this.elementsManager.trajectory, this.elementsManager.ball);
    this.hitHandler = new HitManager(
      this,
      this.elementsManager.ball,
      this.elementsManager.trajectory,
    );
    this.initEvents();
  }

  private async initEvents() {
    this.collectStar(this.elementsManager.ball, this.elementsManager.stars.getChildren());
    this.detectWin(this.elementsManager.ball, this.elementsManager.cup);
    this.events.on(EventNames.Win, this.elementsManager.ball.deactivate, this.elementsManager.ball);
    this.events.on(EventNames.Win, () => {
      const fireworks = new Fireworks();
      fireworks.create(this, this.elementsManager.cup.x, this.elementsManager.cup.y);
    });
    this.events.on(EventNames.Win, this.displayWinPopup.bind(this));
  }

  private displayWinPopup() {
    this.time.delayedCall(2000, async () => {
      const popup = new NextLevelButton(this);
      await popup.create(this.starsCount, this.switchLevel);
      popup.on('pointerup', this.switchLevel.bind(this));
    });
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
        this.starsCount += 1;
        SoundService.starSound(this);
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
        this.events.emit(EventNames.Win);
      },
    });
  }

  update() {
    try {
      this.background.update();
      this.components.forEach((el) => el.update());
      this.hitHandler.update();
    } catch (e) {
      console.log();
    }
  }

  addComponents(...args: IComponent[]) {
    args.forEach((el) => this.components.push(el));
  }

  switchLevel(nextLevel: boolean) {
    this.cameras.main.fadeOut();
    this.starsCount = 0;
    this.destroySprites();
    this.time.addEvent({
      delay: 2000,
      callback: () => {
        this.scene.restart({ level: (this.level += Number(nextLevel)) });
      },
    });
  }

  private destroySprites(): void {
    const allSprites = this.children.list.filter((x) => x instanceof Phaser.GameObjects.Sprite);
    allSprites.forEach((x) => x.destroy());
  }
}
