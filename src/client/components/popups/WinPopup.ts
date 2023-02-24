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

  constructor(scene: Scene, win: number, restart: SwitchLevel, currentScene: string) {
    super(
      scene,
      LANGUAGE.popup.congrats[store.getState().app.lang],
      POPUP.canvas.switchLevel,
      false,
    );
    this.currentScene = currentScene;
    console.log(this.currentScene);
    this.setDepth(400);
    this.addText(win);
    this.addButtons(restart);
  }

  public addText(win: number) {
    const text = this.scene.add
      .text(
        this.scene.scale.width / 2,
        this.scene.scale.height / 3,
        `${LANGUAGE.popup.multiplayWinMessage[store.getState().app.lang]} ${win}`,
        {
          ...POPUP.textBold,
        },
      )
      .setOrigin(0.5);
    this.add(text);
  }

  public addButtons(restart: SwitchLevel) {
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
      true,
    );
    this.backButton.setDepth(500);
    this.restartButton.setDepth(500);
  }
}
