/* eslint-disable no-fallthrough */

import { ButtonsFrames, ColorsNumber, SceneKeys } from 'common/types/enums';
import { GAME_SCENE } from 'client/const/scenes/GameSceneConsts';
import PopupCanvasGroup from 'client/components/popups/PopupCanvas';
import POPUP from 'client/const/components/PopupConst';
import LANGUAGE from 'client/const/Language';
import store from 'client/state/store';
import StarTemplateGroup from './StarTemplateGroup';
import CollectedStarsGroup from './CollectedStarsGroup';
import Button from '../../../../components/popups/Button';

export default class NextLevelPopup extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);

    scene.add.existing(this);
  }

  public async create(
    stars: number,
    nextLevelHandler: (scene: string, nextLevel?: boolean) => void,
  ): Promise<void> {
    const canvas = new PopupCanvasGroup(
      this.scene,
      LANGUAGE.gameScene.win[store.getState().app.lang],
      POPUP.canvas.switchLevel,
      false,
    );
    await canvas.show();
    const starsTemplate = new StarTemplateGroup(
      this.scene,
      ColorsNumber.StarTemplate,
      GAME_SCENE.nextLevelPopup.star.alpha,
    );
    await starsTemplate.show();
    const collectedStars = new CollectedStarsGroup(
      this.scene,
      ColorsNumber.Star,
      ColorsNumber.Stroke,
      GAME_SCENE.nextLevelPopup.star.alpha,
    );
    await this.showStars(stars, collectedStars.reveal.bind(collectedStars));
    const restartButton = new Button(
      this.scene,
      -GAME_SCENE.nextLevelPopup.button.initialPaddingX,
      GAME_SCENE.nextLevelPopup.button.Y,
      ButtonsFrames.Restart,
      nextLevelHandler,
      SceneKeys.Game,
      false,
    );
    const nextButton = new Button(
      this.scene,
      this.scene.scale.width + GAME_SCENE.nextLevelPopup.button.initialPaddingX,
      GAME_SCENE.nextLevelPopup.button.Y,
      ButtonsFrames.Next,
      nextLevelHandler,
      SceneKeys.Game,
      true,
    );
    await Promise.all([
      restartButton.show(
        this.scene.scale.width / 2 - GAME_SCENE.nextLevelPopup.button.finalPaddingX,
      ),
      nextButton.show(this.scene.scale.width / 2 + GAME_SCENE.nextLevelPopup.button.finalPaddingX),
    ]);
    const pulsingStars = new CollectedStarsGroup(
      this.scene,
      ColorsNumber.Primary,
      ColorsNumber.StarPulse,
      0.1,
    );
    this.showStars(stars, pulsingStars.pulse.bind(pulsingStars));
  }

  private async showStars(
    stars: number,
    animation: (count: number) => Promise<void>,
  ): Promise<void> {
    let count = 0;
    switch (stars) {
      case 3:
        await animation(count);
        count += 1;
      case 2:
        await animation(count);
        count += 1;
      case 1:
        await animation(count);
      default:
        break;
    }
  }
}
