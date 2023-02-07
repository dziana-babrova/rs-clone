import { ballText } from 'constants/constants';
import { GameObjects, Scene } from 'phaser';

export default class BallText extends GameObjects.Text {
  scene: Scene;

  private tween: Phaser.Tweens.Tween | undefined;

  constructor(scene: Scene) {
    super(scene, 200, 200, ballText.text, ballText.style);
    this.scene = scene;
    this.scene.add.existing(this);
    this.alpha = 0;
    this.setOrigin(0.5, 0.5);
  }

  show() {
    this.tween = this.scene.tweens.add({
      targets: this,
      y: this.y - 50,
      alpha: 1,
      scale: 1.5,
      duration: ballText.duration,
      ease: 'Sine.easeInOut',
      delay: 100,
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
