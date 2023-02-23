import START_SCENE from 'client/const/scenes/StartSceneConst';
import { TextureKeys } from 'common/types/enums';
import { GameObjects } from 'phaser';
import store from 'client/state/store';

export default class LangBtn extends GameObjects.Sprite {
  constructor(scene: Phaser.Scene) {
    super(
      scene,
      START_SCENE.btnLang.y,
      START_SCENE.btnLang.y,
      TextureKeys[(store.getState().app.lang as 'eng' | 'ru')],
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
