import { GAME_SCENE_ANIMATION, GAME_SCENE } from 'client/const/scenes/GameSceneConsts';
import { Scene } from 'phaser';
import TweenAnimationBuilder from 'client/utils/TweenAnimationBuilder';
import { ColorsNumber, TextureKeys } from 'common/types/enums';
import { SwitchLevel } from 'common/types/types';

export default class Button extends Phaser.GameObjects.Group {
  tweenAnimationBuilder: TweenAnimationBuilder;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    key: string,
    nextLevelHandler: SwitchLevel,
    sceneKey: string,
    nextLevel: boolean,
  ) {
    super(scene);
    this.tweenAnimationBuilder = new TweenAnimationBuilder();

    const button = this.create(x, y, key);
    this.setDepth(202);
    this.scene.add.existing(this);
    this.initEvents(button, nextLevelHandler, sceneKey, nextLevel);
  }

  public create(x: number, y: number, key: string): Phaser.GameObjects.Arc {
    const button = this.scene.add.circle(
      x,
      y,
      GAME_SCENE.nextLevelPopup.button.radius,
      ColorsNumber.NextLevelPopupBorder,
    );
    button.setStrokeStyle(GAME_SCENE.nextLevelPopup.button.lineWidth, ColorsNumber.Stroke);
    button.setInteractive({
      useHandCursor: true,
    });
    const icon = this.scene.add.image(x, y, TextureKeys.Buttons, key);
    icon.setScale(0.35);
    this.add(button, true);
    this.add(icon, true);
    return button;
  }

  private initEvents(
    element: Phaser.GameObjects.Arc,
    nextLevelHandler: SwitchLevel,
    sceneKey: string,
    nextLevel?: boolean,
  ): void {
    element.on('pointerover', this.enterButtonHoverState.bind(this, element));
    element.on('pointerout', this.enterButtonRestState.bind(this, element));
    element.on('pointerup', nextLevelHandler.bind(this.scene, sceneKey, nextLevel));
  }

  public async show(x: number): Promise<void> {
    await this.tweenAnimationBuilder.moveX(
      this.scene,
      this.getChildren(),
      x,
      GAME_SCENE_ANIMATION.nextLevelpopupButtonsAnimation.ease,
      GAME_SCENE_ANIMATION.nextLevelpopupButtonsAnimation.duration,
    );
  }

  private enterButtonHoverState(button: Phaser.GameObjects.Arc): void {
    button.setFillStyle(ColorsNumber.ButtonHovered);
  }

  private enterButtonRestState(button: Phaser.GameObjects.Arc): void {
    button.setFillStyle(ColorsNumber.NextLevelPopupBorder);
  }
}
