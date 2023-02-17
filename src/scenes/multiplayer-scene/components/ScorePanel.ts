import { scoreBlockSettings } from 'const/scenes/MultiplayerSceneConsts';
import Phaser, { Scene } from 'phaser';
import { Position } from '../../../types/types';

export default class ScorePanel extends Phaser.GameObjects.Container {
  text1: Phaser.GameObjects.Text;

  text2!: Phaser.GameObjects.Text;

  constructor(scene: Scene, position: Position) {
    super(scene, position.x, position.y);
    const {
      color1, color2, width, height, padding,
    } = scoreBlockSettings;
    this.createPanel(color1, { x: -width - padding / 2, y: 0 });
    this.createPanel(color2, { x: padding / 2, y: 0 });

    this.text1 = this.scene.add.text(-(width + padding) / 2, height / 2, '0', {
      font: '24px Arial',
    });
    this.text2 = this.scene.add.text((width + padding) / 2, height / 2, '0', {
      font: '24px Arial',
    });
    this.add(this.text1);
    this.add(this.text2);
    this.text1.setOrigin(0.5);
    this.text2.setOrigin(0.5);
    scene.add.existing(this);
  }

  private createPanel(color: number, position: Position) {
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(color, scoreBlockSettings.alpha);
    graphics.fillRoundedRect(
      position.x,
      position.y,
      scoreBlockSettings.width,
      scoreBlockSettings.height,
      scoreBlockSettings.radius,
    );
    this.add(graphics);
  }

  changeText1(text: string) {
    this.text1.text = text;
  }

  changeText2(text: string) {
    this.text2.text = text;
  }
}
