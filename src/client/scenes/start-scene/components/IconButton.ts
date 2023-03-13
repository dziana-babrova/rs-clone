import { ColorsNumber } from 'common/types/enums';
import Phaser from 'phaser';
import { IconButtonParams, Position } from 'common/types/types';

export default class IconButton extends Phaser.GameObjects.Group {
  background: Phaser.GameObjects.Rectangle;

  icon: Phaser.GameObjects.Sprite;

  bgColor: ColorsNumber;

  hoverBgColor: ColorsNumber;

  constructor(
    scene: Phaser.Scene,
    texture: string,
    coords: Position,
    params: IconButtonParams,
    scale = 1,
  ) {
    super(scene);

    this.background = new Phaser.GameObjects.Rectangle(
      scene,
      coords.x,
      coords.y,
      params.width,
      params.height,
      params.bgColor,
    ).setOrigin(0.5);

    this.icon = new Phaser.GameObjects
      .Sprite(scene, coords.x, coords.y, texture)
      .setOrigin(0.5);

    this.background.setScale(scale);
    this.icon.setScale(scale);

    this.bgColor = params.bgColor;
    this.hoverBgColor = params.hoverBgColor;

    this.add(this.background, true);
    this.add(this.icon, true);

    scene.add.existing(this);

    this.background.setInteractive({
      useHandCursor: true,
    });

    this.background.on('pointerover', this.enterButtonHoverState.bind(this));
    this.background.on('pointerout', this.enterButtonRestState.bind(this));
  }

  enterButtonHoverState() {
    this.background.setFillStyle(this.hoverBgColor);
  }

  enterButtonRestState() {
    this.background.setFillStyle(this.bgColor);
  }
}
