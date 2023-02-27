import { Scene } from 'phaser';
import { ColorsNumber, Move, TextureKeys } from 'common/types/enums';
import TweenAnimationBuilder from 'client/utils/TweenAnimationBuilder';
import { Size, SizeWithShift } from 'common/types/types';
import POPUP, { POPUP_ANIMATION } from 'client/const/components/PopupConst';

export default class PopupCanvasGroup extends Phaser.GameObjects.Container {
  size: SizeWithShift;

  tweenAnimationBuilder: TweenAnimationBuilder;

  canvasStroke!: Phaser.GameObjects.Graphics;

  canvasFill!: Phaser.GameObjects.Graphics;

  btnClose!: Phaser.GameObjects.Image;

  point: number;

  constructor(scene: Scene, title: string, size: SizeWithShift, isCloseBtn: boolean) {
    super(scene);
    this.size = size;
    this.point = (this.scene.cameras.main.height - this.size.height) / 2 - this.size.shift;
    this.tweenAnimationBuilder = new TweenAnimationBuilder();

    this.createCanvas();
    this.createLabel(title);

    if (isCloseBtn) {
      this.createCloseBtn(size);
    }

    this.setY(-scene.cameras.main.height);
    this.scene.add.existing(this);
  }

  createCloseBtn(size: Size) {
    this.btnClose = new Phaser.GameObjects.Image(
      this.scene,
      this.scene.cameras.main.centerX + size.width / 2,
      this.point,
      TextureKeys.Close,
    ).setOrigin(0.5);

    this.add(this.btnClose);

    this.btnClose.setInteractive({
      useHandCursor: true,
    });
  }

  private createCanvas(): void {
    const xFill = (this.scene.scale.width - this.size.width) / 2;
    const xStroke = (this.scene.scale.width - (this.size.width + POPUP.canvasStroke.padding)) / 2;
    const yStroke = (this.scene.scale.height - (this.size.height + POPUP.canvasStroke.padding))
      / 2 - this.size.shift;

    const graphicsStroke = this.scene.add.graphics();
    graphicsStroke.lineStyle(
      POPUP.canvasStroke.lineWidth,
      ColorsNumber.PopupLine,
    );
    graphicsStroke.fillStyle(ColorsNumber.PopupBorder);

    graphicsStroke.strokeRoundedRect(
      xStroke,
      yStroke,
      this.size.width + POPUP.canvasStroke.padding,
      this.size.height + POPUP.canvasStroke.padding,
      POPUP.canvasStroke.radius,
    );

    graphicsStroke.fillRoundedRect(
      xStroke,
      yStroke,
      this.size.width + POPUP.canvasStroke.padding,
      this.size.height + POPUP.canvasStroke.padding,
      POPUP.canvasStroke.radius,
    );

    const graphicsFill = this.scene.add.graphics();
    graphicsFill.lineStyle(
      POPUP.canvasFill.lineWidth,
      ColorsNumber.PopupLine,
    );
    graphicsFill.fillStyle(ColorsNumber.PopupBackground);
    graphicsFill.strokeRoundedRect(
      xFill,
      this.point,
      this.size.width,
      this.size.height,
      POPUP.canvasFill.radius,
    );

    graphicsFill.fillRoundedRect(
      xFill,
      this.point,
      this.size.width,
      this.size.height,
      POPUP.canvasFill.radius,
    );

    this.add(graphicsStroke);
    this.add(graphicsFill);
  }

  private createLabel(title: string): void {
    const x = (this.scene.scale.width - POPUP.labelFill.width) / 2;
    const y = this.point - POPUP.labelFill.height / 2;

    const graphics = this.scene.add.graphics();
    graphics.lineStyle(
      POPUP.labelFill.lineWidth,
      ColorsNumber.PopupLine,
    );
    graphics.fillStyle(ColorsNumber.PopupBorder);
    graphics.strokeRoundedRect(
      x,
      y,
      POPUP.labelFill.width,
      POPUP.labelFill.height,
      POPUP.labelFill.radius,
    );

    graphics.fillRoundedRect(
      x,
      y,
      POPUP.labelFill.width,
      POPUP.labelFill.height,
      POPUP.labelFill.radius,
    );

    const popupText = this.scene.add
      .text(
        this.scene.cameras.main.centerX,
        y + (POPUP.labelFill.height / 2),
        title,
        POPUP.labelText,
      )
      .setOrigin(0.5);

    this.add(graphics);
    this.add(popupText);
  }

  public show(): Promise<void> {
    return this.move(Move.Show);
  }

  public hide(): Promise<void> {
    return this.move(Move.Hide);
  }

  public async move(type: Move): Promise<void> {
    await this.tweenAnimationBuilder.moveY(
      this.scene,
      this,
      type === Move.Show ? 0 : this.scene.cameras.main.height,
      POPUP_ANIMATION.ease,
      POPUP_ANIMATION.duration,
    );
  }
}
