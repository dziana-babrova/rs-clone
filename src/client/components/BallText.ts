import { ballText } from 'client/const/scenes/GameSceneConsts';
import LANGUAGE from 'client/const/Language';
import { GameObjects, Scene } from 'phaser';
import store from 'client/state/store';
import SoundService from 'client/services/SoundService';
import { Language, SoundsKeys } from 'common/types/enums';

export default class BallText extends GameObjects.Text {
  scene: Scene;

  private tween: Phaser.Tweens.Tween | undefined;

  constructor(scene: Scene) {
    super(
      scene,
      200,
      200,
      LANGUAGE.gameScene.ball[store.getState().app.lang as Language],
      ballText.style,
    );
    this.scene = scene;
    this.scene.add.existing(this);
    this.alpha = 0;
    this.setOrigin(0.5, 0.5);
    this.setDepth(100);
  }

  show() {
    this.tween = this.scene.tweens.add({
      targets: this,
      y: this.y - 50,
      alpha: 1,
      scale: 1.5,
      duration: ballText.duration,
      ease: 'Sine.easeInOut',
      delay: 300,
      onStart: () => SoundService.playSound(this.scene, SoundsKeys.Ready),
      onComplete: this.stop.bind(this),
    });
  }

  stop() {
    this.tween?.stop();
    this.tween?.remove();
    this.scale = 1;
    this.alpha = 0;
  }
}
