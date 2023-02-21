import { Colors, SceneKeys, TextureKeys } from 'types/enums';
import { Language, NEXT_LANG } from 'const/Language';
import { LocalStorageKeys } from 'const/AppConstants';
import LocalStorageService from 'services/LocalStorageService';
import { axiosSignOut } from 'state/features/UserSlice';
import { axiosCreateMaps, setLang, setMusic } from 'state/features/AppSlice';
import store from 'state/store';
import { emptyLevel } from 'const/levels/Levels';
import ElementsManager from 'scenes/game-scene/components/ElementsManager';
import MapService from 'services/MapService';
import Landscape from './components/Landscape';
import LangBtn from './components/LangBtn';
import Levels from './components/Levels';
import LogoGroup from './components/LogoGroup';
import StartSceneBtns from './components/StartSceneBtns';
import Winners from './components/Winners';
import AuthBtn from './components/AuthBtn';
import AuthPopup from './components/AuthPopup';

export default class StartScene extends Phaser.Scene {
  lang: Language = Language.Eng;

  music!: Phaser.Sound.BaseSound;

  logoGroup!: LogoGroup;

  startSceneBtns!: StartSceneBtns;

  langBtn!: LangBtn;

  authBtn!: AuthBtn;

  authPopup!: AuthPopup;

  levels!: Levels;

  landscape!: Landscape;

  winners!: Winners;

  constructor() {
    super(SceneKeys.Start);
  }

  public init(): void {
    this.cameras.main.setBackgroundColor(Colors.StartSceneBG);
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

    this.levels = new Levels(this);
    this.landscape = new Landscape(this);
    this.winners = new Winners(this);

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

    this.startSceneBtns.btnLevels.background.on('pointerdown', this.showLevels.bind(this));
    this.startSceneBtns.btnLandscape.background.on('pointerdown', this.showLandscape.bind(this));
    this.startSceneBtns.btnWinners.background.on('pointerdown', this.showWinners.bind(this));

    this.startSceneBtns.btnMusic.background.on('pointerdown', this.turnOnOffSound.bind(this));

    this.levels.btnClose.on('pointerdown', this.hideLevels.bind(this));
    this.landscape.btnClose.on('pointerdown', this.hideLandscape.bind(this));
    this.winners.btnClose.on('pointerdown', this.hideWinners.bind(this));
  }

  private turnOnOffSound(): void {
    if (this.music.isPlaying) {
      this.startSceneBtns.btnMusic.icon.setTexture(TextureKeys.MusicOff);
      this.music.pause();
      store.dispatch(setMusic(false));
      LocalStorageService.setItem(LocalStorageKeys.music, false);
      return;
    }
    this.startSceneBtns.btnMusic.icon.setTexture(TextureKeys.MusicOn);
    this.music.play();
    store.dispatch(setMusic(true));
    LocalStorageService.setItem(LocalStorageKeys.music, true);
  }

  private changeLang(): void {
    this.lang = NEXT_LANG[store.getState().app.lang];
    this.langBtn.setTexture(TextureKeys[this.lang]);
    store.dispatch(setLang(this.lang));
    LocalStorageService.setItem(LocalStorageKeys.lang, this.lang);
    this.updateText();
  }

  private updateText(): void {
    this.authBtn.updateBtnText();
    this.startSceneBtns.updateText(this.lang);
    this.logoGroup.updateText(this.lang);
    this.levels.updateText(this.lang);
    this.landscape.updateText(this.lang);
    this.winners.updateText(this.lang);
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

  private async showLevels(): Promise<void> {
    store.dispatch(axiosCreateMaps(MapService.getDefaultMapsObject()));
    await Promise.all([
      this.startSceneBtns.hide(),
      this.levels.show(),
    ]);
  }

  private async hideLevels(): Promise<void> {
    await Promise.all([
      this.startSceneBtns.show(),
      this.levels.hide(),
    ]);
  }

  private async showLandscape(): Promise<void> {
    await Promise.all([
      this.startSceneBtns.hide(),
      this.landscape.show(),
    ]);
  }

  private async hideLandscape(): Promise<void> {
    await Promise.all([
      this.startSceneBtns.show(),
      this.landscape.hide(),
    ]);
  }

  private async showWinners(): Promise<void> {
    await Promise.all([
      this.startSceneBtns.hide(),
      this.winners.show(),
    ]);
  }

  private async hideWinners() : Promise<void> {
    await Promise.all([
      this.startSceneBtns.show(),
      this.winners.hide(),
    ]);
  }

  private startSingleGame(): void {
    this.removeStartScreenObjects();
    this.scene.start(SceneKeys.Game);
  }

  private startOnlineGame(): void {
    this.removeStartScreenObjects();
    this.scene.start(SceneKeys.MultiPlayer);
  }

  private removeStartScreenObjects(): void {
    this.logoGroup.destroy();
    this.startSceneBtns.destroy();
    this.authBtn.destroy();
    this.authPopup.destroy();
    this.langBtn.destroy();
    this.levels.destroy();
    this.winners.destroy();
    this.landscape.destroy();
  }
}
