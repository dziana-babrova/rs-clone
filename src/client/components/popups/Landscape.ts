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
    const positions: Position[] = [];

    const sceneWidth = this.scene.cameras.main.width;

    const popupWidth = POPUP.canvas.landscape.width;
    const popupHeight = POPUP.canvas.landscape.height;

    const imageTexture = this.scene.textures.get(BackgroundKeys.Daytime).getSourceImage();

    const imageWidth = imageTexture.width;
    const imageHeight = imageTexture.height;

    const imageMargin = {
      x: 30,
      y: 30,
    };

    const cols = 2;
    const rows = 2;

    const popupX = (sceneWidth - popupWidth) / 2;
    const popupY = this.point;

    const levelsWidth = cols * (imageWidth + imageMargin.x) - imageMargin.x;
    const levelsHeight = rows * (imageHeight + imageMargin.y) - imageMargin.x;

    const marginLeft = (popupWidth - levelsWidth) / 2;
    const marginTop = (popupHeight - levelsHeight) / 2;

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const x = marginLeft + col * (imageWidth + imageMargin.x) + popupX;
        const y = marginTop + row * (imageHeight + imageMargin.y) + popupY + 10;
        positions.push({ x, y });
      }
    }

    return positions;
  }
}
