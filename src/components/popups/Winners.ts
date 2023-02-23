import POPUP from 'const/components/PopupConst';
import LANGUAGE from 'const/Language';
import { Scene } from 'phaser';
import store from 'state/store';
import SettingsPopup from './SettingsPopup';

export default class Winners extends SettingsPopup {
  constructor(scene: Scene) {
    super(scene, LANGUAGE.startScene.winners[store.getState().app.lang], POPUP.canvas.winners);
    this.create();
  }

  public create(): void {
    this.showPopup();
  }
}
