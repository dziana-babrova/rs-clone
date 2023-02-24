import LANGUAGE, { Language } from 'client/const/Language';
import { TextureKeys, Move } from 'common/types/enums';
import Phaser from 'phaser';
import store from 'client/state/store';
import TweenAnimationBuilder from 'client/utils/TweenAnimationBuilder';
import { START_SCENE, START_SCENE_ANIMATION } from 'client/const/scenes/StartSceneConst';
import IconButton from './IconButton';
import TextButton from './TextButton';

export default class StartSceneBtns extends Phaser.GameObjects.Container {
  tweenAnimationBuilder: TweenAnimationBuilder;

  btnStartSingleGame!: TextButton;

  btnTwoPlayersGame!: TextButton;

  btnLevels!: IconButton;

  btnLandscape!: IconButton;

  btnWinners!: IconButton;

  btnMusic!: IconButton;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.tweenAnimationBuilder = new TweenAnimationBuilder();

    const { centerX } = scene.cameras.main;

    this.btnStartSingleGame = new TextButton(
      this.scene,
      {
        x: centerX,
        y: START_SCENE.btnStartSingleGame.y,
      },
      LANGUAGE.startScene.singleGame[store.getState().app.lang as Language],
      START_SCENE.btnBase,
    );

    this.btnStartSingleGame.setX(-scene.cameras.main.width);

    this.btnTwoPlayersGame = new TextButton(
      this.scene,
      {
        x: centerX,
        y: START_SCENE.btnStartOnlineGame.y,
      },
      LANGUAGE.startScene.twoPlayersGame[store.getState().app.lang as Language],
      START_SCENE.btnBase,
    );

    this.btnTwoPlayersGame.setX(scene.cameras.main.width);

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
      0,
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
      0,
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
      0,
    );

    this.btnMusic = new IconButton(
      this.scene,
      store.getState().app.music ? TextureKeys.MusicOn : TextureKeys.MusicOff,
      {
        x: centerX
          + START_SCENE.btnSettings.btnSettingsParams.width
          + START_SCENE.btnSettings.btnSettingsParams.width / 2
          + START_SCENE.btnSettings.halfGap * 3,
        y: START_SCENE.btnSettings.y,
      },
      START_SCENE.btnSettings.btnSettingsParams,
      0,
    );

    [
      this.btnStartSingleGame,
      this.btnTwoPlayersGame,
      ...this.btnLevels.getChildren(),
      ...this.btnLandscape.getChildren(),
      ...this.btnWinners.getChildren(),
      ...this.btnMusic.getChildren(),
    ].forEach((obj) => {
      this.add(obj);
    });

    this.scene.add.existing(this);
  }

  public show(): Promise<unknown> {
    return this.move(Move.Show);
  }

  public hide(): Promise<unknown> {
    return this.move(Move.Hide);
  }

  public async move(type: Move): Promise<unknown> {
    return this.tweenAnimationBuilder.moveX(
      this.scene,
      this,
      type === Move.Show ? 0 : this.scene.cameras.main.width,
      START_SCENE_ANIMATION.move.ease,
      START_SCENE_ANIMATION.move.duration,
    );
  }

  public showSingleGameBtn(): Promise<unknown> {
    return this.showBtn(this.btnStartSingleGame);
  }

  public showTwoPlayersGameBtn(): Promise<unknown> {
    return this.showBtn(this.btnTwoPlayersGame);
  }

  public showBtn(btn: TextButton): Promise<unknown> {
    return this.tweenAnimationBuilder.moveX(
      this.scene,
      btn,
      this.scene.cameras.main.centerX,
      START_SCENE_ANIMATION.move.ease,
      START_SCENE_ANIMATION.move.duration,
    );
  }

  public async showBtnSettings(): Promise<void> {
    await this.tweenAnimationBuilder.scaleToOrigin(
      this.scene,
      [
        ...this.btnLevels.getChildren(),
        ...this.btnLandscape.getChildren(),
        ...this.btnWinners.getChildren(),
        ...this.btnMusic.getChildren(),
      ],
      START_SCENE_ANIMATION.scaleToOrigin.ease,
      START_SCENE_ANIMATION.scaleToOrigin.duration,
    );
  }

  public updateText(lang: Language): void {
    this.btnStartSingleGame.setText(LANGUAGE.startScene.singleGame[lang]);
    this.btnTwoPlayersGame.setText(LANGUAGE.startScene.twoPlayersGame[lang]);
  }
}
