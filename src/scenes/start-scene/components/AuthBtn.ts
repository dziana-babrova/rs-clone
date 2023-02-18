import LANGUAGE from 'const/Language';
import START_SCENE from 'const/scenes/StartSceneConst';
import Phaser from 'phaser';
import store from 'state/store';
import TextButton from './TextButton';

export default class AuthBtn extends TextButton {
  constructor(scene: Phaser.Scene, username = '') {
    const text = username || LANGUAGE.startScene.signIn[store.getState().app.lang];

    super(
      scene,
      {
        x: scene.cameras.main.width
          - START_SCENE.btnAuth.width / 2
          - START_SCENE.btnAuth.y,
        y: START_SCENE.btnAuth.y,
      },
      text,
      START_SCENE.btnAuth,
    );

    this.setScale(0);

    this.on('pointerover', this.showExit.bind(this));
    this.on('pointerout', this.hideExit.bind(this));
  }

  showExit() {
    if (store.getState().user.isAuth) {
      this.setText(LANGUAGE.startScene.logout[store.getState().app.lang]);
    }
  }

  hideExit() {
    if (store.getState().user.isAuth) this.setText(store.getState().user.user.username);
  }

  public updateBtnText(): void {
    if (!store.getState().user.isAuth) {
      this.setText(LANGUAGE.startScene.signIn[store.getState().app.lang]);
    }
  }

  public show(): Promise<void> {
    return new Promise((animationResolve) => {
      this.scene.tweens.add({
        targets: this,
        ease: 'Back', // 'Linear', 'Cubic', 'Elastic', 'Bounce', 'Back'
        scale: 1,
        duration: 1000,
        delay: 100,
        onComplete: animationResolve,
      });
    });
  }
}
