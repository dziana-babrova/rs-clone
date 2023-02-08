import Colors from 'const/Colors';
import SceneKeys from 'const/SceneKeys';
import START_SCENE from 'const/StartSceneConst';
import IconButton from './components/IconButton';
import LogoGroup from './components/LogoGroup';
import TextButton from './components/TextButton';

export default class StartScene extends Phaser.Scene {
  centerX!: number;

  music!: Phaser.Sound.BaseSound;

  logoGroup!: LogoGroup;

  startSceneBtns!: Phaser.GameObjects.Group;

  btnStartSingleGame!: TextButton;

  btnStartOnlineGame!: TextButton;

  btnSignIn!: TextButton;

  btnLevels!: IconButton;

  btnLandscape!: IconButton;

  btnWinners!: IconButton;

  btnSound!: IconButton;

  constructor() {
    super(SceneKeys.Start);
    this.startSceneBtns = new Phaser.GameObjects.Group(this);
  }

  public init(): void {
    this.cameras.main.setBackgroundColor(Colors.StartSceneBG);
  }

  public preload(): void {

  }

  public async create(): Promise<void> {
    this.centerX = this.cameras.main.centerX;

    this.logoGroup = new LogoGroup(this);

    this.createStartSceneButtons();

    await Promise.all([
      this.logoGroup.show(),
      this.showBtnStartSingleGame(),
      this.showBtnStartOnlineGame(),
      this.showBtnSignIn(),
      this.showBtnSettings(),
    ]);

    this.music = this.sound.add('music', {
      volume: 0.2,
      loop: true,
    });
    this.music.play();

    this.initEvents();
  }

  private initEvents(): void {
    this.btnStartSingleGame.on('pointerdown', this.startSingleGame.bind(this));
    this.btnStartOnlineGame.on('pointerdown', this.startOnlineGame.bind(this));
    this.btnLevels.background.on('pointerdown', this.showLevels.bind(this));
    this.btnLandscape.background.on('pointerdown', this.showLandscape.bind(this));
    this.btnWinners.background.on('pointerdown', this.showWinners.bind(this));
    this.btnSound.background.on('pointerdown', this.onOffSound.bind(this));
  }

  private onOffSound(): void {
    if (this.music.isPlaying) {
      this.btnSound.icon.setTexture('sound-off');
      this.music.pause();
      return;
    }
    this.btnSound.icon.setTexture('sound-on');
    this.music.play();
  }

  private async showLevels() {
    await Promise.all([
      this.hideStartSceneBtns(),
      // this.levels.show(),
    ]);
  }

  private async showLandscape() {
    await Promise.all([
      this.hideStartSceneBtns(),
      // this.landscape.show(),
    ]);
  }

  private async showWinners() {
    await Promise.all([
      this.hideStartSceneBtns(),
      // this.winners.show(),
    ]);
  }

  private showBtnStartSingleGame(): Promise<void> {
    return new Promise((animationResolve) => {
      this.tweens.add({
        targets: this.btnStartSingleGame,
        ease: 'Back', // 'Linear', 'Cubic', 'Elastic', 'Bounce', 'Back'
        x: `+=${START_SCENE.btnStartOnlineGame.moveX}`,
        duration: 1000,
        delay: 100,
        onComplete: animationResolve,
      });
    });
  }

  private showBtnStartOnlineGame(): Promise<void> {
    return new Promise((animationResolve) => {
      this.tweens.add({
        targets: this.btnStartOnlineGame,
        ease: 'Back', // 'Linear', 'Cubic', 'Elastic', 'Bounce', 'Back'
        x: `-=${START_SCENE.btnStartOnlineGame.moveX}`,
        duration: 1000,
        delay: 100,
        onComplete: animationResolve,
      });
    });
  }

  private showBtnSignIn(): Promise<void> {
    return new Promise((animationResolve) => {
      this.tweens.add({
        targets: this.btnSignIn,
        ease: 'Back', // 'Linear', 'Cubic', 'Elastic', 'Bounce', 'Back'
        scale: 1,
        duration: 1000,
        delay: 100,
        onComplete: animationResolve,
      });
    });
  }

  private showBtnSettings(): Promise<void> {
    return new Promise((animationResolve) => {
      this.tweens.add({
        targets: [
          ...this.btnLevels.getChildren(),
          ...this.btnLandscape.getChildren(),
          ...this.btnWinners.getChildren(),
          ...this.btnSound.getChildren()],
        ease: 'Back', // 'Linear', 'Cubic', 'Elastic', 'Bounce', 'Back'
        scale: 1,
        duration: 1000,
        delay: 100,
        onComplete: animationResolve,
      });
    });
  }

  private showStartSceneBtns(): Promise<void> {
    return new Promise((animationResolve) => {
      this.tweens.add({
        targets: this.startSceneBtns.getChildren(),
        ease: 'Back', // 'Linear', 'Cubic', 'Elastic', 'Bounce', 'Back'
        x: `-=${START_SCENE.btnStartOnlineGame.moveX}`,
        duration: 1000,
        delay: 100,
        onComplete: animationResolve,
      });
    });
  }

  private hideStartSceneBtns(): Promise<void> {
    return new Promise((animationResolve) => {
      this.tweens.add({
        targets: this.startSceneBtns.getChildren(),
        ease: 'Back', // 'Linear', 'Cubic', 'Elastic', 'Bounce', 'Back'
        x: `+=${START_SCENE.btnStartOnlineGame.moveX}`,
        duration: 1000,
        delay: 100,
        onComplete: animationResolve,
      });
    });
  }

  private startSingleGame(): void {
    this.scene.start(SceneKeys.Game);
  }

  private startOnlineGame(): void {

  }

  private createStartSceneButtons(): void {
    this.btnStartSingleGame = new TextButton(
      this,
      {
        x: this.centerX - START_SCENE.btnStartSingleGame.moveX,
        y: START_SCENE.btnStartSingleGame.y,
      },
      START_SCENE.btnStartSingleGame,
    );

    this.btnStartOnlineGame = new TextButton(
      this,
      {
        x: this.centerX + START_SCENE.btnStartOnlineGame.moveX,
        y: START_SCENE.btnStartOnlineGame.y,
      },
      START_SCENE.btnStartOnlineGame,
    );

    this.btnSignIn = new TextButton(
      this,
      {
        x: this.cameras.main.width
          - START_SCENE.btnSignIn.width / 2
          - START_SCENE.btnSignIn.y,
        y: START_SCENE.btnSignIn.y,
      },
      START_SCENE.btnSignIn,
    );

    this.btnSignIn.setScale(0);

    this.btnLevels = new IconButton(
      this,
      START_SCENE.btnSettings.type.levels,
      {
        x: this.centerX
          - START_SCENE.btnSettings.btnSettingsParams.width
          - START_SCENE.btnSettings.btnSettingsParams.width / 2
          - START_SCENE.btnSettings.halfGap * 3,
        y: START_SCENE.btnSettings.y,
      },
      START_SCENE.btnSettings.btnSettingsParams,
    );

    this.btnLandscape = new IconButton(
      this,
      START_SCENE.btnSettings.type.landscape,
      {
        x: this.centerX
          - START_SCENE.btnSettings.btnSettingsParams.width / 2
          - START_SCENE.btnSettings.halfGap,
        y: START_SCENE.btnSettings.y,
      },
      START_SCENE.btnSettings.btnSettingsParams,
    );

    this.btnWinners = new IconButton(
      this,
      START_SCENE.btnSettings.type.winners,
      {
        x: this.centerX
          + START_SCENE.btnSettings.btnSettingsParams.width / 2
          + START_SCENE.btnSettings.halfGap,
        y: START_SCENE.btnSettings.y,
      },
      START_SCENE.btnSettings.btnSettingsParams,
    );

    this.btnSound = new IconButton(
      this,
      'sound-on',
      {
        x: this.centerX
          + START_SCENE.btnSettings.btnSettingsParams.width
          + START_SCENE.btnSettings.btnSettingsParams.width / 2
          + START_SCENE.btnSettings.halfGap * 3,
        y: START_SCENE.btnSettings.y,
      },
      START_SCENE.btnSettings.btnSettingsParams,
    );

    [
      this.btnStartSingleGame,
      this.btnStartOnlineGame,
      ...this.btnLevels.getChildren(),
      ...this.btnLandscape.getChildren(),
      ...this.btnWinners.getChildren(),
      ...this.btnSound.getChildren(),
    ].forEach((obj) => {
      this.startSceneBtns.add(obj, true);
    });

    this.add.existing(this.startSceneBtns);
  }
}
