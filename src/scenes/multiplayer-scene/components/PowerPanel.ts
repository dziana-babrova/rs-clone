import PRELOAD_SCENE from "const/PreloadSceneConsts";
import { GameObjects, Scene } from "phaser";
import { Position } from "types/types";
import PowerWrapper from "./PowerWrapper";

export default class PowerPanel extends Phaser.GameObjects.Container {

  scene: Scene;  
  wrapper!: PowerWrapper;
  indicator: Phaser.GameObjects.Rectangle;
  tween!: Phaser.Tweens.Tween;
  isReverse: boolean;
  
  constructor(scene: Phaser.Scene, position: Position, isReverse: boolean) {
    super(scene, position.x, position.y + 50);
    this.scene= scene;
    this.indicator = scene.add.rectangle(1, 1, 0, 20, 0x00FF00);
    this.indicator.setOrigin(0);
    this.wrapper = new PowerWrapper(scene, {
      color: 0xFFFFFF, alpha: 1, x: 0, y: 0, width: 202, height: 22,
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
  
  animate(){
    this.setAlpha(1);
    const green = Phaser.Display.Color.ValueToColor(0x00FF00);
    const red = Phaser.Display.Color.ValueToColor(0xFF9600);
    this.tween = this.scene.tweens.addCounter({
      from: 0,
      to: 100,
       duration: 1000,
       repeat: -1,
       yoyo: true, 
       onUpdate: (tween) => {
        const value = tween.getValue();
        const colorObject = Phaser.Display.Color.Interpolate.ColorWithColor(
          green,
          red,
          100,
          value
        );
        const color = Phaser.Display.Color.GetColor(colorObject.r, colorObject.g, colorObject.b);
        this.indicator.setFillStyle(color);
        this.indicator.width = 2 * value;
       }
    })
  }

  stop(){
    this.tween.remove();
    setTimeout(() => this.setAlpha(0), 300);
  }

}