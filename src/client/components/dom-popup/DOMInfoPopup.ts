import { hotkeys } from 'client/const/AppConstants';
import LANGUAGE from 'client/const/Language';
import store from 'client/state/store';
import ElementsFactory from 'client/utils/ElementGenerator';
import { HotkeysKeys } from 'common/types/enums';
import { IDeveloper, Link } from 'common/types/types';
import DOMPopup from './DOMPopup';

export default class DOMInfoPopup extends DOMPopup {
  protected createTitle(title: string): HTMLElement {
    return ElementsFactory.createBaseElementWithText('h2', 'popup__title', title);
  }

  protected createAbout(arr: string[]): HTMLElement {
    const container = ElementsFactory.createBaseElement('section', 'popup__about about');

    const items = arr.map((item) => this.createAboutItem(item));

    container.append(...items);
    return container;
  }

  protected createAboutItem(item: string): HTMLElement {
    return ElementsFactory.createBaseElementWithText(
      'p',
      'about__text',
      item,
    );
  }

  protected createHotkeys(arr: HotkeysKeys[]): HTMLElement {
    const container = ElementsFactory.createBaseElement('section', 'popup__hotkeys hotkeys');

    const title = ElementsFactory.createBaseElementWithText(
      'h3',
      'popup__subtitle hotkeys__title',
      'Hotkeys',
    );

    const list = ElementsFactory.createBaseElement('ul', 'hotkeys__list');
    const items = arr.map((item) => this.createHotkeyRow(item));

    list.append(...items);
    container.append(title, list);
    return container;
  }

  protected createHotkeyRow(item: HotkeysKeys): HTMLElement {
    const li = ElementsFactory.createBaseElement(
      'li',
      'hotkeys__item',
    );

    const key = ElementsFactory.createBaseElementWithText(
      'span',
      'hotkeys__key',
      hotkeys[item],
    );

    const label = ElementsFactory.createBaseElementWithText(
      'span',
      'hotkeys__label',
      `- ${LANGUAGE.popup.info.hotkeys[item][store.getState().app.lang]}`,
    );

    li.append(key, label);

    return li;
  }

  protected createContacts(arr: IDeveloper[]): HTMLElement {
    const container = ElementsFactory.createBaseElement('section', 'popup__contacts contacts');

    const title = ElementsFactory.createBaseElementWithText(
      'h3',
      'popup__subtitle contacts__title',
      'Developers',
    );

    const list = ElementsFactory.createBaseElement('ul', 'contacts__list');
    const items = arr.map((item) => this.createContactsRow(item));

    list.append(...items);
    container.append(title, list);
    return container;
  }

  protected createContactsRow(item: IDeveloper): HTMLElement {
    const li = ElementsFactory.createBaseElement(
      'li',
      'contacts__person',
    );

    const name = ElementsFactory.createBaseElementWithText(
      'span',
      'contacts__text',
      item.name,
    );

    const link = ElementsFactory.createAnchorElement(
      'contacts__link',
      item.username,
      item.link,
    );

    li.append(name, link);

    return li;
  }

  protected createLink(item: Link, className: string): HTMLAnchorElement {
    const link = ElementsFactory.createAnchorElement(
      className,
      ('src' in item && item.src) ? '' : item.text,
      item.link,
    );

    if ('src' in item && item.src) {
      const img = ElementsFactory.createImageElement(
        'popup__logo',
        item.src,
        item.text,
      );

      link.append(img);
    }
    return link;
  }
}
