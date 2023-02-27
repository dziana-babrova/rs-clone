import ErrorPopup from 'client/components/popups/ErrorPopup';
import { LocalStorageKeys } from 'client/const/AppConstants';
import { Language } from 'common/types/enums';

import { Scene } from 'phaser';
import LocalStorageService from './LocalStorageService';

export default class ErrorService {
  static createErrorPopup(scene: Scene): ErrorPopup {
    const lang: Language = LocalStorageService.getItem(LocalStorageKeys.lang) || Language.Eng;
    const errorPopup = new ErrorPopup(scene, lang);
    errorPopup.showPopup();
    return errorPopup;
  }
}
