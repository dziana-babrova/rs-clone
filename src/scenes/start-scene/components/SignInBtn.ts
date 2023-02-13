import LANGUAGE from 'const/Language';
import START_SCENE from 'const/StartSceneConst';
import Phaser from 'phaser';
import store from 'state/store';
import TextButton from './TextButton';

export default class SignInBtn extends TextButton {
  constructor(scene: Phaser.Scene) {
    super(
      scene,
      {
        x: scene.cameras.main.width
          - START_SCENE.btnSignIn.width / 2
          - START_SCENE.btnSignIn.y,
        y: START_SCENE.btnSignIn.y,
      },
      LANGUAGE.startScene.signIn[store.getState().app.lang],
      START_SCENE.btnSignIn,
    );

    this.setScale(0);
    this.setInteractive({
      useHandCursor: true,
    });
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
