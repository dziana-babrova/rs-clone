import LANGUAGE, { Language } from 'const/Language';
import { Scene } from 'phaser';
import store from 'state/store';
import SettingsScreen from './SettingsScreen';

export default class Levels extends SettingsScreen {
  constructor(scene: Scene) {
    super(scene, LANGUAGE.startScene.levels[store.getState().app.lang]);
  }

  public updateText(lang: Language): void {
    this.title.setText(LANGUAGE.startScene.levels[lang]);
  }
}
