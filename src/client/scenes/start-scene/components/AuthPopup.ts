import LANGUAGE, { Language } from 'client/const/Language';
import Phaser from 'phaser';
import MapService from 'client/services/MapService';
import { axiosCreateMaps, axiosGetMaps } from 'client/state/features/AppSlice';
import { axiosSignIn, axiosSignUp } from 'client/state/features/UserSlice';
import store from 'client/state/store';
import { AuthFormInputsKeys, FormType, Move } from 'common/types/enums';
import { AuthFormInput, ClientValidationError, ValidationErrorType } from 'common/types/types';
import ElementsFactory from 'client/utils/ElementGenerator';
import { START_SCENE } from 'client/const/scenes/StartSceneConst';

export default class AuthPopup extends Phaser.GameObjects.DOMElement {
  form!: HTMLFormElement;

  usernameLabel!: HTMLLabelElement;

  btnClose!: HTMLButtonElement;

  btnSubmit!: HTMLButtonElement;

  btnChangeForm!: HTMLButtonElement;

  message!: HTMLElement;

  formType: FormType = FormType.SignIn;

  onClosePopup!: (isUbdateAuthBtnText?: boolean) => void;

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
    this.formType = FormType.SignIn;
    this.node.innerHTML = '';
    const popup = ElementsFactory.createDivElement('popup');

    this.form = ElementsFactory.createFormElement('popup__form form');

    const inputElems = START_SCENE.formInputs.auth.map((item) => this.createInputElem(item));

    this.btnSubmit = ElementsFactory.createButton(
      'btn form__submit',
      LANGUAGE.authPopup[this.formType].submitBtn[store.getState().app.lang as Language],
    );
    this.btnSubmit.type = 'submit';

    this.btnClose = ElementsFactory.createButton(
      'btn popup__close',
      '',
    );

    const messageWrapper = ElementsFactory.createDivElement('popup__message-wrapper');

    this.message = ElementsFactory.createBaseElementWithText(
      'h',
      'popup__message',
      LANGUAGE.authPopup[this.formType].message[store.getState().app.lang as Language],
    );

    this.btnChangeForm = ElementsFactory.createButton(
      'btn popup__change',
      LANGUAGE
        .authPopup[this.formType === FormType.SignIn ? FormType.SignUp : FormType.SignUp]
        .submitBtn[store.getState().app.lang as Language],
    );

    this.btnClose.innerHTML = `
      <svg width="32" height="32" viewbox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M25.3337 8.54667L23.4537 6.66667L16.0003 14.12L8.54699 6.66667L6.66699 8.54667L14.1203 16L6.66699 23.4533L8.54699 25.3333L16.0003 17.88L23.4537 25.3333L25.3337 23.4533L17.8803 16L25.3337 8.54667Z" />
      </svg>
    `;

    messageWrapper.append(this.message, this.btnChangeForm);
    this.form.append(...inputElems, this.btnSubmit);
    popup.append(this.form, messageWrapper, this.btnClose);

    this.form[AuthFormInputsKeys.Email].autocomplete = 'username';
    this.form[AuthFormInputsKeys.Password].autocomplete = 'current-password';
    this.usernameLabel.style.display = 'none';

    this.node.append(popup);
  }

  private createInputElem(item: AuthFormInput): HTMLLabelElement {
    const label = ElementsFactory.createLabelElement(
      'form__label',
      item.name,
      '',
    );

    const input = ElementsFactory.createInputElement(
      'form__input',
      item.type,
      item.name,
      LANGUAGE.authPopup[item.name].placeholder[store.getState().app.lang as Language],
    );

    if (item.name === AuthFormInputsKeys.Username) this.usernameLabel = label;

    const output = ElementsFactory.createOutputElement(
      'form__hint',
      `${item.name}Hint`,
      LANGUAGE.authPopup[item.name].hint[store.getState().app.lang as Language],
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

    if (target && target.closest('.popup__change')) {
      this.changeFormType();
      return;
    }

    if (target && target.closest('.form__submit')) {
      this.handleSubmitForm();
    }
  }

  private async handleSubmitForm(): Promise<void> {
    const email = this.form[AuthFormInputsKeys.Email].value;
    const password = this.form[AuthFormInputsKeys.Password].value;

    const valid = this.formType === FormType.SignIn
      ? this.checkFormValues(AuthFormInputsKeys.Email, AuthFormInputsKeys.Password)
      : this.checkFormValues(
        AuthFormInputsKeys.Email,
        AuthFormInputsKeys.Password,
        AuthFormInputsKeys.Username,
      );

    if (valid) {
      let response;
      if (this.formType === FormType.SignIn) {
        response = await store.dispatch(axiosSignIn({ email, password }));
        if (store.getState().user.isAuth) {
          const responseMaps = await store.dispatch(axiosGetMaps());
          if ('error' in responseMaps) {
            await store.dispatch(axiosCreateMaps(MapService.getDefaultMapsObject()));
          }
        }
      } else {
        const username = this.form[AuthFormInputsKeys.Username].value;
        response = await store.dispatch(axiosSignUp({ email, username, password }));
        if (store.getState().user.isAuth) {
          await store.dispatch(axiosCreateMaps(MapService.getDefaultMapsObject()));
        }
      }

      if ('error' in response) {
        const msg = response.payload?.message;
        const errors = response.payload?.errors;
        if (msg) this.handleErrors(msg, errors);
      } else {
        this.hide();
        this.onClosePopup(true);
      }
    }
  }

  private checkFormValues(...arr: AuthFormInputsKeys[]): boolean {
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
              param: AuthFormInputsKeys.Password,
              msg: 'Username length must be at least 3 characters',
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
    this.form[`${AuthFormInputsKeys.Email}Hint`].value = LANGUAGE.authPopup.errors.notFoundError[store.getState().app.lang as Language];
    this.addErrorClass(AuthFormInputsKeys.Email);
  }

  private showExistError(): void {
    this.updateHints();
    this.form[`${AuthFormInputsKeys.Email}Hint`].value = LANGUAGE.authPopup.errors.existError[store.getState().app.lang as Language];
    this.addErrorClass(AuthFormInputsKeys.Email);
  }

  private showPasswordError() {
    this.updateHints();
    this.form[`${AuthFormInputsKeys.Password}Hint`].value = LANGUAGE.authPopup.errors.passwordError[store.getState().app.lang as Language];
    this.addErrorClass(AuthFormInputsKeys.Password);
  }

  private showErrors<T extends ValidationErrorType>(errors: T[]): void {
    const lang = store.getState().app.lang as Language;
    const errorsText = LANGUAGE.authPopup.errors;

    this.updateHints();

    errors.forEach((error) => {
      const { msg, param } = error;

      let key = AuthFormInputsKeys.Username;
      if (param === 'password') key = AuthFormInputsKeys.Password;
      if (param === 'email') key = AuthFormInputsKeys.Email;

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

  private addErrorClass(key: AuthFormInputsKeys): void {
    this.form[`${key}Hint`].classList.add('form__hint_error');
    this.form[`${key}Hint`].classList.remove('form__hint_valid');
  }

  private addValidClass(key: AuthFormInputsKeys): void {
    this.form[`${key}Hint`].classList.remove('form__hint_error');
    this.form[`${key}Hint`].classList.add('form__hint_valid');
  }

  private updateHints(): void {
    [
      AuthFormInputsKeys.Email,
      AuthFormInputsKeys.Password,
      AuthFormInputsKeys.Username,
    ].forEach((key) => {
      this.form[`${key}Hint`].value = LANGUAGE.authPopup.valid[store.getState().app.lang as Language];
      this.addValidClass(key);
    });
  }

  private changeFormType(): void {
    if (this.formType === FormType.SignIn) {
      this.formType = FormType.SignUp;
      this.usernameLabel.style.display = '';
      this.form[AuthFormInputsKeys.Password].autocomplete = 'current-password';
    } else {
      this.formType = FormType.SignIn;
      this.usernameLabel.style.display = 'none';
      this.form[AuthFormInputsKeys.Password].autocomplete = 'new-password';
    }
    this.message.textContent = LANGUAGE
      .authPopup[this.formType]
      .message[store.getState().app.lang as Language];
    this.btnChangeForm.textContent = LANGUAGE
      .authPopup[this.formType === FormType.SignIn ? FormType.SignUp : FormType.SignIn]
      .submitBtn[store.getState().app.lang as Language];
    this.btnSubmit.textContent = LANGUAGE
      .authPopup[this.formType]
      .submitBtn[store.getState().app.lang as Language];
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
