import Colors from 'const/Colors';
import SceneKeys from 'const/SceneKeys';
import START_SCENE from 'const/StartSceneConst';
import IconButton from './components/IconButton';
import LogoGroup from './components/LogoGroup';
import TextButton from './components/TextButton';

export default class StartScene extends Phaser.Scene {
  centerX!: number;

  logoGroup!: LogoGroup;

  btnStartSingleGame!: TextButton;

  btnStartOnlineGame!: TextButton;

  btnSignIn!: TextButton;

  btnLevels!: IconButton;

  btnLandscape!: IconButton;

  btnWinners!: IconButton;

  btnSound!: IconButton;

  constructor() {
    super(SceneKeys.Start);
  }

  public init(): void {
    this.cameras.main.setBackgroundColor(Colors.StartSceneBG);
  }

  public preload(): void {

  }

  public async create(): Promise<void> {
    this.centerX = this.cameras.main.centerX;

    this.logoGroup = new LogoGroup(this);

    this.createButtons();

    await Promise.all([
      this.logoGroup.move(),
      this.moveBtnStartSingleGame(),
      this.moveBtnStartOnlineGame(),
      this.showBtnSignIn(),
      this.showBtnSettings(),
    ]);

    this.initEvents();
  }

  initEvents() {
    this.btnStartSingleGame.on('pointerdown', this.startSingleGame.bind(this));
    this.btnStartOnlineGame.on('pointerdown', this.startOnlineGame.bind(this));
  }

  moveBtnStartSingleGame() {
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

  moveBtnStartOnlineGame() {
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

  showBtnSignIn() {
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

  showBtnSettings() {
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

  startSingleGame() {
  }

  startOnlineGame() {

  }

  createButtons() {
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
      START_SCENE.btnSettings.type.sound,
      {
        x: this.centerX
          + START_SCENE.btnSettings.btnSettingsParams.width
          + START_SCENE.btnSettings.btnSettingsParams.width / 2
          + START_SCENE.btnSettings.halfGap * 3,
        y: START_SCENE.btnSettings.y,
      },
      START_SCENE.btnSettings.btnSettingsParams,
    );
  }
}
