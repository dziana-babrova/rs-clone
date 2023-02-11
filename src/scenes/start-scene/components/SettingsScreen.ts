import START_SCENE from 'const/StartSceneConst';
import Phaser from 'phaser';
import { Move } from 'types/types';

export default class SettingsScreen extends Phaser.GameObjects.Group {
  btnClose: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, title: string) {
    super(scene);

    const { centerX } = scene.cameras.main;

    const text = new Phaser.GameObjects.Text(
      scene,
      centerX - START_SCENE.settingsScreen.moveX,
      START_SCENE.settingsScreen.title.y,
      title,
      {
        fontFamily: 'Montserrat',
        fontSize: `${START_SCENE.settingsScreen.title.textSize}px`,
        align: 'center',
        color: START_SCENE.settingsScreen.title.color,
      },
    );

    this.btnClose = new Phaser.GameObjects.Image(
      scene,
      centerX + START_SCENE.settingsScreen.line.width / 2 - START_SCENE.settingsScreen.moveX,
      START_SCENE.settingsScreen.title.y,
      'close',
    );

    const line = new Phaser.GameObjects.Rectangle(
      scene,
      centerX - START_SCENE.settingsScreen.moveX,
      START_SCENE.settingsScreen.title.y + START_SCENE.settingsScreen.line.marginTop,
      START_SCENE.settingsScreen.line.width,
      START_SCENE.settingsScreen.line.height,
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

  move(type: Move) {
    return new Promise((animationResolve) => {
      this.scene.tweens.add({
        targets: this.getChildren(),
        ease: 'Back', // 'Linear', 'Cubic', 'Elastic', 'Bounce', 'Back'
        x: `${type === Move.show ? '+' : '-'}=${START_SCENE.settingsScreen.moveX}`,
        duration: 1000,
        delay: 100,
        onComplete: animationResolve,
      });
    });
  }
}
