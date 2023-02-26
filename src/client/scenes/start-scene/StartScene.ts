import { AxiosError } from 'axios';
import LoadingOverlay from 'client/components/LoadingOverlay';
import Landscape from 'client/components/popups/Landscape';
import Levels from 'client/components/popups/Levels';
import Winners from 'client/components/popups/Winners';
import { LocalStorageKeys } from 'client/const/AppConstants';
import { Language, NEXT_LANG } from 'client/const/Language';
import { emptyLevel } from 'client/const/levels/Levels';
import ErrorService from 'client/services/ErrorService';
import LocalStorageService from 'client/services/LocalStorageService';
import SoundService from 'client/services/SoundService';
import WinnersService from 'client/services/WinnersService ';
import { setLang, setMusic } from 'client/state/features/AppSlice';
import { axiosSignOut } from 'client/state/features/UserSlice';
import store from 'client/state/store';
import {
  Colors, SceneKeys, SettingsPopupKeys, SoundsKeys, TextureKeys,
} from 'common/types/enums';
import { WinnersResponse } from 'common/types/types';
import { Scene } from 'phaser';
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

  settingsPopup!: Levels | Landscape | Winners;

  music!: Phaser.Sound.BaseSound;

  loadingOverlay!: LoadingOverlay;

  constructor() {
    super(SceneKeys.Start);
  }

  public init(): void {
    this.cameras.main.setBackgroundColor(Colors.StartSceneBG);
  }

  public preload(): void {
  }

  public async create(): Promise<void> {
    this.loadingOverlay = new LoadingOverlay(this);

    ErrorService.setScene(this);
    const { user } = store.getState();

    if (user.isAuth) {
      this.authBtn = new AuthBtn(this, user.user.username);
    } else {
      this.authBtn = new AuthBtn(this);
    }

    this.logoGroup = new LogoGroup(this);
    this.startSceneBtns = new StartSceneBtns(this);
    this.multiplayerBtns = new MultiplayerBtns(this);
    this.roomPopup = new RoomPopup(this);
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

    await golfCourse.create();
    golfCourse.ball.setVelocityX(25);

    this.music = this.sound.add('music', {
      volume: 0.2,
      loop: true,
    });

    if (store.getState().app.music) this.music.play();
  }

  private initEvents(): void {
    this.langBtn.on('pointerdown', this.changeLang.bind(this));
    this.startSceneBtns.btnStartSingleGame.on('pointerdown', this.startSingleGame.bind(this));
    this.startSceneBtns.btnTwoPlayersGame.on('pointerdown', this.showMultiplayerBtns.bind(this));

    this.multiplayerBtns.btnStartLocalGame.on('pointerdown', this.startLocalGame.bind(this));
    this.multiplayerBtns.btnStartOnlineGame.on('pointerdown', this.showRoomPopup.bind(this));
    this.multiplayerBtns.btnBack.background.on('pointerdown', this.hideMultiplayerBtns.bind(this));

    this.roomPopup.onClosePopup = this.onClosePopup.bind(this);
    this.roomPopup.onStartOnlineGame = this.startOnlineGame.bind(this);

    this.authBtn.on('pointerdown', this.authBtnHandler.bind(this));
    this.authPopup.onUpdateAuthBtn = this.onUpdateAuthBtn.bind(this);
    this.authPopup.onClosePopup = this.onClosePopup.bind(this);

    this.startSceneBtns.btnLevels.background.on('pointerdown', this.createSettingsPopup.bind(this, SettingsPopupKeys.Levels));
    this.startSceneBtns.btnLandscape.background.on('pointerdown', this.createSettingsPopup.bind(this, SettingsPopupKeys.Landscape));
    this.startSceneBtns.btnWinners.background.on('pointerdown', this.createSettingsPopup.bind(this, SettingsPopupKeys.Winners));

    this.startSceneBtns.btnMusic.background.on('pointerdown', this.turnOnOffSound.bind(this));
  }

  private async showMultiplayerBtns(): Promise<void> {
    await Promise.all([
      this.startSceneBtns.hide(),
      this.multiplayerBtns.show(),
    ]);
  }

  private async hideMultiplayerBtns(): Promise<void> {
    await Promise.all([
      this.startSceneBtns.show(),
      this.multiplayerBtns.hide(),
    ]);
  }

  private async createSettingsPopup(type: SettingsPopupKeys): Promise<void> {
    this.handleInteractiveStartScreen(false);
    switch (type) {
      case SettingsPopupKeys.Levels: {
        this.settingsPopup = new Levels(this);
        if (this.settingsPopup instanceof Levels) {
          this.settingsPopup.startLevel = this.startSingleGame.bind(this);
        }
        this.settingsPopup.onClosePopup = this.handleInteractiveStartScreen.bind(this, true);
        break;
      }
      case SettingsPopupKeys.Landscape: {
        this.settingsPopup = new Landscape(this);
        this.settingsPopup.onClosePopup = this.handleInteractiveStartScreen.bind(this, true);
        break;
      }
      case SettingsPopupKeys.Winners: {
        this.loadingOverlay.show();
        const winnersResponse: WinnersResponse | AxiosError = await WinnersService.getWinners();
        this.loadingOverlay.hide();
        this.handleInteractiveStartScreen.bind(this, false);
        if ('message' in winnersResponse) {
          const errorPopup = ErrorService.createErrorPopup();
          if (errorPopup) {
            errorPopup.onClosePopup = this.handleInteractiveStartScreen.bind(this, true);
          }
        } else {
          this.settingsPopup = new Winners(this, winnersResponse);
          this.settingsPopup.onClosePopup = this.handleInteractiveStartScreen.bind(this, true);
        }
        break;
      }
      default:
    }
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
    }
  }

  private onUpdateAuthBtn(): void {
    this.authBtn.updateBtnText();
  }

  private onClosePopup(): void {
    this.input.enabled = true;
  }

  private startSingleGame(level?: number): void {
    this.removeStartScreenObjects();
    if (typeof level === 'number') {
      this.scene.start(SceneKeys.Game, { level });
      return;
    }
    this.scene.start(SceneKeys.Game);
  }

  private startLocalGame(): void {
    this.removeStartScreenObjects();
    this.scene.start(SceneKeys.Online);
  }

  private showRoomPopup(): void {
    this.input.enabled = false;
    this.roomPopup.renderPopup();
    this.roomPopup.show();
  }

  private startOnlineGame(): void {
    console.log('startOnlineGame');
    // this.scene.start(SceneKeys.MultiPlayer);
  }

  private removeStartScreenObjects(): void {
    this.children.list.forEach((obj) => obj.destroy());
    // this.logoGroup.destroy();
    // this.startSceneBtns.destroy();
    // this.multiplayerBtns.destroy();
    // this.authBtn.destroy();
    // this.authPopup.destroy();
    // this.langBtn.destroy();
  }
}
