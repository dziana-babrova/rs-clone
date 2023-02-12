import START_SCENE from 'const/StartSceneConst';
import Phaser from 'phaser';

export default class LogoGroup extends Phaser.GameObjects.Group {
  constructor(scene: Phaser.Scene) {
    super(scene);

    const { centerX } = scene.cameras.main;
    const image = new Phaser.GameObjects.Image(
      scene,
      centerX,
      -START_SCENE.moveY + START_SCENE.logoGroup.logo.y,
      'logo',
    );

    const line = new Phaser.GameObjects.Rectangle(
      scene,
      centerX,
      -START_SCENE.moveY + START_SCENE.logoGroup.line.y,
      START_SCENE.logoGroup.line.width,
      START_SCENE.logoGroup.line.height,
      START_SCENE.logoGroup.line.color,
    );

    const text = new Phaser.GameObjects.Text(
      scene,
      centerX,
      -START_SCENE.moveY + START_SCENE.logoGroup.subtitle.y,
      START_SCENE.logoGroup.subtitle.text.eng,
      {
        fontFamily: 'Montserrat',
        fontSize: `${START_SCENE.logoGroup.subtitle.textSize}px`,
        align: 'center',
        color: START_SCENE.logoGroup.subtitle.color,
      },
    );

    image.setOrigin(0.5, 0);
    line.setOrigin(0.5, 0);
    text.setOrigin(0.5, 0);

    this.add(image, true);
    this.add(line, true);
    this.add(text, true);

    scene.add.existing(this);
  }

  show() {
    return new Promise((animationResolve) => {
      this.scene.tweens.add({
        targets: this.getChildren(),
        ease: 'Back', // 'Linear', 'Cubic', 'Elastic', 'Bounce', 'Back'
        y: `+=${START_SCENE.moveY}`,
        duration: 1000,
        delay: 100,
        onComplete: animationResolve,
      });
    });
  }
}