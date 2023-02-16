import GAME_SCENE from 'const/GameSceneConsts';
import { Scene } from 'phaser';

export default class StarTemplateGroup extends Phaser.GameObjects.Group {
  constructor(scene: Scene, color: number) {
    super(scene);

    this.create(color);
  }

  create(color: number) {
    const star = new Phaser.GameObjects.Star(
      this.scene,
      this.scene.scale.width / 2 - GAME_SCENE.nextLevelPopup.star.paddingY,
      this.scene.scale.height / 2 + GAME_SCENE.nextLevelPopup.star.paddingX,
      GAME_SCENE.nextLevelPopup.star.points,
      GAME_SCENE.nextLevelPopup.star.innerRadius,
      GAME_SCENE.nextLevelPopup.star.outerRadius,
      color,
    );
    const star2 = new Phaser.GameObjects.Star(
      this.scene,
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
      GAME_SCENE.nextLevelPopup.star.points,
      GAME_SCENE.nextLevelPopup.star.innerRadius,
      GAME_SCENE.nextLevelPopup.star.outerRadius,
      color,
    );
    const star3 = new Phaser.GameObjects.Star(
      this.scene,
      this.scene.scale.width / 2 + GAME_SCENE.nextLevelPopup.star.paddingY,
      this.scene.scale.height / 2 + GAME_SCENE.nextLevelPopup.star.paddingX,
      GAME_SCENE.nextLevelPopup.star.points,
      GAME_SCENE.nextLevelPopup.star.innerRadius,
      GAME_SCENE.nextLevelPopup.star.outerRadius,
      color,
    );
    this.add(star, true);
    this.add(star2, true);
    this.add(star3, true);
  }

  show() {
    return new Promise<void>((resolve) => {
      this.scene.add.existing(this);
      resolve();
    });
  }
}
