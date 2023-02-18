import { GAME_SCENE_ANIMATION, GAME_SCENE } from 'const/scenes/GameSceneConsts';
import { Scene } from 'phaser';
import SoundService from 'services/SoundService';
import TweenAnimationBuilder from 'utils/TweenAnimationBuilder';
import StarTemplateGroup from './StarTemplateGroup';

export default class CollectedStarsGroup extends StarTemplateGroup {
  tweenAnimationBuilder: TweenAnimationBuilder;

  starsY: number[];

  constructor(
    scene: Scene,
    color: number,
    strokeColor: number,
    alpha: number,
  ) {
    super(scene, color, alpha);
    this.tweenAnimationBuilder = new TweenAnimationBuilder();
    this.starsY = [];

    this.getChildren().forEach((star) => {
      if (star instanceof Phaser.GameObjects.Star) {
        star.setStrokeStyle(GAME_SCENE.nextLevelPopup.star.lineWidth, strokeColor);
        this.starsY.push(star.y);
      }
    });
    this.setY(GAME_SCENE.nextLevelPopup.star.initialY);
  }

  async reveal(index: number): Promise<void> {
    await this.tweenAnimationBuilder.moveY(
      this.scene,
      this.getChildren()[index],
      this.starsY[index],
      GAME_SCENE_ANIMATION.starAnimation.ease,
      GAME_SCENE_ANIMATION.starAnimation.duration,
    );
    SoundService.resultStarSound(this.scene);
  }

  async pulse(index: number): Promise<void> {
    const star = this.getChildren()[index] as Phaser.GameObjects.Star;
    star.y = this.starsY[index];
    await this.tweenAnimationBuilder.scaleToBig(this.scene, this.getChildren()[index], 400, 1.5);
    star.setStrokeStyle();
    star.setFillStyle();
  }
}
