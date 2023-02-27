import INFO_POPUP from 'client/const/components/InfoPopupConst';
import LANGUAGE from 'client/const/Language';
import store from 'client/state/store';
import { InfoPopupType, Language, SceneKeys } from 'common/types/enums';
import DOMInfoPopup from './DOMInfoPopup';

export default class InfoPopup extends DOMInfoPopup {
  type: InfoPopupType;

  sceneKey: SceneKeys;

  constructor(scene: Phaser.Scene, type: InfoPopupType, sceneKey: SceneKeys) {
    super(scene);
    this.type = type;
    this.sceneKey = sceneKey;
    this.renderPopup();
    this.show();
  }

  public renderPopup(): void {
    this.node.innerHTML = '';
    const popup = this.createPopup();
    popup.classList.add('popup_info');
    this.createBtnClose();

    const { lang } = store.getState().app;

    const title = this.createTitle(LANGUAGE.popup.info.type[this.type].title[lang]);
    popup.append(title);

    const aboutStringArr = LANGUAGE.popup.info.about[this.sceneKey]
      .map((item) => item[lang as Language]);

    if (aboutStringArr.length > 0) {
      const about = this.createAbout(aboutStringArr);
      popup.append(about);
    }

    const hotkeys = this.createHotkeys(INFO_POPUP.hotkeys[this.type]);
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
