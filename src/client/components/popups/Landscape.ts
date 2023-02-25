import POPUP from 'client/const/components/PopupConst';
import LANGUAGE from 'client/const/Language';
import { Scene } from 'phaser';
import store from 'client/state/store';
import { START_SCENE } from 'client/const/scenes/StartSceneConst';
import { setBackground } from 'client/state/features/AppSlice';
import LocalStorageService from 'client/services/LocalStorageService';
import { LocalStorageKeys } from 'client/const/AppConstants';
import { Position } from 'common/types/types';
import { BackgroundKeys } from 'common/types/enums';
import PositionCalculation from 'client/utils/PositionCalculation';
import SettingsPopup from './SettingsPopup';
import LandscapeBtn from './LandscapeBtn';

export default class Landscape extends SettingsPopup {
  lanscapeBtns!: LandscapeBtn[];

  activeId!: number;

  constructor(scene: Scene) {
    super(
      scene,
      LANGUAGE.startScene.landscape[store.getState().app.lang],
      POPUP.canvas.landscape,
    );
    this.create();
  }

  public create(): void {
    this.createLandscapes();
    this.showPopup();
    this.initEvents();
  }

  private initEvents(): void {
    this.btnClose.on('pointerdown', this.closePopup.bind(this));
  }

  private createLandscapes() {
    const backgroundData = store.getState().app.background;
    const positions = this.getPositions();

    this.lanscapeBtns = START_SCENE.landscape.backround.map((background, index) => {
      const lanscapeBtn = new LandscapeBtn(this.scene, background, index, positions[index]);
      this.add(lanscapeBtn);
      if (backgroundData === background) {
        this.activeId = index;
      }
      lanscapeBtn.onChooseBackground = this.chooseBackground.bind(this);
      return lanscapeBtn;
    });
  }

  private async chooseBackground(type: BackgroundKeys, id: number) {
    if (id !== this.activeId) {
      store.dispatch(setBackground(type));
      LocalStorageService.setItem(LocalStorageKeys.background, type);
      const prevActiveId = this.activeId;
      this.activeId = id;
      await Promise.all([
        this.lanscapeBtns[prevActiveId].hide(),
        this.lanscapeBtns[this.activeId].show(),
      ]);
    }
  }

  private getPositions(): Position[] {
    const imageTexture = this.scene.textures.get(BackgroundKeys.Daytime).getSourceImage();

    return PositionCalculation.getPositions({
      sceneWidth: this.scene.cameras.main.width,
      popupY: this.point,
      cols: 2,
      rows: 2,
      popupSize: {
        width: POPUP.canvas.landscape.width,
        height: POPUP.canvas.landscape.height,
      },
      imageSize: {
        width: imageTexture.width,
        height: imageTexture.height,
      },
      gap: { width: 30, height: 30 },
      shift: { x: 0, y: 10 },
    });
  }
}
