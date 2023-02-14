import LANGUAGE, { Language } from 'const/Language';
import { Scene } from 'phaser';
import store from 'state/store';
import SettingsScreen from './SettingsScreen';

export default class Landscape extends SettingsScreen {
  constructor(scene: Scene) {
    super(scene, LANGUAGE.startScene.landscape[store.getState().app.lang]);
  }

  public updateText(lang: Language): void {
    this.title.setText(LANGUAGE.startScene.landscape[lang]);
  }
}
