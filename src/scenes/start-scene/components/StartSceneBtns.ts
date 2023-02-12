import LANGUAGE, { Language } from 'const/Language';
import START_SCENE from 'const/StartSceneConst';
import TextureKeys from 'const/TextureKeys';
import Phaser from 'phaser';
import store from 'state/store';
import { Move } from 'types/types';
import IconButton from './IconButton';
import TextButton from './TextButton';

export default class StartSceneBtns extends Phaser.GameObjects.Group {
  btnStartSingleGame!: TextButton;

  btnStartOnlineGame!: TextButton;

  btnLevels!: IconButton;

  btnLandscape!: IconButton;

  btnWinners!: IconButton;

  btnMusic!: IconButton;

  constructor(scene: Phaser.Scene) {
    super(scene);

    const { centerX } = scene.cameras.main;

    this.btnStartSingleGame = new TextButton(
      this.scene,
      {
        x: centerX - START_SCENE.moveX,
        y: START_SCENE.btnStartSingleGame.y,
      },
      LANGUAGE.startScene.singleGame[store.getState().app.lang],
      START_SCENE.btnStartSingleGame,
    );

    this.btnStartOnlineGame = new TextButton(
      this.scene,
      {
        x: centerX + START_SCENE.moveX,
        y: START_SCENE.btnStartOnlineGame.y,
      },
      LANGUAGE.startScene.onlineGame[store.getState().app.lang],
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

    this.btnMusic = new IconButton(
      this.scene,
      store.getState().app.music ? TextureKeys.MusicOn : TextureKeys.MusicOn,
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
      ...this.btnMusic.getChildren(),
    ].forEach((obj) => {
      this.add(obj, true);
    });

    this.scene.add.existing(this);
  }

  public show(): Promise<void> {
    return this.move(Move.Show);
  }

  public hide(): Promise<void> {
    return this.move(Move.Hide);
  }

  private move(type: Move): Promise<void> {
    return new Promise((animationResolve) => {
      this.scene.tweens.add({
        targets: this.getChildren(),
        ease: 'Back', // 'Linear', 'Cubic', 'Elastic', 'Bounce', 'Back'
        x: `${type === Move.Show ? '-' : '+'}=${START_SCENE.moveX}`,
        duration: 1000,
        delay: 100,
        onComplete: animationResolve,
      });
    });
  }

  public showSingleGameBtn(): Promise<void> {
    return this.showBtn(this.btnStartSingleGame);
  }

  public showOnlineGameBtn(): Promise<void> {
    return this.showBtn(this.btnStartOnlineGame);
  }

  public showBtn(btn: TextButton): Promise<void> {
    return new Promise((animationResolve) => {
      this.scene.tweens.add({
        targets: btn,
        ease: 'Back', // 'Linear', 'Cubic', 'Elastic', 'Bounce', 'Back'
        x: this.scene.cameras.main.centerX,
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
          ...this.btnMusic.getChildren()],
        ease: 'Back', // 'Linear', 'Cubic', 'Elastic', 'Bounce', 'Back'
        scale: 1,
        duration: 1000,
        delay: 100,
        onComplete: animationResolve,
      });
    });
  }

  public updateText(lang: Language): void {
    this.btnStartSingleGame.setText(LANGUAGE.startScene.singleGame[lang]);
    this.btnStartOnlineGame.setText(LANGUAGE.startScene.onlineGame[lang]);
  }
}
