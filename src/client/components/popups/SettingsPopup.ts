import Phaser from 'phaser';
import PopupCanvasGroup from 'client/components/popups/PopupCanvas';
import { SizeWithShift } from 'common/types/types';

export default class SettingsPopup extends PopupCanvasGroup {
  onClosePopup!: () => void;

  constructor(scene: Phaser.Scene, title: string, size: SizeWithShift) {
    super(scene, title, size, true);
    scene.add.existing(this);
    this.setDepth(1000);
    this.btnClose.on('pointerup', this.closePopup.bind(this));
  }

  public async closePopup(): Promise<void> {
    await this.hide();
    this.onClosePopup();
    this.destroy();
  }

  public async showPopup(): Promise<void> {
    await this.show();
  }
}
