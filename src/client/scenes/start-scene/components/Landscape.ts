import LANGUAGE, { Language } from 'client/const/Language';
import { Scene } from 'phaser';
import store from 'client/state/store';
import SettingsScreen from './SettingsScreen';

export default class Landscape extends SettingsScreen {
  constructor(scene: Scene) {
    super(scene, LANGUAGE.startScene.landscape[store.getState().app.lang as Language]);
  }

  public updateText(lang: Language): void {
    this.title.setText(LANGUAGE.startScene.landscape[lang]);
  }
}
