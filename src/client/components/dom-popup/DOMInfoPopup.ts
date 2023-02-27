import { hotkeys } from 'client/const/AppConstants';
import LANGUAGE from 'client/const/Language';
import store from 'client/state/store';
import ElementsFactory from 'client/utils/ElementGenerator';
import { ControlKeys, HotkeysKeys } from 'common/types/enums';
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

  protected createKeys<T extends HotkeysKeys | ControlKeys>(arr: T[], isHotkeys: boolean):
  HTMLElement {
    const className = isHotkeys ? 'popup__hotkeys hotkeys' : 'popup__controls hotkeys';
    const container = ElementsFactory.createBaseElement('section', className);

    const titleText = isHotkeys
      ? LANGUAGE.popup.info.hotkeys.title[store.getState().app.lang]
      : LANGUAGE.popup.info.controlKeys.title[store.getState().app.lang];

    const title = ElementsFactory.createBaseElementWithText(
      'h3',
      'popup__subtitle hotkeys__title',
      titleText,
    );

    const list = ElementsFactory.createBaseElement('ul', 'hotkeys__list');
    const items = arr.map((item) => this.createKeyRow(item, isHotkeys));

    list.append(...items);
    container.append(title, list);
    return container;
  }

  protected createKeyRow<T extends HotkeysKeys | ControlKeys>(item: T, isHotkeys: boolean):
  HTMLElement {
    const li = ElementsFactory.createBaseElement(
      'li',
      'hotkeys__item',
    );

    const keyText = isHotkeys
      ? hotkeys[item as HotkeysKeys]
      : this.getControlKeyText(item as ControlKeys);

    const key = ElementsFactory.createBaseElement(
      'span',
      'hotkeys__key',
    );
    key.innerHTML = keyText;

    const labelText = isHotkeys
      ? LANGUAGE.popup.info.hotkeys[item as HotkeysKeys][store.getState().app.lang]
      : LANGUAGE.popup.info.controlKeys[item as ControlKeys][store.getState().app.lang];

    const label = ElementsFactory.createBaseElementWithText(
      'span',
      'hotkeys__label',
      `- ${labelText}`,
    );

    li.append(key, label);

    return li;
  }

  private getControlKeyText(key: ControlKeys): string {
    switch (key) {
      case ControlKeys.UpDown: {
        return `<svg width="62" height="20" viewBox="0 0 62 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L5 1L25 0.999999L15 18Z" fill="black"/>
        <path d="M47 1L57 18L37 18L47 1Z" fill="black"/>
        <path d="M34.294 1L29.6065 18.4148H27L31.6875 1H34.294Z" fill="black"/>
        </svg>
        `;
        break;
      }
      case ControlKeys.LeftRight: {
        return `<svg width="62" height="20" viewBox="0 0 62 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L5 1L25 0.999999L15 18Z" fill="black"/>
        <path d="M47 1L57 18L37 18L47 1Z" fill="black"/>
        <path d="M34.294 1L29.6065 18.4148H27L31.6875 1H34.294Z" fill="black"/>
        </svg>
        `;
        break;
      }
      case ControlKeys.MultiUpLocal: {
        return `<svg width="62" height="20" viewBox="0 0 62 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M31 1L41 18L21 18L31 1Z" fill="black"/>
        </svg>
        `;
        break;
      }
      default:
    }
    return 'Space';
  }

  protected createContacts(arr: IDeveloper[]): HTMLElement {
    const container = ElementsFactory.createBaseElement('section', 'popup__contacts contacts');

    const title = ElementsFactory.createBaseElementWithText(
      'h3',
      'popup__subtitle contacts__title',
      LANGUAGE.popup.info.contacts.title[store.getState().app.lang],
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
