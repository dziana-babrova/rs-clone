import LANGUAGE, { Language } from 'const/Language';
import { Scene } from 'phaser';
import store from 'state/store';
import SettingsScreen from './SettingsScreen';

export default class Winners extends SettingsScreen {
  constructor(scene: Scene) {
    super(scene, LANGUAGE.startScene.winners[store.getState().app.lang]);
  }

  public updateText(lang: Language): void {
    this.title.setText(LANGUAGE.startScene.winners[lang]);
  }
}
