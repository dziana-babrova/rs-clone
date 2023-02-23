// import START_SCENE from 'const/scenes/StartSceneConst';
// import { Move } from 'types/enums';
import Phaser from 'phaser';
import PopupCanvasGroup from 'components/popups/PopupCanvas';
import { Size } from 'types/types';

export default class SettingsPopup extends PopupCanvasGroup {
  constructor(scene: Phaser.Scene, title: string, size: Size) {
    super(scene, title, size, true);
    scene.add.existing(this);
    this.btnClose.on('pointerup', this.closePopup.bind(this));
  }

  public async closePopup(): Promise<void> {
    await this.hide();
    this.destroy();
  }

  public async showPopup(): Promise<void> {
    await this.show();
  }
}
