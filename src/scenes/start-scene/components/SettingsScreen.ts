import START_SCENE from 'const/StartSceneConst';
import { TextureKeys } from 'types/enums';
import Phaser from 'phaser';
import { Move } from 'types/types';

export default class SettingsScreen extends Phaser.GameObjects.Group {
  btnClose: Phaser.GameObjects.Image;

  title: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, text: string) {
    super(scene);

    const { centerX } = scene.cameras.main;

    this.title = new Phaser.GameObjects.Text(
      scene,
      centerX - START_SCENE.settingsScreen.moveX,
      START_SCENE.settingsScreen.title.y,
      text,
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
      TextureKeys.Close,
    );

    const line = new Phaser.GameObjects.Rectangle(
      scene,
      centerX - START_SCENE.settingsScreen.moveX,
      START_SCENE.settingsScreen.title.y + START_SCENE.settingsScreen.line.marginTop,
      START_SCENE.settingsScreen.line.width,
      START_SCENE.settingsScreen.line.height,
      START_SCENE.logoGroup.line.color,
    );

    this.btnClose.setOrigin(1, 0);
    line.setOrigin(0.5, 0);
    this.title.setOrigin(0.5, 0);

    this.add(line, true);
    this.add(this.title, true);
    this.add(this.btnClose, true);

    this.btnClose.setInteractive({
      useHandCursor: true,
    });

    scene.add.existing(this);
  }

  public show(): Promise<void> {
    return this.move(Move.Show);
  }

  public hide(): Promise<void> {
    return this.move(Move.Hide);
  }

  private move(type: Move): Promise<void> {
    return new Promise((animationResolve) => {
      this.scene.tweens.add({
        targets: this.getChildren(),
        ease: 'Back', // 'Linear', 'Cubic', 'Elastic', 'Bounce', 'Back'
        x: `${type === Move.Show ? '+' : '-'}=${START_SCENE.settingsScreen.moveX}`,
        duration: 1000,
        delay: 100,
        onComplete: animationResolve,
      });
    });
  }
}
