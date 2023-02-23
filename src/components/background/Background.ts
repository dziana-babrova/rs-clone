import { GAME_SCENE } from 'const/scenes/GameSceneConsts';
import { Math, Scene } from 'phaser';
import {
  BackgroundFrames, BackgroundKeys, Colors, TextureKeys,
} from 'types/enums';
import SkyObject from './SkyObject';

export default class Background {
  sun!: SkyObject;

  bigCloud!: SkyObject;

  smallCloud!: SkyObject;

  scene: Scene;

  constructor(scene: Scene, type: BackgroundKeys) {
    this.scene = scene;
    this.selectBackround(scene, type);
  }

  private selectBackround(scene: Scene, type: string) {
    switch (type) {
      case BackgroundKeys.Daytime:
        this.setBackground(scene, Colors.BackgroundDay, '', BackgroundFrames.Sun);
        break;
      case BackgroundKeys.Night:
        this.setBackground(
          scene,
          Colors.BackgroundNight,
          BackgroundFrames.Stars,
          BackgroundFrames.Moon,
        );
        break;
      case BackgroundKeys.Mountains:
        this.setBackground(
          scene,
          Colors.BackgroundMountains,
          BackgroundFrames.Mountains,
          BackgroundFrames.Sun,
        );
        break;
      case BackgroundKeys.Palms:
        this.setBackground(
          scene,
          Colors.BackgroundPalms,
          BackgroundFrames.Palms,
          BackgroundFrames.Sun,
        );
        break;
      default:
        this.setBackground(scene, Colors.BackgroundDay, '', BackgroundFrames.Sun);
        break;
    }
  }

  private setBackground(
    scene: Scene,
    color: string,
    backgroundFrame: string,
    sunFrame: string,
  ): void {
    scene.cameras.main.setBackgroundColor(color);
    this.sun = new SkyObject(
      scene,
      0,
      GAME_SCENE.background.sun.initialY,
      TextureKeys.Background,
      sunFrame,
      GAME_SCENE.background.sun.initialY,
    );
    this.bigCloud = new SkyObject(
      scene,
      Math.Between(0, scene.scale.width),
      0,
      TextureKeys.Background,
      BackgroundFrames.BigCloud,
      scene.scale.height / 2,
    );
    this.smallCloud = new SkyObject(
      scene,
      Math.Between(0, scene.scale.width),
      0,
      TextureKeys.Background,
      BackgroundFrames.SmallCloud,
      scene.scale.height / 2,
    );
    if (backgroundFrame) {
      scene.add.image(0, 0, TextureKeys.Background, backgroundFrame).setOrigin(0, 0);
    }
  }

  public update(): void {
    this.sun.update(
      GAME_SCENE.background.sun.moveX,
      GAME_SCENE.background.sun.moveY,
      GAME_SCENE.background.sun.initialY,
      GAME_SCENE.background.sun.initialY,
    );
    this.bigCloud.update(
      GAME_SCENE.background.cloud.MinMoveX,
      GAME_SCENE.background.cloud.moveY,
      0,
      this.scene.scale.height / 2,
    );
    this.smallCloud.update(
      GAME_SCENE.background.cloud.MaxMoveX,
      GAME_SCENE.background.cloud.moveY,
      0,
      this.scene.scale.height / 2,
    );
  }
}
