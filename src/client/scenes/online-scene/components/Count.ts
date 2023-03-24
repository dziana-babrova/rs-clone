import { countStyle } from 'client/const/scenes/MultiplayerSceneConsts';
import { Position } from 'common/types/types';
import { Scene } from 'phaser';

export default class Count extends Phaser.GameObjects.Text {
  constructor(scene: Scene, position: Position, text: string) {
    super(scene, position.x, position.y, text, countStyle);
    this.scene.add.existing(this);
    this.setDepth(300);
    this.setOrigin(0.5);
  }

  public animate(): Promise<unknown> {
    return new Promise((animationResolve) => {
      this.scene.tweens.add({
        targets: this,
        scale: 0.2,
        duration: 900,
        ease: 'Sine.easeInOut',
        delay: 100,
        onComplete: animationResolve,
      });
    });
  }
}
