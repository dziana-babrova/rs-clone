import START_SCENE from 'const/StartSceneConst';
import TextureKeys from 'const/TextureKeys';
import { GameObjects } from 'phaser';
import store from 'state/store';

export default class LangBtn extends GameObjects.Sprite {
  constructor(scene: Phaser.Scene) {
    super(
      scene,
      START_SCENE.btnLang.y,
      START_SCENE.btnLang.y,
      TextureKeys[store.getState().app.lang],
    );

    this.setScale(0);
    this.setInteractive({
      useHandCursor: true,
    });

    this.scene.add.existing(this);
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
