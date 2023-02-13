import LANGUAGE from 'const/Language';
import Phaser from 'phaser';
import store from 'state/store';
import { TextObjectProps } from 'types/types';

export default class ProgressText extends Phaser.GameObjects.Text {
  constructor(scene: Phaser.Scene, textObject: TextObjectProps) {
    const {
      x, y, style,
    } = textObject;
    super(scene, x, y, LANGUAGE.preloadScene.title[store.getState().app.lang], style);
    const { width, height } = scene.cameras.main;
    this.x = width / 2;
    this.y = height / 2;
    this.setOrigin(0.5, -0.5);
    scene.add.existing(this);
  }
}
