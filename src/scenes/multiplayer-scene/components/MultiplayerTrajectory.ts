import { trajectorySettings } from 'const/constants';
import { GameObjects, Scene } from 'phaser';
import { Position } from 'types/types';

export default class MultiplayerTrajectory extends GameObjects.Container {
  scene: Scene;
  isReverse: boolean;
  tween!: Phaser.Tweens.Tween;
  

  constructor(scene: Scene, position: Position, isReverse: boolean) {
    super(scene, position.x, position.y);
    this.scene = scene;
    this.isReverse = isReverse;
    const { RADIUS, COLOR } = trajectorySettings;
    this.width = 300;
    this.height = 50;
    // Create circles
    for (let i = 0; i < 10; i += 1) {
      const circle = scene.add.circle(20 + i * 15, 0, RADIUS, COLOR);
      circle.setAlpha(0.8);
      this.add(circle);
    }
    scene.add.existing(this);
    this.animate();
    if(isReverse){
      this.scaleX = -1;
    }
  }

  animate(){
    this.tween = this.scene.tweens.add({
      targets: this,
      angle: this.isReverse ? 90 : -90,
      yoyo: true,
      duration: 1000,
      repeat: -1,
    })
  }

  stop() {
    this.tween.pause();
  }

  resume() {
    this.tween.resume();
  }

}
