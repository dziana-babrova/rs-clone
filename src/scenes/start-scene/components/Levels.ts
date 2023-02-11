import START_SCENE from 'const/StartSceneConst';
import Phaser from 'phaser';
import SettingsScreen from './SettingsScreen';

export default class Levels extends SettingsScreen {
  constructor(scene: Phaser.Scene) {
    super(scene, START_SCENE.levels.text.eng);
  }
}
