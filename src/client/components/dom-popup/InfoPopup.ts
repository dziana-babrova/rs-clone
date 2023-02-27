import INFO_POPUP from 'client/const/components/InfoPopupConst';
import LANGUAGE from 'client/const/Language';
import store from 'client/state/store';
import {
  ControlKeys, HotkeysKeys, InfoPopupType, SceneKeys,
} from 'common/types/enums';
import DOMInfoPopup from './DOMInfoPopup';

export default class InfoPopup extends DOMInfoPopup {
  type: InfoPopupType;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.type = InfoPopupType.Start;

    switch (scene.scene.key) {
      case SceneKeys.Game: {
        this.type = InfoPopupType.Game;
        break;
      }
      case SceneKeys.MultiPlayer: {
        this.type = InfoPopupType.MultiPlayer;
        break;
      }
      case SceneKeys.Online: {
        this.type = InfoPopupType.Online;
        break;
      }
      default:
    }

    this.renderPopup();
    this.show();
  }

  public renderPopup(): void {
    this.node.innerHTML = '';

    const popup = this.createPopup();
    if (this.type === InfoPopupType.Start) {
      popup.classList.add('popup_info-start');
    } else {
      popup.classList.add('popup_info-game');
    }
    popup.classList.add('popup_info');
    this.createBtnClose();

    const { lang } = store.getState().app;

    const title = this.createTitle(LANGUAGE.popup.info.type[this.type].title[lang]);
    popup.append(title);

    const aboutStringArr = LANGUAGE.popup.info.about[this.type][lang];

    if (aboutStringArr.length > 0) {
      const about = this.createAbout(aboutStringArr);
      popup.append(about);
    }

    if (this.type !== InfoPopupType.Start) {
      const contolKeys = this.createKeys<ControlKeys>(INFO_POPUP.controlKeys[this.type], false);
      popup.append(contolKeys);
    }

    const hotkeys = this.createKeys<HotkeysKeys>(INFO_POPUP.hotkeys[this.type], true);
    popup.append(hotkeys);

    if (this.type === InfoPopupType.Start) {
      const contacts = this.createContacts(INFO_POPUP.developers);
      const logoLink = this.createLink(INFO_POPUP.links.rsSchool, 'popup__logo-link');
      const textLink = this.createLink(INFO_POPUP.links.copyright, 'popup__link popup__copyright');
      popup.append(contacts, logoLink, textLink);
    }

    popup.append(this.btnClose);
    this.node.append(popup);
  }
}
