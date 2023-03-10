import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import { SceneKeys, SoundsKeys } from 'common/types/enums';
import store from 'client/state/store';
import Phaser from 'phaser';
import { EventNames, HotkeysEvents } from 'common/types/events';
import SingleplayerManager from 'client/managers/SingleplayerManager';
import { Maps } from 'common/types/types';
import SoundService from 'client/services/SoundService';
import MapService from 'client/services/MapService';
import { axiosUpdateMaps, setMaps } from 'client/state/features/AppSlice';
import LocalStorageService from 'client/services/LocalStorageService';
import { LocalStorageKeys } from 'client/const/AppConstants';
import WinPopup from 'client/components/popups/WinPopup';
import { Levels } from 'client/const/levels/Levels';
import LANGUAGE from 'client/const/Language';
import { GAME_SCENE } from 'client/const/scenes/GameSceneConsts';
import TopPanel from 'client/components/top-panel/TopPanel';
import CalculateService from 'client/services/CalculateService';
import HotkeysService from 'client/services/HotkeysService';
import NextLevelButton from './components/next-level-popup/NextLevelButton';
import ElementsManager from './components/ElementsManager';
import Fireworks from './components/Fireworks';
import Background from '../../components/background/Background';

export default class GameScene extends Phaser.Scene {
  public manager!: SingleplayerManager;

  elementsManager!: ElementsManager;

  panel!: TopPanel;

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
      level = unlockedMaps.length < Levels.length ? unlockedMaps[unlockedMaps.length - 1]?.id : 0;
    }
    this.level = level || 0;
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
    this.panel = new TopPanel(this, SceneKeys.Game, true, true, this.goToScene, this.level);

    this.initEvents();
    this.initHotkeys();
  }

  private async initEvents(): Promise<void> {
    this.events.once(
      EventNames.Win,
      this.elementsManager.ball.deactivate,
      this.elementsManager.ball,
    );
    this.events.once(EventNames.Win, () => {
      console.log('log');
      const fireworks = new Fireworks();
      fireworks.create(this, this.elementsManager.cup.x, this.elementsManager.cup.y);
    });
    this.events.once(EventNames.Win, this.updateMaps.bind(this));
    this.events.once(EventNames.Win, this.displayWinPopup.bind(this));
    this.events.once(EventNames.GameOver, this.handleGameOver.bind(this));
  }

  private initHotkeys() {
    HotkeysService.initHotkeysEvents(this);
    this.events.on(HotkeysEvents.Levels, this.panel.openLevels.bind(this.panel));
    this.events.on(HotkeysEvents.Info, this.panel.openInfo.bind(this.panel));
    this.events.on(HotkeysEvents.Back, this.panel.handleEscInput.bind(this.panel));
    this.events.on(HotkeysEvents.Sounds, this.panel.toggleSound.bind(this.panel));
    this.events.on(HotkeysEvents.Music, this.panel.toggleMusic.bind(this.panel));
    this.events.on(HotkeysEvents.Mute, this.panel.toggleMute.bind(this.panel));
    this.events.on(HotkeysEvents.Restart, this.panel.restart.bind(this.panel));
  }

  private async updateMaps(): Promise<void> {
    const { maps } = store.getState().app;
    const index = maps.findIndex((map) => map.id === this.level);
    if (index !== -1 && maps[index].stars <= this.data.values.stars) {
      const newMaps = MapService.updateMapsObject(maps, index, this.data.values.stars);
      if (store.getState().user.isAuth) {
        await store.dispatch(axiosUpdateMaps(newMaps));
      }
      store.dispatch(setMaps(newMaps));
      LocalStorageService.setItem<Maps>(LocalStorageKeys.maps, newMaps);
    }
  }

  private displayWinPopup() {
    HotkeysService.disablePopupHotkeys(this);
    this.panel.toggleButtonsInteractivity(false);
    this.time.delayedCall(2000, async () => {
      if (this.level < Levels.length - 1) {
        await this.createNextLevelPopup();
      } else {
        this.level = 0;
        await this.createWinPopup();
      }
    });
  }

  private async createNextLevelPopup(): Promise<void> {
    const popup = new NextLevelButton(this);
    await popup.create(this.data.values.stars, this.goToScene);
  }

  private async createWinPopup(): Promise<void> {
    const allStars = CalculateService.calculateStars(store.getState().app.maps);
    const popup = new WinPopup(
      this,
      allStars,
      this.goToScene.bind(this),
      SceneKeys.Game,
      LANGUAGE.winPopup.singleplayWinMessage[store.getState().app.lang],
    );
    await popup.show();
    await Promise.all([
      popup.restartButton.show(
        this.scale.width / 2 - GAME_SCENE.nextLevelPopup.button.finalPaddingX,
      ),
      popup.backButton.show(this.scale.width / 2 + GAME_SCENE.nextLevelPopup.button.finalPaddingX),
    ]);
  }

  private handleGameOver(): void {
    if (this.data.values.isGameOver) return;
    this.data.values.isGameOver = true;
    this.cameras.main.shake(1000, 0.015);
    SoundService.playSound(this, SoundsKeys.GameOver);
    this.time.addEvent({
      delay: 2000,
      callback: () => {
        this.goToScene(SceneKeys.Game, false);
      },
    });
  }

  public update(): void {
    try {
      this.background.update();
      this.elementsManager.update();
      this.manager.update();
    } catch (e) {
      console.log();
    }
  }

  public goToScene(key: string, nextLevel?: boolean): void {
    this.cameras.main.fadeOut();
    this.data.values.stars = 0;
    this.time.addEvent({
      delay: 2000,
      callback: () => {
        this.elementsManager.destroyElements();
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
    HotkeysService.removeAllHotkeysEvents(this);
  }
}
