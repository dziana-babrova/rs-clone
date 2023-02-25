import { Scene } from 'phaser';
import store from 'client/state/store';
import { SwitchLevel } from 'common/types/types';
import LANGUAGE from 'client/const/Language';
import { GAME_SCENE } from 'client/const/scenes/GameSceneConsts';
import { ButtonsFrames, SceneKeys } from 'common/types/enums';
import POPUP from 'client/const/components/PopupConst';
import PopupCanvasGroup from './PopupCanvas';
import Button from './Button';

export default class WinPopup extends PopupCanvasGroup {
  restartButton!: Button;

  backButton!: Button;

  currentScene: string;

  constructor(
    scene: Scene,
    score: number,
    restart: SwitchLevel,
    currentScene: string,
    text: string,
  ) {
    super(
      scene,
      LANGUAGE.winPopup.congrats[store.getState().app.lang],
      POPUP.canvas.switchLevel,
      false,
    );
    this.currentScene = currentScene;
    this.setDepth(400);
    this.addText(score, text);
    this.addButtons(restart);
  }

  public addText(score: number, text: string): void {
    let finalText = text.replace('{}', score.toString());
    if (score === 1 && store.getState().app.lang === 'eng') {
      finalText = finalText.replace(
        LANGUAGE.winPopup.starPlural.eng,
        LANGUAGE.winPopup.starSingular.eng,
      );
    }
    const textElement = this.scene.add
      .text(this.scene.scale.width / 2, this.scene.scale.height / 3, finalText, {
        ...POPUP.textBold,
      })
      .setPadding({ left: 200, right: 200 })
      .setOrigin(0.5);
    this.add(textElement);
  }

  public addButtons(restart: SwitchLevel): void {
    this.restartButton = new Button(
      this.scene,
      -GAME_SCENE.nextLevelPopup.button.initialPaddingX,
      GAME_SCENE.nextLevelPopup.button.Y,
      ButtonsFrames.Back,
      restart,
      SceneKeys.Start,
      false,
    );

    this.backButton = new Button(
      this.scene,
      this.scene.scale.width + GAME_SCENE.nextLevelPopup.button.initialPaddingX,
      GAME_SCENE.nextLevelPopup.button.Y,
      ButtonsFrames.Restart,
      restart,
      this.currentScene,
      false,
    );
    this.backButton.setDepth(500);
    this.restartButton.setDepth(500);
  }
}
