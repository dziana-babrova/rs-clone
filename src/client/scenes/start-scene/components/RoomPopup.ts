import LANGUAGE from 'const/Language';
import { START_SCENE } from 'const/scenes/StartSceneConst';
import Phaser from 'phaser';
import store from 'state/store';
import { RoomFormInputsKeys, Move, RoomPopupFormBtns } from 'types/enums';
import { ClientValidationError, RoomFormInput, ValidationErrorType } from 'types/types';
import ElementsFactory from 'utils/ElementGenerator';

export default class RoomPopup extends Phaser.GameObjects.DOMElement {
  form!: HTMLFormElement;

  roomLabel!: HTMLLabelElement;

  btnClose!: HTMLButtonElement;

  btnCreateRoom!: HTMLButtonElement;

  btnGetInRoom!: HTMLButtonElement;

  message!: HTMLElement;

  onClosePopup!: () => void;

  onStartOnlineGame!: () => void;

  constructor(scene: Phaser.Scene) {
    super(
      scene,
      0,
      -scene.cameras.main.height,
      'div',
    );
    this.setOrigin(0.5, 0.5);
    this.node.className = 'overlay';

    this.renderPopup();

    scene.add.existing(this);

    this.initEvents();
  }

  public renderPopup(): void {
    this.node.innerHTML = '';
    const popup = ElementsFactory.createDivElement('popup');

    this.form = ElementsFactory.createFormElement('popup__form form');

    const inputElems = START_SCENE.formInputs.room.map((item) => this.createInputElem(item));

    this.btnCreateRoom = ElementsFactory.createButton(
      'btn form__submit form__create',
      LANGUAGE.roomPopup.createRoom[store.getState().app.lang],
    );
    this.btnCreateRoom.type = 'submit';

    this.btnClose = ElementsFactory.createButton(
      'btn popup__close',
      '',
    );

    this.btnGetInRoom = ElementsFactory.createButton(
      'btn form__submit form__getin',
      LANGUAGE.roomPopup.getInRoom[store.getState().app.lang],
    );

    const messageWrapper = ElementsFactory.createDivElement('popup__message-wrapper');

    this.message = ElementsFactory.createBaseElementWithText(
      'h',
      'popup__message popup__message_room',
      LANGUAGE.roomPopup.message[store.getState().app.lang],
    );

    this.btnClose.innerHTML = `
      <svg width="32" height="32" viewbox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M25.3337 8.54667L23.4537 6.66667L16.0003 14.12L8.54699 6.66667L6.66699 8.54667L14.1203 16L6.66699 23.4533L8.54699 25.3333L16.0003 17.88L23.4537 25.3333L25.3337 23.4533L17.8803 16L25.3337 8.54667Z" />
      </svg>
    `;

    messageWrapper.append(this.message);
    this.form.append(...inputElems, this.btnCreateRoom, this.btnGetInRoom);
    popup.append(this.form, messageWrapper, this.btnClose);

    this.node.append(popup);
  }

  private createInputElem(item: RoomFormInput): HTMLLabelElement {
    const label = ElementsFactory.createLabelElement(
      'form__label',
      item.name,
      '',
    );

    const input = ElementsFactory.createInputElement(
      'form__input form__input_room',
      item.type,
      item.name,
      LANGUAGE.roomPopup[item.name].placeholder[store.getState().app.lang],
    );

    const output = ElementsFactory.createOutputElement(
      'form__hint',
      `${item.name}Hint`,
      LANGUAGE.roomPopup[item.name].hint[store.getState().app.lang],
    );

    label.append(input, output);
    return label;
  }

  private initEvents(): void {
    this.addListener('click');
    this.on('click', this.handleClick);
  }

  private handleClick(e: Event): void {
    e.preventDefault();
    const target = e.target as HTMLElement;

    if (target === this.node || target.closest('.popup__close')) {
      this.hide();
      this.onClosePopup();
      return;
    }

    if (target && target.closest('.form__create')) {
      this.handleSubmitForm(RoomPopupFormBtns.createRoom);
    }

    if (target && target.closest('.form__getin')) {
      this.handleSubmitForm(RoomPopupFormBtns.getInRoom);
    }
  }

  private async handleSubmitForm(btnType: RoomPopupFormBtns): Promise<void> {
    console.log('btnType: ', btnType);
    const { value } = this.form[RoomFormInputsKeys.Room];
    const valid = this.checkFormValues(RoomFormInputsKeys.Room);

    if (valid) {
      console.log(value);
      // запросить данные и при отсутствии ошибок начать онлайн игру
      this.onStartOnlineGame();
      // let response;
      // if (this.formType === FormType.SignIn) {
      //   response = await store.dispatch(axiosSignIn({ email, password }));
      //   if (store.getState().user.isAuth) {
      //     const responseMaps = await store.dispatch(axiosGetMaps());
      //     if ('error' in responseMaps) {
      //       await store.dispatch(axiosCreateMaps(MapService.getDefaultMapsObject()));
      //     }
      //   }
      // } else {
      //   const username = this.form[RoomFormInputsKeys.Username].value;
      //   response = await store.dispatch(axiosSignUp({ email, username, password }));
      //   if (store.getState().user.isAuth) {
      //     await store.dispatch(axiosCreateMaps(MapService.getDefaultMapsObject()));
      //   }
      // }

      // if ('error' in response) {
      //   const msg = response.payload?.message;
      //   const errors = response.payload?.errors;
      //   if (msg) this.handleErrors(msg, errors);
      // } else {
      //   this.hide();
      //   this.onClosePopup(true);
      // }
    }
  }

  private checkFormValues(...arr: RoomFormInputsKeys[]): boolean {
    const errors: ClientValidationError[] = [];
    const validArr = arr.map((key) => {
      const value = this.form[key].value.trim();

      if (value.length === 0) {
        errors.push({
          param: key,
          msg: 'should not be empty',
        });
        return false;
      }
      switch (key) {
        case RoomFormInputsKeys.Room: {
          if (value.length < 6) {
            errors.push({
              param: RoomFormInputsKeys.Room,
              msg: 'Password length must be at least 6 characters',
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

  private handleErrors<T extends ValidationErrorType>(msg: string, errors: T[] | undefined): void {
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
    this.form[`${RoomFormInputsKeys.Room}Hint`].value = LANGUAGE.authPopup.errors.notFoundError[store.getState().app.lang];
    this.addErrorClass(RoomFormInputsKeys.Room);
  }

  private showExistError(): void {
    this.updateHints();
    this.form[`${RoomFormInputsKeys.Room}Hint`].value = LANGUAGE.authPopup.errors.existError[store.getState().app.lang];
    this.addErrorClass(RoomFormInputsKeys.Room);
  }

  private showPasswordError() {
    this.updateHints();
    this.form[`${RoomFormInputsKeys.Room}Hint`].value = LANGUAGE.authPopup.errors.passwordError[store.getState().app.lang];
    this.addErrorClass(RoomFormInputsKeys.Room);
  }

  private showErrors<T extends ValidationErrorType>(errors: T[]): void {
    const { lang } = store.getState().app;
    const errorsText = LANGUAGE.roomPopup.errors;

    this.updateHints();

    errors.forEach((error) => {
      const { msg, param } = error;
      console.log('param: ', param);

      const key = RoomFormInputsKeys.Room;

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

  private addErrorClass(key: RoomFormInputsKeys): void {
    this.form[`${key}Hint`].classList.add('form__hint_error');
    this.form[`${key}Hint`].classList.remove('form__hint_valid');
  }

  private addValidClass(key: RoomFormInputsKeys): void {
    this.form[`${key}Hint`].classList.remove('form__hint_error');
    this.form[`${key}Hint`].classList.add('form__hint_valid');
  }

  private updateHints(): void {
    [
      RoomFormInputsKeys.Room,
    ].forEach((key) => {
      this.form[`${key}Hint`].value = LANGUAGE.roomPopup.valid[store.getState().app.lang];
      this.addValidClass(key);
    });
  }

  public show(): Promise<void> {
    return this.move(Move.Show);
  }

  public hide(): Promise<void> {
    return this.move(Move.Hide);
  }

  private move(type: Move): Promise<void> {
    return new Promise((animationResolve) => {
      this.scene.tweens.add({
        targets: this,
        ease: 'Back', // 'Linear', 'Cubic', 'Elastic', 'Bounce', 'Back'
        y: `${type === Move.Show ? '+' : '-'}=${this.scene.cameras.main.height}`,
        duration: 1000,
        onComplete: animationResolve,
      });
    });
  }
}
