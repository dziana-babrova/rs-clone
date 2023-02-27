import LoadingOverlay from 'client/components/LoadingOverlay';
import Landscape from 'client/components/popups/Landscape';
import Levels from 'client/components/popups/Levels';
import Winners from 'client/components/popups/Winners';
import { LocalStorageKeys } from 'client/const/AppConstants';
import { NEXT_LANG } from 'client/const/Language';
import {
  Language,
  Colors,
  SceneKeys,
  SettingsPopupKeys,
  SoundsKeys,
  TextureKeys,
} from 'common/types/enums';
import { emptyLevel } from 'client/const/levels/Levels';
import ErrorService from 'client/services/ErrorService';
import LocalStorageService from 'client/services/LocalStorageService';
import SocketService from 'client/services/SocketService';
import SoundService from 'client/services/SoundService';
import { setLang, setMusic } from 'client/state/features/AppSlice';
import { axiosSignOut } from 'client/state/features/UserSlice';
import store from 'client/state/store';
import { Scene } from 'phaser';
import WinnerApiService from 'client/services/WinnersApiService';
import HotkeysService from 'client/services/HotkeysService';
import { HotkeysEvents } from 'common/types/events';
import ErrorPopup from 'client/components/popups/ErrorPopup';
import ElementsManager from '../game-scene/components/ElementsManager';
import AuthBtn from './components/AuthBtn';
import AuthPopup from './components/AuthPopup';
import LangBtn from './components/LangBtn';
import LogoGroup from './components/LogoGroup';
import MultiplayerBtns from './components/MultiplayerBtns';
import RoomPopup from './components/RoomPopup';
import StartSceneBtns from './components/StartSceneBtns';

export default class StartScene extends Scene {
  lang: Language = Language.Eng;

  logoGroup!: LogoGroup;

  startSceneBtns!: StartSceneBtns;

  multiplayerBtns!: MultiplayerBtns;

  roomPopup!: RoomPopup;

  langBtn!: LangBtn;

  authBtn!: AuthBtn;

  authPopup!: AuthPopup;

  settingsPopup: Levels | Landscape | Winners | ErrorPopup | null = null;

  music!: Phaser.Sound.BaseSound;

  socketService!: SocketService;

  loadingOverlay!: LoadingOverlay;

  constructor() {
    super(SceneKeys.Start);
  }

  public init(): void {
    this.cameras.main.setBackgroundColor(Colors.StartSceneBG);
    this.socketService = new SocketService();
  }

  public preload(): void {}

  public async create(): Promise<void> {
    this.loadingOverlay = new LoadingOverlay(this);

    const { user } = store.getState();

    if (user.isAuth) {
      this.authBtn = new AuthBtn(this, user.user.username);
    } else {
      this.authBtn = new AuthBtn(this);
    }

    this.logoGroup = new LogoGroup(this);
    this.startSceneBtns = new StartSceneBtns(this);
    this.multiplayerBtns = new MultiplayerBtns(this);
    this.roomPopup = new RoomPopup(this, this.socketService);
    this.authPopup = new AuthPopup(this);
    this.langBtn = new LangBtn(this);
    const golfCourse = new ElementsManager(this, emptyLevel, 41);

    await Promise.all([
      this.logoGroup.show(),
      this.authBtn.show(),
      this.langBtn.show(),
      this.startSceneBtns.showSingleGameBtn(),
      this.startSceneBtns.showTwoPlayersGameBtn(),
      this.startSceneBtns.showBtnSettings(),
    ]);

    SoundService.playMusic(this, SoundsKeys.Music);

    this.initEvents();
    this.initHotkeys();

    await golfCourse.create();
    golfCourse.ball.setVelocityX(25);
  }

  private initEvents(): void {
    this.langBtn.on('pointerdown', this.changeLang.bind(this));
    this.startSceneBtns.btnStartSingleGame.on('pointerdown', this.startSingleGame.bind(this));
    this.startSceneBtns.btnTwoPlayersGame.on('pointerdown', this.showMultiplayerBtns.bind(this));

    this.multiplayerBtns.btnStartLocalGame.on('pointerdown', this.startLocalGame.bind(this, false));
    this.multiplayerBtns.btnStartWithBotGame.on('pointerdown', this.startLocalGame.bind(this, true));
    this.multiplayerBtns.btnStartOnlineGame.on('pointerdown', this.showRoomPopup.bind(this));
    this.multiplayerBtns.btnBack.background.on('pointerdown', this.hideMultiplayerBtns.bind(this));

    this.roomPopup.onClosePopup = this.onCloseRoomPopup.bind(this);
    this.roomPopup.onStartOnlineGame = this.startOnlineGame.bind(this);
    this.socketService.successConnection(this.startOnlineGame, this);

    this.authBtn.on('pointerdown', this.authBtnHandler.bind(this));
    this.authPopup.onUpdateAuthBtn = this.onUpdateAuthBtn.bind(this);
    this.authPopup.onClosePopup = this.onClosePopup.bind(this);

    this.startSceneBtns.btnLevels.background.on(
      'pointerdown',
      this.createSettingsPopup.bind(this, SettingsPopupKeys.Levels),
    );
    this.startSceneBtns.btnLandscape.background.on(
      'pointerdown',
      this.createSettingsPopup.bind(this, SettingsPopupKeys.Landscape),
    );
    this.startSceneBtns.btnWinners.background.on(
      'pointerdown',
      this.createSettingsPopup.bind(this, SettingsPopupKeys.Winners),
    );

    this.startSceneBtns.btnMusic.background.on('pointerdown', this.turnOnOffSound.bind(this));
  }

  private initHotkeys() {
    HotkeysService.initHotkeysEvents(this);
    this.events.on(
      HotkeysEvents.Levels,
      this.handlePopupHotKey.bind(this, SettingsPopupKeys.Levels),
    );
    this.events.on(
      HotkeysEvents.Winners,
      this.handlePopupHotKey.bind(this, SettingsPopupKeys.Winners),
    );
    this.events.on(HotkeysEvents.Back, () => {
      if (this.settingsPopup) this.settingsPopup.closePopup();
    });
    this.events.on(HotkeysEvents.Music, this.turnOnOffSound.bind(this));
  }

  protected async handlePopupHotKey(key: SettingsPopupKeys) {
    if (!this.settingsPopup) {
      this.createSettingsPopup(key);
      return;
    }
    await this.settingsPopup.closePopup();
    this.createSettingsPopup(key);
  }

  private async showMultiplayerBtns() {
    await Promise.all([this.startSceneBtns.hide(), this.multiplayerBtns.show()]);
  }

  private async hideMultiplayerBtns() {
    await Promise.all([this.startSceneBtns.show(), this.multiplayerBtns.hide()]);
  }

  private async createSettingsPopup(type: SettingsPopupKeys): Promise<void> {
    this.handleInteractiveStartScreen(false);
    switch (type) {
      case SettingsPopupKeys.Levels: {
        const level = store.getState().app.maps.findIndex((el) => !el.isUnlock);
        this.settingsPopup = new Levels(this, level);
        if (this.settingsPopup instanceof Levels) {
          this.settingsPopup.startLevel = this.startSingleGame.bind(this);
        }
        break;
      }
      case SettingsPopupKeys.Landscape: {
        this.settingsPopup = new Landscape(this);
        break;
      }
      case SettingsPopupKeys.Winners: {
        this.loadingOverlay.show();
        try {
          const response = await WinnerApiService.getWinners();
          this.loadingOverlay.hide();
          this.handleInteractiveStartScreen.bind(this, false);
          this.settingsPopup = new Winners(this, response.data);
        } catch (e: unknown) {
          this.loadingOverlay.hide();
          this.handleInteractiveStartScreen.bind(this, false);
          this.settingsPopup = ErrorService.createErrorPopup(this);
        }
        break;
      }
      default:
    }
    if (this.settingsPopup) this.settingsPopup.onClosePopup = this.onCloseSettingsPopup.bind(this);
  }

  private handleInteractiveStartScreen(isActive: boolean): void {
    if (isActive) {
      this.authBtn.setInteractive();
      this.langBtn.setInteractive();
      this.startSceneBtns.btnStartSingleGame.setInteractive();
      this.startSceneBtns.btnTwoPlayersGame.setInteractive();
      this.startSceneBtns.btnLevels.background.setInteractive();
      this.startSceneBtns.btnLandscape.background.setInteractive();
      this.startSceneBtns.btnWinners.background.setInteractive();
      this.startSceneBtns.btnMusic.background.setInteractive();
    } else {
      this.authBtn.disableInteractive();
      this.langBtn.disableInteractive();
      this.startSceneBtns.btnStartSingleGame.disableInteractive();
      this.startSceneBtns.btnTwoPlayersGame.disableInteractive();
      this.startSceneBtns.btnLevels.background.disableInteractive();
      this.startSceneBtns.btnLandscape.background.disableInteractive();
      this.startSceneBtns.btnWinners.background.disableInteractive();
      this.startSceneBtns.btnMusic.background.disableInteractive();
    }
  }

  private onCloseSettingsPopup(): void {
    this.handleInteractiveStartScreen(true);
    this.settingsPopup = null;
  }

  private onClosePopup(): void {
    this.input.enabled = true;
    HotkeysService.keyBoardOn(this);
  }
  
  private onCloseRoomPopup() {
    this.onClosePopup();
    this.socketService.leave();
    HotkeysService.keyBoardOn(this);
  }

  private turnOnOffSound(): void {
    const isPlaying = store.getState().app.music;
    store.dispatch(setMusic(!isPlaying));
    LocalStorageService.setItem<boolean>(LocalStorageKeys.music, !isPlaying);
    SoundService.playMusic(this, SoundsKeys.Music);
    if (isPlaying) {
      this.startSceneBtns.btnMusic.icon.setTexture(TextureKeys.MusicOff);
      return;
    }
    this.startSceneBtns.btnMusic.icon.setTexture(TextureKeys.MusicOn);
  }

  private changeLang(): void {
    this.lang = NEXT_LANG[store.getState().app.lang as Language];
    this.langBtn.setTexture(TextureKeys[this.lang]);
    store.dispatch(setLang(this.lang));
    LocalStorageService.setItem<Language>(LocalStorageKeys.lang, this.lang);
    this.updateText();
  }

  private updateText(): void {
    this.authBtn.updateBtnText();
    this.startSceneBtns.updateText(this.lang);
    this.multiplayerBtns.updateText(this.lang);
    this.logoGroup.updateText(this.lang);
  }

  private async authBtnHandler(): Promise<void> {
    this.input.enabled = false;
    if (store.getState().user.isAuth) {
      this.loadingOverlay.show();
      await store.dispatch(axiosSignOut());
      this.authBtn.updateBtnText();
      this.input.enabled = true;
      this.loadingOverlay.hide();
    } else {
      this.authPopup.renderPopup();
      HotkeysService.keyBoardOff(this);
    }
  }

  private onUpdateAuthBtn(): void {
    this.authBtn.updateBtnText();
  }

  private startSingleGame(level?: number): void {
    this.scene.stop();
    this.removeStartScreenObjects();
    if (typeof level === 'number') {
      this.scene.start(SceneKeys.Game, { level });
      return;
    }
    this.scene.start(SceneKeys.Game);
  }

  private startLocalGame(withBot: Boolean): void {
    this.removeStartScreenObjects();
    this.scene.start(SceneKeys.MultiPlayer, { withBot });
  }

  async showRoomPopup(): Promise<void> {
    await this.socketService.join();
    this.input.enabled = false;
    this.roomPopup.renderPopup();
    this.roomPopup.show();
    HotkeysService.keyBoardOff(this);
  }

  private startOnlineGame(): void {
    this.scene.start(SceneKeys.Online, this.socketService);
  }

  private removeStartScreenObjects(): void {
    this.children.list.forEach((obj) => obj.destroy());
    HotkeysService.removeAllHotkeysEvents(this);
  }

  goToOnline() {
    this.scene.start(SceneKeys.Online, this.socketService);
  }
}
