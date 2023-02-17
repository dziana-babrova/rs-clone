import { scoreBlockSettings } from 'const/scenes/MultiplayerSceneConsts';
import Phaser, { Scene } from 'phaser';
import { Position } from '../../../types/types';

export default class ScorePanel extends Phaser.GameObjects.Container {
  firstPlayerScore: Phaser.GameObjects.Text;

  secondPlayerScore: Phaser.GameObjects.Text;

  constructor(scene: Scene, position: Position) {
    super(scene, position.x, position.y);
    const {
      color1, color2, width, height, padding,
    } = scoreBlockSettings;
    this.createPanel(color1, { x: -width - padding / 2, y: 0 });
    this.createPanel(color2, { x: padding / 2, y: 0 });

    this.firstPlayerScore = this.scene.add.text(-(width + padding) / 2, height / 2, '0', {
      font: '24px Arial',
    });
    this.secondPlayerScore = this.scene.add.text((width + padding) / 2, height / 2, '0', {
      font: '24px Arial',
    });
    this.add(this.firstPlayerScore);
    this.add(this.secondPlayerScore);
    this.firstPlayerScore.setOrigin(0.5);
    this.secondPlayerScore.setOrigin(0.5);
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
    this.firstPlayerScore.text = text;
  }

  changeText2(text: string) {
    this.secondPlayerScore.text = text;
  }
}
