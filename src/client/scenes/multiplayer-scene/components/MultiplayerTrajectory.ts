import { trajectoryProps } from 'client/const/scenes/MultiplayerSceneConsts';
import { GameObjects, Scene } from 'phaser';
import { Position } from 'common/types/types';

export default class MultiplayerTrajectory extends GameObjects.Container {
  scene: Scene;

  isReverse: boolean;

  tween!: Phaser.Tweens.Tween;

  constructor(scene: Scene, position: Position, isReverse: boolean) {
    super(scene, position.x, position.y);
    this.scene = scene;
    this.isReverse = isReverse;
    const {
      radius, color, distance, padding, alpha,
    } = trajectoryProps;
    for (let i = 0; i < 10; i += 1) {
      const circle = scene.add.circle(padding + i * distance, 0, radius, color);
      circle.setAlpha(alpha);
      this.add(circle);
    }
    scene.add.existing(this);
    this.animate();
    if (isReverse) {
      this.scaleX = -1;
    }
    this.setDepth(90);
  }

  animate() {
    this.tween = this.scene.tweens.add({
      targets: this,
      angle: this.isReverse ? 90 : -90,
      yoyo: true,
      duration: trajectoryProps.duration,
      repeat: -1,
    });
  }

  stop() {
    this.tween.pause();
  }

  resume() {
    this.tween.play();
    this.tween.resume();
  }
}
