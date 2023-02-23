import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import { SceneKeys, SoundsKeys } from 'types/enums';
import store from 'state/store';
import Phaser from 'phaser';
import EventNames from 'types/events';
import SingleplayerManager from 'managers/SingleplayerManager';
import { IComponent, IComponentManager, Maps } from 'types/types';
import SoundService from 'services/SoundService';
import MapService from 'services/MapService';
import { axiosUpdateMaps, setMaps } from 'state/features/AppSlice';
import LocalStorageService from 'services/LocalStorageService';
import { LocalStorageKeys } from 'const/AppConstants';
import { Levels } from 'const/levels/Levels';
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
    let { level = -1 } = props;
    if (level === -1) {
      const unlockedMaps = store.getState().app.maps.filter((map) => map.isUnlock);
      level = unlockedMaps[unlockedMaps.length - 1]?.id || 0;
    }
    this.level = level;
    this.background = new Background(this, store.getState().app.background);
  }

  async create() {
    this.cameras.main.fadeIn();
    this.elementsManager = new ElementsManager(this, Levels[this.level], 41);
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
    this.events.on(EventNames.Win, this.updateMaps.bind(this));
    this.events.on(EventNames.Win, this.displayWinPopup.bind(this));
    this.events.on(EventNames.GameOver, this.handleGameOver.bind(this));
  }

  private async updateMaps() {
    const { maps } = store.getState().app;
    const index = maps.findIndex((map) => map.id === this.level);
    if (index !== -1) {
      const newMaps = MapService.updateMapsObject(maps, index, this.starsCount);
      if (store.getState().user.isAuth) {
        await store.dispatch(axiosUpdateMaps(newMaps));
      } else {
        store.dispatch(setMaps(newMaps));
      }
      LocalStorageService.setItem<Maps>(LocalStorageKeys.maps, newMaps);
    }
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
    console.log(objectA, objectB);
    this.matterCollision.addOnCollideStart({
      objectA,
      objectB,
      callback: ({ gameObjectB }) => {
        gameObjectB?.destroy();
        this.starsCount += 1;
        SoundService.playSound(this, SoundsKeys.Star);
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
    SoundService.playSound(this, SoundsKeys.GameOver);
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
