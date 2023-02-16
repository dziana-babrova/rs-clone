import GAME_SCENE_ANIMATION from 'const/GameSceneAnimationConsts';
import GAME_SCENE from 'const/GameSceneConsts';
import { Scene } from 'phaser';
import TweenAnimationBuilder from 'utils/TweenAnimationBuilder';

export default class Button extends Phaser.GameObjects.Group {
  tweenAnimationBuilder: TweenAnimationBuilder;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    radius: number,
    color: number,
    strokeColor: number,
    key: string,
    nextLevelHandler: (nextLevel: boolean) => void,
    nextLevel: boolean,
  ) {
    super(scene);
    this.tweenAnimationBuilder = new TweenAnimationBuilder();

    const button = this.scene.add.circle(x, y, radius, color);
    button.setStrokeStyle(GAME_SCENE.nextLevelPopup.button.lineWidth, strokeColor);
    button.setInteractive({ cursorActive: true });
    button.on('pointerup', nextLevelHandler.bind(scene, nextLevel));

    const icon = this.scene.add.image(x, y, key);
    this.add(button, true);
    this.add(icon, true);

    this.scene.add.existing(this);
  }

  async show(x: number): Promise<void> {
    await this.tweenAnimationBuilder.moveX(
      this.scene,
      this.getChildren(),
      x,
      GAME_SCENE_ANIMATION.nextLevelpopupButtonsAnimation.ease,
      GAME_SCENE_ANIMATION.nextLevelpopupButtonsAnimation.duration,
    );
  }
}
