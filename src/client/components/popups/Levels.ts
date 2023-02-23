import POPUP from 'client/const/components/PopupConst';
import LANGUAGE from 'client/const/Language';
import { Scene } from 'phaser';
import store from 'client/state/store';
import { TextureKeys } from 'common/types/enums';
import { Position } from 'common/types/types';
import LevelBtn from './LevelBtn';
import SettingsPopup from './SettingsPopup';

export default class Levels extends SettingsPopup {
  startLevel!: (levelId: number) => void;

  constructor(scene: Scene) {
    super(scene, LANGUAGE.startScene.levels[store.getState().app.lang], POPUP.canvas.levels);
    this.create();
  }

  public create(): void {
    this.createLevels();
    this.showPopup();
    this.initEvents();
  }

  private initEvents(): void {
    this.btnClose.on('pointerdown', this.closePopup.bind(this));
  }

  private createLevels() {
    const imagePositions = this.getLevelsPositions();

    const levelsData = store.getState().app.maps;

    levelsData.forEach((level, index) => {
      const levelBtn = new LevelBtn(this.scene, level, index, imagePositions);
      this.add(levelBtn);
      levelBtn.chooseLevel = this.chooseLevel.bind(this);
    });
  }

  private chooseLevel(id: number) {
    this.destroy();
    this.startLevel(id);
  }

  private getLevelsPositions(): Position[] {
    const levelsPositions: Position[] = [];

    const sceneWidth = this.scene.cameras.main.width;

    const popupWidth = POPUP.canvas.levels.width;
    const popupHeight = POPUP.canvas.levels.height;

    const imageTexture = this.scene.textures.get(TextureKeys.LevelEmpty).getSourceImage();

    const imageWidth = imageTexture.width;
    const imageHeight = imageTexture.height;

    const imageMargin = {
      x: 20,
      y: 10,
    };

    const cols = 10;
    const rows = 3;

    const popupX = (sceneWidth - popupWidth) / 2;
    const popupY = this.point;

    const levelsWidth = cols * (imageWidth + imageMargin.x) - imageMargin.x;
    const levelsHeight = rows * (imageHeight + imageMargin.y) - imageMargin.x;

    const marginLeft = (popupWidth - levelsWidth) / 2;
    const marginTop = (popupHeight - levelsHeight) / 2;

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const x = marginLeft + col * (imageWidth + imageMargin.x) + popupX;
        const y = marginTop + row * (imageHeight + imageMargin.y) + popupY;
        levelsPositions.push({ x, y });
      }
    }

    return levelsPositions;
  }
}
