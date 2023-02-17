import { powerIndicatorProps } from 'const/scenes/MultiplayerSceneConsts';
import { Scene } from 'phaser';
import { ColorsNumber } from 'types/enums';
import { Position, RectangleObjectProps } from 'types/types';

export default class PowerPanel extends Phaser.GameObjects.Container {
  scene: Scene;

  wrapper!: Phaser.GameObjects.Graphics;

  indicator: Phaser.GameObjects.Rectangle;

  tween!: Phaser.Tweens.Tween;

  isReverse: boolean;

  constructor(scene: Phaser.Scene, position: Position, isReverse: boolean) {
    super(scene, position.x, position.y + 50);
    this.scene = scene;
    const { width, height } = powerIndicatorProps;
    this.indicator = scene.add.rectangle(1, 1, 0, height, 0x00ff00);
    this.indicator.setOrigin(0);
    this.wrapper = this.createWrapper({
      color: 0xffffff,
      alpha: 1,
      x: 0,
      y: 0,
      width: width + 2,
      height: height + 2,
    });
    this.add(this.wrapper);
    this.add(this.indicator);
    scene.add.existing(this);
    this.isReverse = isReverse;
    this.setAlpha(0);
    if (isReverse) {
      this.scaleX = -1;
    }
  }

  private createWrapper(props: RectangleObjectProps) {
    const {
      color, alpha, x, y, width, height,
    } = props;
    const wrapper = this.scene.add.graphics();
    wrapper.fillStyle(color, alpha);
    wrapper.fillRoundedRect(x, y, width, height, 1);
    return wrapper;
  }

  animate() {
    this.setAlpha(1);
    const green = Phaser.Display.Color.ValueToColor(ColorsNumber.Green);
    const orange = Phaser.Display.Color.ValueToColor(ColorsNumber.Orange);
    this.tween = this.scene.tweens.addCounter({
      from: 0,
      to: 100,
      duration: powerIndicatorProps.duration,
      repeat: -1,
      yoyo: true,
      onUpdate: (tween) => {
        const value = tween.getValue();
        const colorObject = Phaser.Display.Color.Interpolate.ColorWithColor(
          green,
          orange,
          100,
          value,
        );
        const color = Phaser.Display.Color.GetColor(colorObject.r, colorObject.g, colorObject.b);
        this.indicator.setFillStyle(color);
        this.indicator.width = (powerIndicatorProps.width / 100) * value;
      },
    });
  }

  stop() {
    this.tween.remove();
    setTimeout(() => this.setAlpha(0), powerIndicatorProps.stopTimeout);
  }
}
