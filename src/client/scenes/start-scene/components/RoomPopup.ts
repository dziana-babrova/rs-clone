import LANGUAGE from 'client/const/Language';
import { START_SCENE } from 'client/const/scenes/StartSceneConst';
import store from 'client/state/store';
import ElementsFactory from 'client/utils/ElementGenerator';
import { PopupType, RoomFormInputsKeys, RoomPopupFormBtns } from 'common/types/enums';
import DOMPopup from './DOMPopup';

export default class RoomPopup extends DOMPopup {
  form!: HTMLFormElement;

  roomLabel!: HTMLLabelElement;

  btnCreateRoom!: HTMLButtonElement;

  btnGetInRoom!: HTMLButtonElement;

  btnRandomRoom!: HTMLButtonElement;

  message!: HTMLElement;

  onStartOnlineGame!: () => void;

  constructor(scene: Phaser.Scene) {
    super(scene, PopupType.Room);
    this.renderPopup();
    this.onSubmitPopup = this.onSubmitForm.bind(this);
  }

  public renderPopup(): void {
    this.node.innerHTML = '';
    const popup = this.createPopup();
    this.createForm();
    this.createBtnClose();

    const inputElems = START_SCENE.formInputs.room.map((item) => this.createInputElem(item));

    this.btnCreateRoom = ElementsFactory.createButton(
      'btn popup__submit btn__create',
      LANGUAGE.popup.room.createRoom[store.getState().app.lang],
    );
    this.btnCreateRoom.type = 'submit';

    this.btnGetInRoom = ElementsFactory.createButton(
      'btn popup__submit btn__getin',
      LANGUAGE.popup.room.getInRoom[store.getState().app.lang],
    );

    this.btnRandomRoom = ElementsFactory.createButton(
      'btn popup__submit popup__submit_random btn__random',
      LANGUAGE.popup.room.randomRoom[store.getState().app.lang],
    );

    const messageWrapper = ElementsFactory.createDivElement('popup__message-wrapper');

    this.message = ElementsFactory.createBaseElementWithText(
      'h',
      'popup__message popup__message_room',
      LANGUAGE.popup.room.message[store.getState().app.lang],
    );

    messageWrapper.append(this.message);
    this.form.append(...inputElems, this.btnCreateRoom, this.btnGetInRoom);
    popup.append(this.form, messageWrapper, this.btnRandomRoom, this.btnClose);

    this.node.append(popup);
  }

  private onSubmitForm(target: HTMLElement): void {
    if (target && target.closest('.btn__create')) {
      this.handleSubmitForm(RoomPopupFormBtns.createRoom);
    }

    if (target && target.closest('.btn__getin')) {
      this.handleSubmitForm(RoomPopupFormBtns.getInRoom);
    }

    if (target && target.closest('.btn__random')) {
      this.handleRandomBtn();
    }
  }

  private handleRandomBtn() {
    this.onStartOnlineGame();
  }

  private async handleSubmitForm(btnType: RoomPopupFormBtns): Promise<void> {
    const { value } = this.form[RoomFormInputsKeys.Room];
    const valid = this.checkFormValues(RoomFormInputsKeys.Room);

    if (valid) {
      console.log(value);
      // запросить данные и при отсутствии ошибок начать онлайн игру
      // let response;
      switch (btnType) {
        case RoomPopupFormBtns.createRoom: {
          //   response = await store.dispatch(axiosSignIn({ email, password }));
          //   if (store.getState().user.isAuth) {
          //     const responseMaps = await store.dispatch(axiosGetMaps());
          //     if ('error' in responseMaps) {
          //       await store.dispatch(axiosCreateMaps(MapService.getDefaultMapsObject()));
          //     }
          //   }
          break;
        }
        case RoomPopupFormBtns.getInRoom: {
          //   const username = this.form[RoomFormInputsKeys.Username].value;
          //   response = await store.dispatch(axiosSignUp({ email, username, password }));
          //   if (store.getState().user.isAuth) {
          //     await store.dispatch(axiosCreateMaps(MapService.getDefaultMapsObject()));
          //   }
          break;
        }
        default:
      }

      // if ('error' in response) {
      //   const msg = response.payload?.message;
      //   const errors = response.payload?.errors;
      //   if (msg) this.handleErrors(msg, errors);
      // } else {
      //   this.onStartOnlineGame();
      // }
      this.onStartOnlineGame();
    }
  }
}
