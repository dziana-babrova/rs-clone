// This is a temporary class

export default class NextLevelButton extends Phaser.GameObjects.Text {
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 'Next Level', {
      backgroundColor: '#288BA8',
    });

    this.setOrigin(0, 0);

    scene.add.existing(this);
    this.setInteractive({
      useHandCursor: true,
    });
  }
}
