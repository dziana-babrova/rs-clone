import { AnimationKeys, TextureKeys } from 'common/types/enums';
import { GAME_SCENE_ANIMATION } from 'client/const/scenes/GameSceneConsts';
import { Scene } from 'phaser';
import TweenAnimationBuilder from 'client/utils/TweenAnimationBuilder';

export default class Flag extends Phaser.GameObjects.Sprite {
  tweenAnimationBuilder: TweenAnimationBuilder;

  targetY: number;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x + 20, y, TextureKeys.Flag);
    this.targetY = y;
    this.tweenAnimationBuilder = new TweenAnimationBuilder();

    this.play(AnimationKeys.Wave);
    this.setScale(1.5);
    this.y = -100;
    scene.add.existing(this);
  }

  async animate(): Promise<void> {
    const { ease, duration } = GAME_SCENE_ANIMATION.flagAnimation;
    await this.tweenAnimationBuilder.moveY(this.scene, this, this.targetY - 45, ease, duration);
  }
}
