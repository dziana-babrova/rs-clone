import LANGUAGE from 'client/const/Language';
import { START_SCENE } from 'client/const/scenes/StartSceneConst';
import SocketService from 'client/services/SocketService';
import store from 'client/state/store';
import ElementsFactory from 'client/utils/ElementGenerator';
import { PopupType, RoomFormInputsKeys, RoomPopupFormBtns } from 'common/types/enums';
import { FormInputsKeys } from 'common/types/types';
import DOMPopup from './DOMPopup';

export default class RoomPopup extends DOMPopup {
  form!: HTMLFormElement;

  roomLabel!: HTMLLabelElement;

  btnCreateRoom!: HTMLButtonElement;

  btnGetInRoom!: HTMLButtonElement;

  btnRandomRoom!: HTMLButtonElement;

  message!: HTMLElement;

  socketService!: SocketService;

  onStartOnlineGame!: () => void;

  constructor(scene: Phaser.Scene, socketService: SocketService) {
    super(scene, PopupType.Room);
    this.renderPopup();
    this.onSubmitPopup = this.onSubmitForm.bind(this);
    this.socketService = socketService;
    this.socketService.roomError(this.showRoomErrors, this);
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
    this.socketService.autoConnect();
  }

  private async handleSubmitForm(btnType: RoomPopupFormBtns): Promise<void> {
    const { value } = this.form[RoomFormInputsKeys.Room];
    const valid = this.checkFormValues(RoomFormInputsKeys.Room);

    if (valid) {
      switch (btnType) {
        case RoomPopupFormBtns.createRoom: {
          this.socketService.createRoom(value);
          break;
        }
        case RoomPopupFormBtns.getInRoom: {
          this.socketService.connectToRoom(value);
          break;
        }
        default:
      }
    }
  }

  private showRoomErrors(message: string): void {
    const key = START_SCENE.formInputs.room[0].name as FormInputsKeys;
    let value = '';
    const errors = LANGUAGE.popup.socketErrors;
    const { lang } = store.getState().app;
    switch (true) {
      case message.includes('already exists'): {
        value = errors.alreadyExists[lang];
        break;
      }
      case message.includes('not exist'): {
        value = errors.notExists[lang];
        break;
      }
      case message.includes('is full'): {
        value = errors.isFull[lang];
        break;
      }
      case message.includes('Something went wrong'): {
        value = errors.somethingWrong[lang];
        break;
      }
      default: {
        value = message;
        break;
      }
    }
    this.form[`${key}Hint`].value = value;
    this.addErrorClass(key);
  }
}
