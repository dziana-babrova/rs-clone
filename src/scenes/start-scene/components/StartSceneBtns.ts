import START_SCENE from 'const/StartSceneConst';
import Phaser from 'phaser';
import IconButton from './IconButton';
import TextButton from './TextButton';

export default class StartSceneBtns extends Phaser.GameObjects.Group {
  btnStartSingleGame!: TextButton;

  btnStartOnlineGame!: TextButton;

  btnLevels!: IconButton;

  btnLandscape!: IconButton;

  btnWinners!: IconButton;

  btnSound!: IconButton;

  constructor(scene: Phaser.Scene) {
    super(scene);

    const { centerX } = scene.cameras.main;

    this.btnStartSingleGame = new TextButton(
      this.scene,
      {
        x: centerX - START_SCENE.btnStartSingleGame.moveX,
        y: START_SCENE.btnStartSingleGame.y,
      },
      START_SCENE.btnStartSingleGame,
    );

    this.btnStartOnlineGame = new TextButton(
      this.scene,
      {
        x: centerX + START_SCENE.btnStartOnlineGame.moveX,
        y: START_SCENE.btnStartOnlineGame.y,
      },
      START_SCENE.btnStartOnlineGame,
    );

    this.btnLevels = new IconButton(
      this.scene,
      START_SCENE.btnSettings.type.levels,
      {
        x: centerX
          - START_SCENE.btnSettings.btnSettingsParams.width
          - START_SCENE.btnSettings.btnSettingsParams.width / 2
          - START_SCENE.btnSettings.halfGap * 3,
        y: START_SCENE.btnSettings.y,
      },
      START_SCENE.btnSettings.btnSettingsParams,
    );

    this.btnLandscape = new IconButton(
      this.scene,
      START_SCENE.btnSettings.type.landscape,
      {
        x: centerX
          - START_SCENE.btnSettings.btnSettingsParams.width / 2
          - START_SCENE.btnSettings.halfGap,
        y: START_SCENE.btnSettings.y,
      },
      START_SCENE.btnSettings.btnSettingsParams,
    );

    this.btnWinners = new IconButton(
      this.scene,
      START_SCENE.btnSettings.type.winners,
      {
        x: centerX
          + START_SCENE.btnSettings.btnSettingsParams.width / 2
          + START_SCENE.btnSettings.halfGap,
        y: START_SCENE.btnSettings.y,
      },
      START_SCENE.btnSettings.btnSettingsParams,
    );

    this.btnSound = new IconButton(
      this.scene,
      'sound-off',
      {
        x: centerX
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
      this.add(obj, true);
    });

    this.scene.add.existing(this);
  }

  public show(): Promise<void> {
    return new Promise((animationResolve) => {
      this.scene.tweens.add({
        targets: this.getChildren(),
        ease: 'Back', // 'Linear', 'Cubic', 'Elastic', 'Bounce', 'Back'
        x: `-=${START_SCENE.btnStartOnlineGame.moveX}`,
        duration: 1000,
        delay: 100,
        onComplete: animationResolve,
      });
    });
  }

  public hide(): Promise<void> {
    return new Promise((animationResolve) => {
      this.scene.tweens.add({
        targets: this.getChildren(),
        ease: 'Back', // 'Linear', 'Cubic', 'Elastic', 'Bounce', 'Back'
        x: `+=${START_SCENE.btnStartOnlineGame.moveX}`,
        duration: 1000,
        delay: 100,
        onComplete: animationResolve,
      });
    });
  }

  public showBtnStartSingleGame(): Promise<void> {
    return new Promise((animationResolve) => {
      this.scene.tweens.add({
        targets: this.btnStartSingleGame,
        ease: 'Back', // 'Linear', 'Cubic', 'Elastic', 'Bounce', 'Back'
        x: `+=${START_SCENE.btnStartOnlineGame.moveX}`,
        duration: 1000,
        delay: 100,
        onComplete: animationResolve,
      });
    });
  }

  public showBtnStartOnlineGame(): Promise<void> {
    return new Promise((animationResolve) => {
      this.scene.tweens.add({
        targets: this.btnStartOnlineGame,
        ease: 'Back', // 'Linear', 'Cubic', 'Elastic', 'Bounce', 'Back'
        x: `-=${START_SCENE.btnStartOnlineGame.moveX}`,
        duration: 1000,
        delay: 100,
        onComplete: animationResolve,
      });
    });
  }

  public showBtnSettings(): Promise<void> {
    return new Promise((animationResolve) => {
      this.scene.tweens.add({
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
}
