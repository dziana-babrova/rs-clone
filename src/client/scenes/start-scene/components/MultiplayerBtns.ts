import LANGUAGE, { Language } from 'client/const/Language';
import { START_SCENE, START_SCENE_ANIMATION } from 'client/const/scenes/StartSceneConst';
import store from 'client/state/store';
import TweenAnimationBuilder from 'client/utils/TweenAnimationBuilder';
import { Move } from 'common/types/enums';
import { GameObjects } from 'phaser';
import IconButton from './IconButton';
import TextButton from './TextButton';

export default class MultiplayerBtns extends GameObjects.Container {
  tweenAnimationBuilder: TweenAnimationBuilder;

  btnStartLocalGame!: TextButton;

  btnStartOnlineGame!: TextButton;

  btnBack!: IconButton;

  point: number;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.tweenAnimationBuilder = new TweenAnimationBuilder();
    this.point = (this.scene.cameras.main.width - START_SCENE.btnBase.width) / 2;

    const { centerX } = scene.cameras.main;

    this.btnStartLocalGame = new TextButton(
      this.scene,
      {
        x: centerX,
        y: START_SCENE.btnStartLocalGame.y,
      },
      LANGUAGE.startScene.localGame[store.getState().app.lang],
      START_SCENE.btnBase,
    );

    this.btnStartOnlineGame = new TextButton(
      this.scene,
      {
        x: centerX,
        y: START_SCENE.btnStartOnlineGame.y,
      },
      LANGUAGE.startScene.onlineGame[store.getState().app.lang],
      START_SCENE.btnBase,
    );

    this.btnBack = new IconButton(
      this.scene,
      START_SCENE.btnSettings.type.back,
      {
        x: centerX,
        y: START_SCENE.btnSettings.y,
      },
      START_SCENE.btnSettings.btnSettingsParams,
    );

    [
      this.btnStartLocalGame,
      this.btnStartOnlineGame,
      ...this.btnBack.getChildren(),
    ].forEach((obj) => {
      this.add(obj);
    });

    this.setX(-this.scene.cameras.main.width);
    this.scene.add.existing(this);
  }

  public show(): Promise<unknown> {
    return this.move(Move.Show);
  }

  public hide(): Promise<unknown> {
    return this.move(Move.Hide);
  }

  public move(type: Move): Promise<unknown> {
    return this.tweenAnimationBuilder.moveX(
      this.scene,
      this,
      type === Move.Show ? 0 : -this.scene.cameras.main.width,
      START_SCENE_ANIMATION.move.ease,
      START_SCENE_ANIMATION.move.duration,
    );
  }

  public updateText(lang: Language): void {
    this.btnStartLocalGame.setText(LANGUAGE.startScene.localGame[lang]);
    this.btnStartOnlineGame.setText(LANGUAGE.startScene.onlineGame[lang]);
  }
}
