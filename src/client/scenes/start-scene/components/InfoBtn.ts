import { GameObjects } from 'phaser';
import { START_SCENE } from 'client/const/scenes/StartSceneConst';
import { TextureKeys } from 'common/types/enums';

export default class InfoBtn extends GameObjects.Image {
  constructor(scene: Phaser.Scene) {
    super(
      scene,
      START_SCENE.btnLang.y + 80,
      START_SCENE.btnLang.y,
      TextureKeys.Info,
    );

    this
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setScale(0);

    this.scene.add.existing(this);
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
