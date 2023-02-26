import { POPUP_ANIMATION } from 'client/const/components/PopupConst';
import LANGUAGE from 'client/const/Language';
import { START_SCENE } from 'client/const/scenes/StartSceneConst';
import store from 'client/state/store';
import ElementsFactory from 'client/utils/ElementGenerator';
import TweenAnimationBuilder from 'client/utils/TweenAnimationBuilder';
import {
  AuthFormInputsKeys, Move, PopupType, RoomFormInputsKeys,
} from 'common/types/enums';
import {
  ClientValidationError, FormInput, FormInputsKeys, ValidationErrorType,
} from 'common/types/types';
import { GameObjects } from 'phaser';

export default class DOMPopup extends GameObjects.DOMElement {
  tweenAnimationBuilder: TweenAnimationBuilder;

  form!: HTMLFormElement;

  popupType: PopupType;

  btnClose!: HTMLButtonElement;

  onClosePopup!: () => void;

  onSubmitPopup!: (target: HTMLElement) => void;

  constructor(scene: Phaser.Scene, type: PopupType) {
    super(
      scene,
      0,
      -scene.cameras.main.height,
      'div',
    );
    this.setOrigin(0.5, 0.5);
    this.node.className = 'overlay';
    this.tweenAnimationBuilder = new TweenAnimationBuilder();

    scene.add.existing(this);

    this.initEvents();

    this.popupType = type;
  }

  protected createPopup(): HTMLDivElement {
    return ElementsFactory.createDivElement('popup');
  }

  protected createForm(): void {
    this.form = ElementsFactory.createFormElement('popup__form form');
  }

  protected createBtnClose(): void {
    this.btnClose = ElementsFactory.createButton(
      'btn popup__close',
      '',
    );
  }

  protected createInputElem<T extends FormInput>(item: T): HTMLLabelElement {
    const label = ElementsFactory.createLabelElement(
      'form__label',
      item.name,
      '',
    );

    const input = ElementsFactory.createInputElement(
      'form__input',
      item.type,
      item.name,
      LANGUAGE.popup.popupInputs[item.name].placeholder[store.getState().app.lang],
    );

    const output = ElementsFactory.createOutputElement(
      'form__hint',
      `${item.name}Hint`,
      LANGUAGE.popup.popupInputs[item.name].hint[store.getState().app.lang],
    );

    label.append(input, output);
    return label;
  }

  protected initEvents(): void {
    this.addListener('click');
    this.on('click', this.handleClick);
  }

  private async handleClick(e: Event): Promise<void> {
    e.preventDefault();
    const target = e.target as HTMLElement;

    if (target.closest('.popup__close')) {
      await this.hide();
      this.setY(-this.scene.cameras.main.height);
      this.onClosePopup();
      return;
    }

    this.onSubmitPopup(target);
  }

  protected checkFormValues<T extends FormInputsKeys>(...arr: T[]): boolean {
    const errors: ClientValidationError[] = [];
    const validArr = arr.map((key) => {
      const value = this.form[key]?.value.trim();

      if (value.length === 0) {
        errors.push({
          param: key,
          msg: 'should not be empty',
        });
        return false;
      }
      switch (key) {
        case AuthFormInputsKeys.Email: {
          const regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;
          const found = value.match(regex);
          if (found === null) {
            errors.push({
              param: AuthFormInputsKeys.Email,
              msg: 'Email must match the pattern',
            });
            return false;
          }
          break;
        }
        case AuthFormInputsKeys.Password: {
          if (value.length < 6) {
            errors.push({
              param: AuthFormInputsKeys.Password,
              msg: 'Password length must be at least 6 characters',
            });
            return false;
          }
          break;
        }
        case AuthFormInputsKeys.Username: {
          if (value.length < 3) {
            errors.push({
              param: AuthFormInputsKeys.Username,
              msg: 'Username length must be at least 3 characters',
            });
            return false;
          }
          break;
        }
        case RoomFormInputsKeys.Room: {
          if (value.length < 6) {
            errors.push({
              param: RoomFormInputsKeys.Room,
              msg: 'Name length must be at least 6 characters',
            });
            return false;
          }
          break;
        }
        default:
      }
      return true;
    });

    if (errors.length !== 0) {
      this.handleErrors('Validation error', errors);
    }

    return validArr.every((item) => item);
  }

  protected handleErrors<T extends ValidationErrorType>(msg: string, errors: T[] | undefined)
    : void {
    switch (true) {
      case msg.includes('Validation error'): {
        if (errors) {
          this.showErrors(errors);
        }
        break;
      }
      case msg.includes('Wrong password'): {
        this.showPasswordError();
        break;
      }
      case msg.includes('not found'): {
        this.showNotFoundError();
        break;
      }
      case msg.includes('User with this email already exists'): {
        this.showExistError();
        break;
      }
      default:
    }
  }

  private showNotFoundError(): void {
    this.updateHints();
    console.log('notfoundHandler');
    this.form[`${AuthFormInputsKeys.Email}Hint`].value = LANGUAGE.popup.errors.notFoundError[store.getState().app.lang];
    this.addErrorClass(AuthFormInputsKeys.Email);
  }

  private showExistError(): void {
    this.updateHints();
    this.form[`${AuthFormInputsKeys.Email}Hint`].value = LANGUAGE.popup.errors.existError[store.getState().app.lang];
    this.addErrorClass(AuthFormInputsKeys.Email);
  }

  private showPasswordError(): void {
    this.updateHints();
    this.form[`${AuthFormInputsKeys.Password}Hint`].value = LANGUAGE.popup.errors.passwordError[store.getState().app.lang];
    this.addErrorClass(AuthFormInputsKeys.Password);
  }

  private showErrors<T extends ValidationErrorType>(errors: T[]): void {
    const { lang } = store.getState().app;
    const errorsText = LANGUAGE.popup.errors;

    errors.forEach((error) => {
      const { msg, param } = error;

      let key: FormInputsKeys = START_SCENE.formInputs[this.popupType][0].name;
      START_SCENE.formInputs[this.popupType]
        .forEach((input: FormInput) => {
          if (input.name === param) key = input.name;
        });

      this.updateHint(key);

      let value = '';

      switch (true) {
        case msg.includes('should not be empty'): {
          value = errorsText.emptyError[key][lang];
          break;
        }
        case msg.includes('length must be at least'): {
          value = errorsText.lengthError[key][lang];
          break;
        }
        case msg.includes('Email must match the pattern'): {
          value = errorsText.emailPattern[lang];
          break;
        }
        case msg.includes('Password should be string'): {
          value = errorsText.passwordString[lang];
          break;
        }
        default:
      }

      this.form[`${key}Hint`].value = value;
      this.addErrorClass(key);
    });
  }

  private addErrorClass<T extends FormInputsKeys>(key: T): void {
    this.form[`${key}Hint`].classList.add('form__hint_error');
    this.form[`${key}Hint`].classList.remove('form__hint_valid');
  }

  private addValidClass<T extends FormInputsKeys>(key: T): void {
    this.form[`${key}Hint`].classList.remove('form__hint_error');
    this.form[`${key}Hint`].classList.add('form__hint_valid');
  }

  private updateHint(key: FormInputsKeys): void {
    this.form[`${key}Hint`].value = LANGUAGE.popup.valid[store.getState().app.lang];
    this.addValidClass(key);
  }

  private updateHints(): void {
    START_SCENE.formInputs[this.popupType].forEach((input) => {
      this.updateHint(input.name);
    });
  }

  public show(): Promise<unknown> {
    return this.move(Move.Show);
  }

  public hide(): Promise<unknown> {
    return this.move(Move.Hide);
  }

  public move(type: Move): Promise<unknown> {
    return this.tweenAnimationBuilder.moveY(
      this.scene,
      this,
      type === Move.Show ? 0 : this.scene.cameras.main.height,
      POPUP_ANIMATION.ease,
      POPUP_ANIMATION.duration,
    );
  }
}
