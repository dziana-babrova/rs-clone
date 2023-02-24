import {
  Colors, SceneKeys, SettinsPopupKeys as SettingsPopupKeys, SoundsKeys, TextureKeys,
} from 'common/types/enums';
import { Language, NEXT_LANG } from 'client/const/Language';
import { LocalStorageKeys } from 'client/const/AppConstants';
import LocalStorageService from 'client/services/LocalStorageService';
import { axiosSignOut } from 'client/state/features/UserSlice';
import { setLang, setMusic } from 'client/state/features/AppSlice';
import store from 'client/state/store';
import SoundService from 'client/services/SoundService';
import Landscape from 'client/components/popups/Landscape';
import Levels from 'client/components/popups/Levels';
import Winners from 'client/components/popups/Winners';
import { emptyLevel } from 'client/const/levels/Levels';
import LangBtn from './components/LangBtn';
import LogoGroup from './components/LogoGroup';
import AuthBtn from './components/AuthBtn';
import StartSceneBtns from './components/StartSceneBtns';
import AuthPopup from './components/AuthPopup';
import ElementsManager from '../game-scene/components/ElementsManager';
import SocketService from 'client/services/SocketService';
import { Server } from 'socket.io';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export default class StartScene extends Phaser.Scene {
  lang: Language = Language.Eng;

  logoGroup!: LogoGroup;

  startSceneBtns!: StartSceneBtns;

  langBtn!: LangBtn;

  authBtn!: AuthBtn;

  authPopup!: AuthPopup;

  settingsPopup!: Levels | Landscape | Winners;

  music!: Phaser.Sound.BaseSound;

  socketService!: SocketService;

  socket!: Socket<DefaultEventsMap, DefaultEventsMap>;

  constructor() {
    super(SceneKeys.Start);
  }

  public init(): void {
    this.cameras.main.setBackgroundColor(Colors.StartSceneBG);
    this.socketService = new SocketService();
  }

  public preload(): void {
  }

  public async create(): Promise<void> {
    const { user } = store.getState();

    if (user.isAuth) {
      this.authBtn = new AuthBtn(this, user.user.username);
    } else {
      this.authBtn = new AuthBtn(this);
    }

    this.logoGroup = new LogoGroup(this);
    this.startSceneBtns = new StartSceneBtns(this);
    this.authPopup = new AuthPopup(this);
    this.langBtn = new LangBtn(this);
    const golfCourse = new ElementsManager(this, emptyLevel, 41);

    await Promise.all([
      this.logoGroup.show(),
      this.authBtn.show(),
      this.langBtn.show(),
      this.startSceneBtns.showSingleGameBtn(),
      this.startSceneBtns.showOnlineGameBtn(),
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
    this.startSceneBtns.btnStartOnlineGame.on('pointerdown', this.startOnlineGame.bind(this));

    this.authBtn.on('pointerdown', this.authBtnHandler.bind(this));
    this.authPopup.onClosePopup = this.onClosePopup.bind(this);

    this.startSceneBtns.btnLevels.background.on('pointerdown', this.createSettingsPopup.bind(this, SettingsPopupKeys.Levels));
    this.startSceneBtns.btnLandscape.background.on('pointerdown', this.createSettingsPopup.bind(this, SettingsPopupKeys.Landscape));
    this.startSceneBtns.btnWinners.background.on('pointerdown', this.createSettingsPopup.bind(this, SettingsPopupKeys.Winners));

    this.startSceneBtns.btnMusic.background.on('pointerdown', this.turnOnOffSound.bind(this));
  }

  private createSettingsPopup(type: SettingsPopupKeys): void {
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
        break;
      }
      case SettingsPopupKeys.Winners: {
        this.settingsPopup = new Winners(this);
        break;
      }
      default:
    }
  }

  private handleInteractiveStartScreen(isActive: boolean): void {
    if (isActive) {
      this.authBtn.setInteractive();
      this.langBtn.setInteractive();
    } else {
      this.authBtn.disableInteractive();
      this.langBtn.disableInteractive();
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

  async changeLang(): Promise<void> {
    this.lang = NEXT_LANG[store.getState().app.lang as Language];
    this.langBtn.setTexture(TextureKeys[this.lang]);
    store.dispatch(setLang(this.lang));
    LocalStorageService.setItem<Language>(LocalStorageKeys.lang, this.lang);
    this.updateText();
    const socket = await this.socketService.join();
    this.socket = socket;
    this.socketService.createRoom('tester');
    console.log(socket);
    this.goToOnline();
  }

  private updateText(): void {
    this.authBtn.updateBtnText();
    this.startSceneBtns.updateText(this.lang);
    this.logoGroup.updateText(this.lang);
  }

  private async authBtnHandler(): Promise<void> {
    this.input.enabled = false;
    if (store.getState().user.isAuth) {
      await store.dispatch(axiosSignOut());
      this.authBtn.updateBtnText();
      this.input.enabled = true;
    } else {
      this.authPopup.renderPopup();
      this.authPopup.show();
    }
  }

  private onClosePopup(isUbdateAuthBtnText = false): void {
    if (isUbdateAuthBtnText) {
      this.authBtn.updateBtnText();
    }

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

  async startOnlineGame() {
    this.removeStartScreenObjects();
    const socket = await this.socketService.join();
    this.socket = socket;
    this.socketService.connectToRoom('tester');
    this.goToOnline();
    // this.scene.start(SceneKeys.Online);
  }

  private removeStartScreenObjects(): void {
    this.logoGroup.destroy();
    this.startSceneBtns.destroy();
    this.authBtn.destroy();
    this.authPopup.destroy();
    this.langBtn.destroy();
  }

  goToOnline(){
    this.scene.start(SceneKeys.Online, this.socketService);
  }
}
