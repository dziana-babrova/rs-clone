import { GAME_SCENE } from 'client/const/scenes/GameSceneConsts';
import { Scene } from 'phaser';

export default class StarTemplateGroup extends Phaser.GameObjects.Group {
  constructor(scene: Scene, color: number, alpha: number) {
    super(scene);

    this.create(color, alpha);
  }

  public create(color: number, alpha: number): void {
    const star = new Phaser.GameObjects.Star(
      this.scene,
      this.scene.scale.width / 2 - GAME_SCENE.nextLevelPopup.star.paddingY,
      this.scene.scale.height / GAME_SCENE.nextLevelPopup.star.indexCenterX
      + GAME_SCENE.nextLevelPopup.star.paddingX,
      GAME_SCENE.nextLevelPopup.star.points,
      GAME_SCENE.nextLevelPopup.star.innerRadius,
      GAME_SCENE.nextLevelPopup.star.outerRadius,
      color,
      alpha,
    );
    star.setDepth(202);
    const star2 = new Phaser.GameObjects.Star(
      this.scene,
      this.scene.scale.width / 2,
      this.scene.scale.height / GAME_SCENE.nextLevelPopup.star.indexCenterX,
      GAME_SCENE.nextLevelPopup.star.points,
      GAME_SCENE.nextLevelPopup.star.innerRadius,
      GAME_SCENE.nextLevelPopup.star.outerRadius,
      color,
      alpha,
    );
    star2.setDepth(202);
    const star3 = new Phaser.GameObjects.Star(
      this.scene,
      this.scene.scale.width / 2 + GAME_SCENE.nextLevelPopup.star.paddingY,
      this.scene.scale.height / GAME_SCENE.nextLevelPopup.star.indexCenterX
      + GAME_SCENE.nextLevelPopup.star.paddingX,
      GAME_SCENE.nextLevelPopup.star.points,
      GAME_SCENE.nextLevelPopup.star.innerRadius,
      GAME_SCENE.nextLevelPopup.star.outerRadius,
      color,
      alpha,
    );
    star3.setDepth(202);
    this.add(star, true);
    this.add(star2, true);
    this.add(star3, true);
  }

  public show(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.scene.add.existing(this);
      resolve();
    });
  }
}
