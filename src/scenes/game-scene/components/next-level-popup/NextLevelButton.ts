// This is a temporary class

import PopupCanvasGroup from './PopupCanvas';

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
    // canvas.setY(-10000);
    await canvas.show();
  }
}
