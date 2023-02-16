import { Scene } from 'phaser';
import { ColorsNumber } from 'const/Colors';
import GAME_SCENE from 'const/GameSceneConsts';
import LANGUAGE from 'const/Language';
import TweenAnimationBuilder from 'utils/TweenAnimationBuilder';
import store from 'state/store';
import GAME_SCENE_ANIMATION from 'const/GameSceneAnimationConsts';

export default class PopupCanvasGroup extends Phaser.GameObjects.Container {
  tweenAnimationBuilder: TweenAnimationBuilder;

  canvasStroke!: Phaser.GameObjects.Graphics;

  canvasFill!: Phaser.GameObjects.Graphics;

  point: number;

  constructor(scene: Scene) {
    super(scene);
    this.point = (this.scene.scale.height - GAME_SCENE.nextLevelPopup.canvasFill.height) / 2;
    this.tweenAnimationBuilder = new TweenAnimationBuilder();

    this.createCanvas();
    this.createLabel();

    this.setY(GAME_SCENE.nextLevelPopup.y);
    this.scene.add.existing(this);
  }

  createCanvas() {
    const xFill = (this.scene.scale.width - GAME_SCENE.nextLevelPopup.canvasFill.width) / 2;
    const xStroke = (this.scene.scale.width - GAME_SCENE.nextLevelPopup.canvasStroke.width) / 2;
    const yStroke = (this.scene.scale.height - GAME_SCENE.nextLevelPopup.canvasStroke.height) / 2;

    const graphicsStroke = this.scene.add.graphics();
    graphicsStroke.lineStyle(
      GAME_SCENE.nextLevelPopup.canvasStroke.lineWidth,
      GAME_SCENE.nextLevelPopup.canvasStroke.lineColor,
    );
    graphicsStroke.fillStyle(ColorsNumber.NextLevelPopupBackground);
    graphicsStroke.strokeRoundedRect(
      xStroke,
      yStroke,
      GAME_SCENE.nextLevelPopup.canvasStroke.width,
      GAME_SCENE.nextLevelPopup.canvasStroke.height,
      GAME_SCENE.nextLevelPopup.canvasStroke.radius,
    );

    graphicsStroke.fillRoundedRect(
      xStroke,
      yStroke,
      GAME_SCENE.nextLevelPopup.canvasStroke.width,
      GAME_SCENE.nextLevelPopup.canvasStroke.height,
      GAME_SCENE.nextLevelPopup.canvasStroke.radius,
    );

    const graphicsFill = this.scene.add.graphics();
    graphicsFill.lineStyle(
      GAME_SCENE.nextLevelPopup.canvasFill.lineWidth,
      GAME_SCENE.nextLevelPopup.canvasFill.lineColor,
    );
    graphicsFill.fillStyle(ColorsNumber.NextLevelPopupBorder);
    graphicsFill.strokeRoundedRect(
      xFill,
      this.point,
      GAME_SCENE.nextLevelPopup.canvasFill.width,
      GAME_SCENE.nextLevelPopup.canvasFill.height,
      GAME_SCENE.nextLevelPopup.canvasFill.radius,
    );

    graphicsFill.fillRoundedRect(
      xFill,
      this.point,
      GAME_SCENE.nextLevelPopup.canvasFill.width,
      GAME_SCENE.nextLevelPopup.canvasFill.height,
      GAME_SCENE.nextLevelPopup.canvasFill.radius,
    );

    this.add(graphicsStroke);
    this.add(graphicsFill);
  }

  createLabel() {
    const x = (this.scene.scale.width - GAME_SCENE.nextLevelPopup.labelFill.width) / 2;
    const y = this.point - GAME_SCENE.nextLevelPopup.labelFill.height / 2;

    const graphics = this.scene.add.graphics();
    graphics.lineStyle(
      GAME_SCENE.nextLevelPopup.labelFill.lineWidth,
      GAME_SCENE.nextLevelPopup.labelFill.lineColor,
    );
    graphics.fillStyle(ColorsNumber.NextLevelPopupBackground);
    graphics.strokeRoundedRect(
      x,
      y,
      GAME_SCENE.nextLevelPopup.labelFill.width,
      GAME_SCENE.nextLevelPopup.labelFill.height,
      GAME_SCENE.nextLevelPopup.labelFill.radius,
    );

    graphics.fillRoundedRect(
      x,
      y,
      GAME_SCENE.nextLevelPopup.labelFill.width,
      GAME_SCENE.nextLevelPopup.labelFill.height,
      GAME_SCENE.nextLevelPopup.labelFill.radius,
    );

    const helloWorld = this.scene.add
      .text(
        this.scene.scale.width / 2,
        y + (GAME_SCENE.nextLevelPopup.labelFill.height / 2),
        LANGUAGE.gameScene.win[store.getState().app.lang],
        GAME_SCENE.nextLevelPopup.labelText,
      )
      .setOrigin(0.5);

    this.add(graphics);
    this.add(helloWorld);
  }

  async show(): Promise<void> {
    await this.tweenAnimationBuilder.moveY(
      this.scene,
      this,
      this.point / 5,
      GAME_SCENE_ANIMATION.popupAnimation.ease,
      GAME_SCENE_ANIMATION.popupAnimation.duration,
    );
  }
}
