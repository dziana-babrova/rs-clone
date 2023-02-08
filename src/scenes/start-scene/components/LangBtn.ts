import START_SCENE from 'const/StartSceneConst';
import { GameObjects } from 'phaser';
import { Language } from 'types/types';

export default class LangBtn extends GameObjects.Sprite {
  constructor(scene: Phaser.Scene, lang: Language) {
    super(
      scene,
      START_SCENE.btnLang.y,
      START_SCENE.btnLang.y,
      START_SCENE.btnLang.textura[lang],
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
