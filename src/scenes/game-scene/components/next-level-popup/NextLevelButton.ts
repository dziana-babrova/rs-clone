// This is a temporary class

import { ColorsNumber } from 'const/Colors';
import PopupCanvasGroup from './PopupCanvas';
import StarTemplateGroup from './Star';

export default class NextLevelButton extends Phaser.GameObjects.Text {
  constructor(scene: Phaser.Scene, level: number, stars: number, nextLevelHandler: () => void) {
    super(scene, 0, 0, 'Next Level', {
      backgroundColor: '#288BA8',
    });

    this.setOrigin(0, 0);

    scene.add.existing(this);
    this.setInteractive({
      useHandCursor: true,
    });
    console.log(level, stars, nextLevelHandler);
  }

  async create() {
    const canvas = new PopupCanvasGroup(this.scene);
    await canvas.show();
    const starsTemplate = new StarTemplateGroup(this.scene, ColorsNumber.starTemplate);
    await starsTemplate.show();
  }
}
