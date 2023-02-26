import ErrorPopup from 'client/components/popups/ErrorPopup';
import { LocalStorageKeys } from 'client/const/AppConstants';
import { Language } from 'common/types/enums';

import { Scene } from 'phaser';
import LocalStorageService from './LocalStorageService';

export default class ErrorService {
  private static scene: Scene | null;

  static setScene(scene: Scene) {
    this.scene = scene;
  }

  static createErrorPopup(): ErrorPopup | null {
    const lang: Language = LocalStorageService.getItem(LocalStorageKeys.lang) || Language.Eng;
    if (this.scene) {
      const errorPopup = new ErrorPopup(this.scene, lang);
      errorPopup.showPopup();
      return errorPopup;
    }
    return null;
  }
}
