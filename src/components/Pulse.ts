import { pulseSettings } from 'const/GameSceneConsts'; 
import { GameObjects, Scene } from 'phaser';

export default class Pulse extends GameObjects.Arc {
  scene: Scene;

  private tween: Phaser.Tweens.Tween | undefined;

  constructor(scene: Scene) {
    super(scene, -100, -100, 0);
    this.scene = scene;
    scene.add.existing(this);
    this.setStrokeStyle(3, pulseSettings.color);
  }

  pulse() {
    this.tween = this.scene.tweens.add({
      targets: this,
      radius: pulseSettings.size,
      alpha: pulseSettings.minAlpha,
      lineWidth: 0,
      yoyo: false,
      duration: pulseSettings.duration,
      ease: 'Sine.easeInOut',
      repeat: -1,
    });
  }

  stopPulse() {
    this.tween?.stop();
    this.tween?.remove();
    this.radius = 0;
    this.lineWidth = 3;
    this.alpha = 1;
  }
}
