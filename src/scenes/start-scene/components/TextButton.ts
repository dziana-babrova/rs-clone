import { Colors } from 'types/enums';
import Phaser from 'phaser';
import { TextButtonParams } from 'types/types';

type Position = {
  x: number,
  y: number,
};

export default class TextButton extends Phaser.GameObjects.Text {
  bgColor: Colors;

  hoverBgColor: Colors;

  constructor(scene: Phaser.Scene, coords: Position, text: string, params: TextButtonParams) {
    super(scene, coords.x, coords.y, text, {
      fontFamily: 'Montserrat',
      fontSize: `${params.textSize}px`,
      backgroundColor: params.bgColor,
      color: params.textColor,
      padding: { x: 20, y: 10 },
      align: 'center',
      fixedWidth: params.width,
    });

    this.bgColor = params.bgColor;
    this.hoverBgColor = params.hoverBgColor;
    this.setOrigin(0.5, 0);

    scene.add.existing(this);
    this.setInteractive({
      useHandCursor: true,
    });

    this.on('pointerover', this.enterButtonHoverState.bind(this));
    this.on('pointerout', this.enterButtonRestState.bind(this));
  }

  enterButtonHoverState() {
    this.setBackgroundColor(this.hoverBgColor);
  }

  enterButtonRestState() {
    this.setBackgroundColor(this.bgColor);
  }
}
