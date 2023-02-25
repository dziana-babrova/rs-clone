import Phaser from 'phaser';
import PopupCanvasGroup from 'client/components/popups/PopupCanvas';
import POPUP from 'client/const/components/PopupConst';
import LANGUAGE from 'client/const/Language';
import store from 'client/state/store';
import ERROR_POPUP from 'client/const/components/ErrorPopupConst';

export default class ErrorPopup extends PopupCanvasGroup {
  onClosePopup!: () => void;

  constructor(scene: Phaser.Scene) {
    super(
      scene,
      LANGUAGE.popup.serverError.title[store.getState().app.lang],
      POPUP.canvas.error,
      false,
    );

    const text = this.scene.add.text(
      this.scene.cameras.main.centerX,
      this.scene.cameras.main.centerY + ERROR_POPUP.margin,
      LANGUAGE.popup.serverError.text[store.getState().app.lang],
      ERROR_POPUP.text.style,
    ).setOrigin(0.5, 0.5);

    this.add(text);
    scene.add.existing(this);
    this.setDepth(1100);
  }

  public async closePopup(): Promise<void> {
    await this.hide();
    this.onClosePopup();
    this.destroy();
  }

  public async showPopup(): Promise<void> {
    await this.show();
    setTimeout(() => {
      this.closePopup();
    }, 3000);
  }
}
