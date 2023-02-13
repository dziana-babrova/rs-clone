import Colors from 'const/Colors';
import LANGUAGE, { Language, NEXT_LANG } from 'const/Language';
import LocalStorageKeys from 'const/LocalStorageKeys';
import SceneKeys from 'const/SceneKeys';
import TextureKeys from 'const/TextureKeys';
import LocalStorageService from 'services/LocalStorageService';
import { setLang, setMusic } from 'state/features/AppSlice';
import { axiosSignIn, axiosSignUp } from 'state/features/UserSlice';
import store from 'state/store';
import Landscape from './components/Landscape';
import LangBtn from './components/LangBtn';
import Levels from './components/Levels';
import LogoGroup from './components/LogoGroup';
import SignInBtn from './components/SignInBtn';
import StartSceneBtns from './components/StartSceneBtns';
import Winners from './components/Winners';

export default class StartScene extends Phaser.Scene {
  lang: Language = Language.Eng;

  music!: Phaser.Sound.BaseSound;

  logoGroup!: LogoGroup;

  startSceneBtns!: StartSceneBtns;

  langBtn!: LangBtn;

  signIn!: SignInBtn;

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
    store.subscribe(() => { console.log(store.getState()); });
  }

  public async create(): Promise<void> {
    this.logoGroup = new LogoGroup(this);
    this.startSceneBtns = new StartSceneBtns(this);
    this.signIn = new SignInBtn(this);
    this.langBtn = new LangBtn(this);

    await Promise.all([
      this.logoGroup.show(),
      this.signIn.show(),
      this.langBtn.show(),
      this.startSceneBtns.showSingleGameBtn(),
      this.startSceneBtns.showOnlineGameBtn(),
      this.startSceneBtns.showBtnSettings(),
    ]);

    this.music = this.sound.add('music', {
      volume: 0.2,
      loop: true,
    });

    if (store.getState().app.music) this.music.play();

    this.levels = new Levels(this);
    this.landscape = new Landscape(this);
    this.winners = new Winners(this);

    this.initEvents();
  }

  private initEvents(): void {
    this.langBtn.on('pointerdown', this.changeLang.bind(this));
    this.startSceneBtns.btnStartSingleGame.on('pointerdown', this.startSingleGame.bind(this));
    this.startSceneBtns.btnStartOnlineGame.on('pointerdown', this.startOnlineGame.bind(this));

    this.signIn.on('pointerdown', this.signInHandler.bind(this));

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
    this.signIn.setText(LANGUAGE.startScene.signIn[this.lang]);
    this.startSceneBtns.updateText(this.lang);
    this.logoGroup.updateText(this.lang);
    this.levels.updateText(this.lang);
    this.landscape.updateText(this.lang);
    this.winners.updateText(this.lang);
  }

  private signInHandler(): void {
    store.dispatch(axiosSignUp({ email: 'asdsad@asd.sa', username: 'tester', password: 'asdasdasd123' }));
    store.dispatch(axiosSignIn({ email: 'asdsad@asd.sa', password: 'asdasdasd123' }));
  }

  private async showLevels(): Promise<void> {
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

  private startOnlineGame(): void {}

  private removeStartScreenObjects(): void {
    this.logoGroup.destroy();
    this.startSceneBtns.destroy();
    this.signIn.destroy();
    this.langBtn.destroy();
    this.levels.destroy();
    this.winners.destroy();
    this.landscape.destroy();
  }
}
