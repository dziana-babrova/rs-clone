export default class ElementsFactory {
  public static createBaseElement(elementType: string, className: string): HTMLElement {
    const element = document.createElement(elementType);
    element.className = className;
    return element;
  }

  public static createBaseElementWithText(
    elementType: string,
    className: string,
    text: string,
  ): HTMLElement {
    const element = document.createElement(elementType);
    element.className = className;
    element.textContent = text;
    return element;
  }

  public static createDivElement(className: string): HTMLDivElement {
    const element = document.createElement('div');
    element.className = className;
    return element;
  }

  public static createButton(className: string, text: string): HTMLButtonElement {
    const element = document.createElement('button');
    element.className = className;
    element.textContent = text;
    return element;
  }

  public static createAnchor(className: string, text: string, link: string): HTMLAnchorElement {
    const element = document.createElement('a');
    element.className = className;
    element.href = link;
    element.textContent = text;
    return element;
  }

  public static createFormElement(className: string): HTMLFormElement {
    const element = document.createElement('form');
    element.className = className;
    return element;
  }

  public static createInputElement(
    className: string,
    type: string,
    id: string,
    placeholder: string,
  ): HTMLInputElement {
    const element = document.createElement('input');
    element.type = type;
    element.name = id;
    element.id = id;
    element.placeholder = placeholder;
    element.className = className;
    return element;
  }

  public static createOutputElement(
    className: string,
    id: string,
    text: string,
  ): HTMLOutputElement {
    const element = document.createElement('output');
    element.name = id;
    element.id = id;
    element.className = className;
    element.textContent = text;
    return element;
  }

  public static createLabelElement(
    className: string,
    forId: string,
    text: string,
  ): HTMLLabelElement {
    const element = document.createElement('label');
    element.className = className;
    element.htmlFor = forId;
    element.textContent = text;
    return element;
  }
}
