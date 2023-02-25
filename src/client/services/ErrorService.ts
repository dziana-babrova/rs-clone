import ErrorPopup from 'client/components/popups/ErrorPopup';
import { Scene } from 'phaser';

export default class ErrorService {
  private static scene: Scene | null;

  static setScene(scene: Scene) {
    this.scene = scene;
  }

  static createErrorPopup(): ErrorPopup | null {
    if (this.scene) {
      const errorPopup = new ErrorPopup(this.scene);
      errorPopup.showPopup();
      return errorPopup;
    }
    return null;
  }
}
