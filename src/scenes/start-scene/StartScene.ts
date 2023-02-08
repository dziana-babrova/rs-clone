import Colors from 'const/Colors';
import SceneKeys from 'const/SceneKeys';
import START_SCENE from 'const/StartSceneConst';
import { Language } from 'types/types';
import Landscape from './components/Landscape';
import LangBtn from './components/LangBtn';
import Levels from './components/Levels';
import LogoGroup from './components/LogoGroup';
import SignInBtn from './components/SignInBtn';
import StartSceneBtns from './components/StartSceneBtns';
import Winners from './components/Winners';

export default class StartScene extends Phaser.Scene {
  lang!: Language;

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

  }

  public async create(): Promise<void> {
    this.lang = Language.eng;
    this.logoGroup = new LogoGroup(this);
    this.startSceneBtns = new StartSceneBtns(this);
    this.signIn = new SignInBtn(this);
    this.langBtn = new LangBtn(this, this.lang);

    await Promise.all([
      this.logoGroup.show(),
      this.signIn.show(),
      this.langBtn.show(),
      this.startSceneBtns.showBtnStartSingleGame(),
      this.startSceneBtns.showBtnStartOnlineGame(),
      this.startSceneBtns.showBtnSettings(),
    ]);

    this.music = this.sound.add('music', {
      volume: 0.2,
      loop: true,
    });
    // this.music.play();

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

    this.startSceneBtns.btnSound.background.on('pointerdown', this.turnOnOffSound.bind(this));

    this.levels.btnClose.on('pointerdown', this.hideLevels.bind(this));
    this.landscape.btnClose.on('pointerdown', this.hideLandscape.bind(this));
    this.winners.btnClose.on('pointerdown', this.hideWinners.bind(this));
  }

  private turnOnOffSound(): void {
    if (this.music.isPlaying) {
      this.startSceneBtns.btnSound.icon.setTexture('sound-off');
      this.music.pause();
      return;
    }
    this.startSceneBtns.btnSound.icon.setTexture('sound-on');
    this.music.play();
  }

  private changeLang(): void {
    this.lang = START_SCENE.btnLang.nextLang[this.lang];
    this.langBtn.setTexture(START_SCENE.btnLang.textura[this.lang]);
  }

  private signInHandler(): void {}

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
    this.scene.start(SceneKeys.Game);
  }

  private startOnlineGame(): void {}
}
