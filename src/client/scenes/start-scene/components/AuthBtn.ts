import LANGUAGE from 'client/const/Language';
import Phaser from 'phaser';
import store from 'client/state/store';
import { START_SCENE } from 'client/const/scenes/StartSceneConst';
import { Language } from 'common/types/enums';
import TextButton from './TextButton';

export default class AuthBtn extends TextButton {
  constructor(scene: Phaser.Scene, username = '') {
    const text = username || LANGUAGE.startScene.signIn[store.getState().app.lang as Language];

    super(
      scene,
      {
        x: scene.cameras.main.width - START_SCENE.btnAuth.y,
        y: START_SCENE.btnAuth.y,
      },
      text,
      START_SCENE.btnAuth,
    );

    this.setOrigin(1, 0).setScale(0);

    this.on('pointerover', this.showExit.bind(this));
    this.on('pointerout', this.hideExit.bind(this));
  }

  showExit() {
    if (store.getState().user.isAuth) {
      this.setText(LANGUAGE.startScene.logout[store.getState().app.lang as Language]);
    }
  }

  hideExit() {
    if (store.getState().user.isAuth) this.setText(store.getState().user.user.username);
  }

  public updateBtnText(): void {
    if (!store.getState().user.isAuth) {
      this.setText(LANGUAGE.startScene.signIn[store.getState().app.lang as Language]);
    } else {
      this.setText(store.getState().user.user.username);
    }
  }

  public show(): Promise<void> {
    return new Promise((animationResolve) => {
      this.scene.tweens.add({
        targets: this,
        ease: 'Back',
        scale: 1,
        duration: 1000,
        delay: 100,
        onComplete: animationResolve,
      });
    });
  }
}
