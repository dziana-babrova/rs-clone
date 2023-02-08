import START_SCENE from 'const/StartSceneConst';
import Phaser from 'phaser';

export default class Landscape extends Phaser.GameObjects.Group {
  btnClose: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene) {
    super(scene);

    const { centerX } = scene.cameras.main;

    const text = new Phaser.GameObjects.Text(
      scene,
      centerX - START_SCENE.winners.moveX,
      START_SCENE.winners.y,
      START_SCENE.landscape.text.eng,
      {
        fontFamily: 'Montserrat',
        fontSize: `${START_SCENE.winners.textSize}px`,
        align: 'center',
        color: START_SCENE.winners.color,
      },
    );

    this.btnClose = new Phaser.GameObjects.Image(
      scene,
      centerX + 200 - START_SCENE.winners.moveX,
      START_SCENE.winners.y,
      'close',
    );

    const line = new Phaser.GameObjects.Rectangle(
      scene,
      centerX - START_SCENE.winners.moveX,
      START_SCENE.winners.y + 40,
      400,
      3,
      START_SCENE.line.color,
    );

    this.btnClose.setOrigin(1, 0);
    line.setOrigin(0.5, 0);
    text.setOrigin(0.5, 0);

    this.add(line, true);
    this.add(text, true);
    this.add(this.btnClose, true);

    this.btnClose.setInteractive({
      useHandCursor: true,
    });

    scene.add.existing(this);
  }

  show() {
    return new Promise((animationResolve) => {
      this.scene.tweens.add({
        targets: this.getChildren(),
        ease: 'Back', // 'Linear', 'Cubic', 'Elastic', 'Bounce', 'Back'
        x: `+=${START_SCENE.winners.moveX}`,
        duration: 1000,
        delay: 100,
        onComplete: animationResolve,
      });
    });
  }

  hide() {
    return new Promise((animationResolve) => {
      this.scene.tweens.add({
        targets: this.getChildren(),
        ease: 'Back', // 'Linear', 'Cubic', 'Elastic', 'Bounce', 'Back'
        x: `-=${START_SCENE.winners.moveX}`,
        duration: 1000,
        delay: 100,
        onComplete: animationResolve,
      });
    });
  }
}
