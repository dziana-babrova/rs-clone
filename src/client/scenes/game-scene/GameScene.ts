import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import { SceneKeys, SoundsKeys } from 'common/types/enums';
import store from 'client/state/store';
import Phaser from 'phaser';
import { EventNames } from 'common/types/events';
import SingleplayerManager from 'client/managers/SingleplayerManager';
import { Maps } from 'common/types/types';
import SoundService from 'client/services/SoundService';
import MapService from 'client/services/MapService';
import { axiosUpdateMaps, setMaps } from 'client/state/features/AppSlice';
import LocalStorageService from 'client/services/LocalStorageService';
import { LocalStorageKeys } from 'client/const/AppConstants';
import { Levels } from 'client/const/levels/Levels';
import NextLevelButton from './components/next-level-popup/NextLevelButton';
import ElementsManager from './components/ElementsManager';
import Fireworks from './components/Fireworks';
import Background from '../../components/background/Background';

export default class GameScene extends Phaser.Scene {
  public manager!: SingleplayerManager;

  elementsManager!: ElementsManager;

  background!: Background;

  level!: number;

  nextLevelButton!: NextLevelButton;

  matterCollision!: PhaserMatterCollisionPlugin;

  constructor() {
    super(SceneKeys.Game);
  }

  init(props: { level?: number }) {
    this.data.values.stars = 0;
    this.data.values.isGameOver = false;
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
    this.elementsManager = new ElementsManager(this, Levels[this.level], 41, this.matterCollision);
    await this.elementsManager.create();

    this.manager = new SingleplayerManager(
      this,
      this.elementsManager.ball,
      this.elementsManager.trajectory,
    );

    this.initEvents();
  }

  private async initEvents() {
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
      const newMaps = MapService.updateMapsObject(maps, index, this.data.values.stars);
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
      await popup.create(this.data.values.stars, this.switchLevel);
    });
  }

  private handleGameOver(): void {
    this.data.values.isGameOver = true;
    this.cameras.main.shake(1000, 0.015);
    SoundService.playSound(this, SoundsKeys.GameOver);
    this.time.addEvent({
      delay: 2000,
      callback: () => {
        this.switchLevel(SceneKeys.Game, false);
      },
    });
  }

  update() {
    try {
      this.background.update();
      this.elementsManager.update();
      this.manager.update();
    } catch (e) {
      console.log();
    }
  }

  switchLevel(key: string, nextLevel?: boolean) {
    this.cameras.main.fadeOut();
    this.data.values.stars = 0;
    this.data.values.isGameOver = false;
    this.destroySprites();
    this.time.addEvent({
      delay: 2000,
      callback: () => {
        this.scene.stop();
        this.removeListeners();
        this.scene.start(key, { level: (this.level += Number(nextLevel)) });
      },
    });
  }

  private removeListeners(): void {
    this.events.removeAllListeners(EventNames.Win);
    this.events.removeAllListeners('pointerup');
    this.events.removeAllListeners('pointerdown');
    this.events.removeListener(EventNames.BallStop);
  }

  private destroySprites(): void {
    const allSprites = this.children.list.filter((x) => x instanceof Phaser.GameObjects.Sprite);
    allSprites.forEach((x) => x.destroy());
  }
}
