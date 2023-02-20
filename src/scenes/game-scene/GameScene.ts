import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import { SceneKeys } from 'types/enums';
import store from 'state/store';
import Phaser from 'phaser';
import EventNames from 'types/events';
import SingleplayerManager from 'managers/SingleplayerManager';
import { IComponent, IComponentManager } from 'types/types';
import SoundService from 'services/SoundService';
import NextLevelButton from './components/next-level-popup/NextLevelButton';
import ElementsManager from './components/ElementsManager';
import Fireworks from './components/Fireworks';
import DestroyedBall from './components/DestroyedBall';
import Background from '../../components/background/Background';

export default class GameScene extends Phaser.Scene implements IComponentManager {
  components: IComponent[] = [];

  public manager!: SingleplayerManager;

  elementsManager!: ElementsManager;

  background!: Background;

  level!: number;

  starsCount: number;

  isGameOver: boolean;

  nextLevelButton!: NextLevelButton;

  matterCollision!: PhaserMatterCollisionPlugin;

  constructor() {
    super(SceneKeys.Game);
    this.isGameOver = false;
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
    this.manager = new SingleplayerManager(
      this,
      this.elementsManager.ball,
      this.elementsManager.trajectory,
    );

    this.initEvents();
  }

  private async initEvents() {
    this.collectStar(this.elementsManager.ball, this.elementsManager.stars.getChildren());
    this.detectWin(this.elementsManager.ball, this.elementsManager.cup);
    this.collideWithSaw(this.elementsManager.ball, this.elementsManager.saws.getChildren());
    this.events.on(EventNames.Win, this.elementsManager.ball.deactivate, this.elementsManager.ball);
    this.events.on(EventNames.Win, () => {
      const fireworks = new Fireworks();
      fireworks.create(this, this.elementsManager.cup.x, this.elementsManager.cup.y);
    });
    this.events.on(EventNames.Win, this.displayWinPopup.bind(this));
    this.events.on(EventNames.GameOver, this.handleGameOver.bind(this));
  }

  private displayWinPopup() {
    this.time.delayedCall(2000, async () => {
      const popup = new NextLevelButton(this);
      await popup.create(this.starsCount, this.switchLevel);
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

  private collideWithSaw(
    objectA: Phaser.GameObjects.GameObject,
    objectB: Phaser.GameObjects.GameObject[],
  ) {
    this.matterCollision.addOnCollideStart({
      objectA,
      objectB,
      callback: () => {
        this.events.emit(EventNames.GameOver);
        const ball = new DestroyedBall();
        ball.create(this, this.elementsManager.ball.x, this.elementsManager.ball.y);
        this.elementsManager.ball.destroy();
      },
    });
  }

  private handleGameOver(): void {
    this.isGameOver = true;
    this.cameras.main.shake(1000, 0.015);
    SoundService.gameOverSound(this);
    this.time.addEvent({
      delay: 2000,
      callback: () => {
        this.switchLevel(false);
      },
    });
  }

  update() {
    try {
      this.background.update();
      this.components.forEach((el) => el.update());
      this.manager.update();
      this.elementsManager.ball.checkBallPosition(this.isGameOver);
      this.elementsManager.saws.update();
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
    this.isGameOver = false;
    this.destroySprites();
    this.time.addEvent({
      delay: 2000,
      callback: () => {
        this.events.removeAllListeners(EventNames.Win);
        this.events.removeAllListeners('pointerup');
        this.events.removeAllListeners('pointerdown');
        this.events.removeListener(EventNames.BallStop);
        this.scene.restart({ level: (this.level += Number(nextLevel)) });
      },
    });
  }

  private destroySprites(): void {
    const allSprites = this.children.list.filter((x) => x instanceof Phaser.GameObjects.Sprite);
    allSprites.forEach((x) => x.destroy());
  }
}
