import LANGUAGE, { Language } from 'const/Language';
import START_SCENE from 'const/StartSceneConst';
import { TextureKeys } from 'types/enums';
import Phaser from 'phaser';
import store from 'state/store';

export default class LogoGroup extends Phaser.GameObjects.Group {
  subtitle!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    super(scene);

    const { centerX } = scene.cameras.main;
    const image = new Phaser.GameObjects.Image(
      scene,
      centerX,
      -START_SCENE.moveY + START_SCENE.logoGroup.logo.y,
      TextureKeys.Logo,
    );

    const line = new Phaser.GameObjects.Rectangle(
      scene,
      centerX,
      -START_SCENE.moveY + START_SCENE.logoGroup.line.y,
      START_SCENE.logoGroup.line.width,
      START_SCENE.logoGroup.line.height,
      START_SCENE.logoGroup.line.color,
    );

    this.subtitle = new Phaser.GameObjects.Text(
      scene,
      centerX,
      -START_SCENE.moveY + START_SCENE.logoGroup.subtitle.y,
      LANGUAGE.startScene.subtitle[store.getState().app.lang],
      {
        fontFamily: 'Montserrat',
        fontSize: `${START_SCENE.logoGroup.subtitle.textSize}px`,
        align: 'center',
        color: START_SCENE.logoGroup.subtitle.color,
      },
    );

    image.setOrigin(0.5, 0);
    line.setOrigin(0.5, 0);
    this.subtitle.setOrigin(0.5, 0);

    this.add(image, true);
    this.add(line, true);
    this.add(this.subtitle, true);

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

  public updateText(lang: Language): void {
    this.subtitle.setText(LANGUAGE.startScene.subtitle[lang]);
  }
}
