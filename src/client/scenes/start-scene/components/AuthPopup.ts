import LANGUAGE from 'client/const/Language';
import MapService from 'client/services/MapService';
import { axiosCreateMaps, axiosGetMaps } from 'client/state/features/AppSlice';
import { axiosSignIn, axiosSignUp } from 'client/state/features/UserSlice';
import store from 'client/state/store';
import {
  AuthFormInputsKeys, FormType, Language, PopupType,
} from 'common/types/enums';
import ElementsFactory from 'client/utils/ElementGenerator';
import { START_SCENE } from 'client/const/scenes/StartSceneConst';
import DOMFormPopup from 'client/components/dom-popup/DOMFormPopup';

export default class AuthPopup extends DOMFormPopup {
  usernameLabel!: HTMLLabelElement;

  btnSubmit!: HTMLButtonElement;

  btnChangeForm!: HTMLButtonElement;

  message!: HTMLElement;

  formType: FormType = FormType.SignIn;

  onClosePopup!: (isUbdateAuthBtnText?: boolean) => void;

  onUpdateAuthBtn!: () => void;

  constructor(scene: Phaser.Scene) {
    super(scene, PopupType.Auth);
    this.renderPopup();
    this.show();
    this.onClickPopup = this.onSubmitForm.bind(this);
  }

  public renderPopup(): void {
    this.formType = FormType.SignIn;
    const popup = this.createPopup();
    this.createForm();
    this.createBtnClose();

    const inputElems = START_SCENE.formInputs.auth.map((item) => {
      const inputElem = this.createInputElem(item);
      if (item.name === AuthFormInputsKeys.Nickname) this.usernameLabel = inputElem;
      return inputElem;
    });

    this.btnSubmit = ElementsFactory.createButtonElement(
      'btn btn__submit popup__submit',
      LANGUAGE.popup.auth[this.formType].submitBtn[store.getState().app.lang as Language],
    );
    this.btnSubmit.type = 'submit';

    this.btnClose = ElementsFactory.createButtonElement(
      'btn popup__close',
      '',
    );

    const messageWrapper = ElementsFactory.createDivElement('popup__message-wrapper');

    this.message = ElementsFactory.createBaseElementWithText(
      'h',
      'popup__message',
      LANGUAGE.popup.auth[this.formType].message[store.getState().app.lang as Language],
    );

    this.btnChangeForm = ElementsFactory.createButtonElement(
      'btn popup__change',
      LANGUAGE.popup
        .auth[this.formType === FormType.SignIn ? FormType.SignUp : FormType.SignUp]
        .submitBtn[store.getState().app.lang as Language],
    );

    messageWrapper.append(this.message, this.btnChangeForm);
    this.form.append(...inputElems, this.btnSubmit);
    popup.append(this.form, messageWrapper, this.btnClose);

    this.form[AuthFormInputsKeys.Email].autocomplete = 'username';
    this.form[AuthFormInputsKeys.Nickname].autocomplete = 'nickname';
    this.form[AuthFormInputsKeys.Password].autocomplete = 'current-password';
    this.usernameLabel.style.display = 'none';

    this.node.append(popup);
  }

  private onSubmitForm(target: HTMLElement): void {
    if (target && target.closest('.popup__change')) {
      this.changeFormType();
      return;
    }

    if (target && target.closest('.btn__submit')) {
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
        AuthFormInputsKeys.Nickname,
      );

    if (valid) {
      switch (this.formType) {
        case FormType.SignIn: {
          this.domPopup?.classList.add('disable');
          this.loader.showLoader();
          const response = await store.dispatch(axiosSignIn({ email, password }));
          this.loader.hideLoader();
          this.domPopup?.classList.remove('disable');
          if ('error' in response) {
            const msg = response.payload?.message;
            const errors = response.payload?.errors;
            if (msg) this.handleErrors(msg, errors);
          } else {
            this.onUpdateAuthBtn();
            this.closePopup();
          }

          if (store.getState().user.isAuth) {
            const responseMaps = await store.dispatch(axiosGetMaps());
            if ('error' in responseMaps) {
              await store.dispatch(axiosCreateMaps(MapService.getDefaultMapsObject()));
            }
          }
          break;
        }
        case FormType.SignUp: {
          const username = this.form[AuthFormInputsKeys.Nickname].value;
          this.domPopup?.classList.add('disable');
          this.loader.showLoader();
          const response = await store.dispatch(axiosSignUp({ email, username, password }));
          this.loader.hideLoader();
          this.domPopup?.classList.remove('disable');
          if (store.getState().user.isAuth) {
            await store.dispatch(axiosCreateMaps(MapService.getDefaultMapsObject()));
          }
          if ('error' in response) {
            const msg = response.payload?.message;
            const errors = response.payload?.errors;
            if (msg) this.handleErrors(msg, errors);
          } else {
            this.onUpdateAuthBtn();
            this.closePopup();
          }
          break;
        }
        default:
      }
    }
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
    this.message.textContent = LANGUAGE.popup
      .auth[this.formType]
      .message[store.getState().app.lang as Language];
    this.btnChangeForm.textContent = LANGUAGE.popup
      .auth[this.formType === FormType.SignIn ? FormType.SignUp : FormType.SignIn]
      .submitBtn[store.getState().app.lang as Language];
    this.btnSubmit.textContent = LANGUAGE.popup
      .auth[this.formType]
      .submitBtn[store.getState().app.lang as Language];
  }
}
