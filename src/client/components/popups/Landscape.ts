import POPUP from 'client/const/components/PopupConst';
import LANGUAGE from 'client/const/Language';
import { Scene } from 'phaser';
import store from 'client/state/store';
import SettingsPopup from './SettingsPopup';

export default class Landscape extends SettingsPopup {
  constructor(scene: Scene) {
    super(
      scene,
      LANGUAGE.startScene.landscape[store.getState().app.lang],
      POPUP.canvas.landscape,
    );
    this.create();
  }

  public create(): void {
    this.showPopup();
  }
}
