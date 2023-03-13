import POPUP from 'client/const/components/PopupConst';
import { GameObjects, Scene } from 'phaser';
import { TextureKeys } from 'common/types/enums';
import { MapDescription, Position } from 'common/types/types';

export default class LevelBtn extends GameObjects.Container {
  id: number;

  levelImage: GameObjects.Image;

  chooseLevel!: (levelId: number) => void;

  constructor(
    scene: Scene,
    level: MapDescription,
    index: number,
    imagePositions: Position[],
  ) {
    super(scene);
    this.id = level.id;

    const texture = this.getTexture(level);

    this.levelImage = new Phaser.GameObjects.Image(
      this.scene,
      imagePositions[index].x,
      imagePositions[index].y,
      texture,
    ).setOrigin(0);

    this.add(this.levelImage);

    if (level.isUnlock) {
      this.levelImage.setInteractive({
        useHandCursor: true,
      });
      const text = this.scene.add
        .text(
          imagePositions[index].x + 45,
          imagePositions[index].y + 8,
          (level.id + 1).toString().padStart(2, '0'),
          POPUP.levels.labelText,
        )
        .setOrigin(0.5, 0);
      this.add(text);
    }

    this.initEvents();
  }

  private initEvents(): void {
    this.levelImage.on('pointerdown', () => this.chooseLevel(this.id));
  }

  private getTexture(level: MapDescription): TextureKeys {
    let texture = TextureKeys.LevelLock;
    if (level.isUnlock) {
      switch (level.stars) {
        case 1: {
          texture = TextureKeys.LevelOneStar;
          break;
        }
        case 2: {
          texture = TextureKeys.LevelTwoStars;
          break;
        }
        case 3: {
          texture = TextureKeys.LevelThreeStars;
          break;
        }
        default: {
          texture = TextureKeys.LevelEmpty;
        }
      }
    }
    return texture;
  }
}
