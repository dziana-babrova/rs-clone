import POPUP from 'client/const/components/PopupConst';
import LANGUAGE from 'client/const/Language';
import { Scene } from 'phaser';
import store from 'client/state/store';
import { TextureKeys } from 'common/types/enums';
import { Position, SwitchLevel } from 'common/types/types';
import PositionCalculation from 'client/utils/PositionCalculation';
import LevelBtn from './LevelBtn';
import SettingsPopup from './SettingsPopup';

export default class Levels extends SettingsPopup {
  startLevel!: (levelId: number) => void | SwitchLevel;

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
    const imageTexture = this.scene.textures.get(TextureKeys.LevelEmpty).getSourceImage();

    return PositionCalculation.getPositions({
      sceneWidth: this.scene.cameras.main.width,
      popupY: this.point,
      cols: 10,
      rows: 3,
      popupSize: {
        width: POPUP.canvas.levels.width,
        height: POPUP.canvas.levels.height,
      },
      imageSize: {
        width: imageTexture.width,
        height: imageTexture.height,
      },
      gap: { width: 10, height: 20 },
      shift: { x: 0, y: 0 },
    });
  }
}
