import POPUP from 'client/const/components/PopupConst';
import LANGUAGE from 'client/const/Language';
import { Scene } from 'phaser';
import store from 'client/state/store';
import WinnerApiService from 'client/services/WinnersApiService';
import { Position } from 'common/types/types';
import PositionCalculation from 'client/utils/PositionCalculation';
import { TextureKeys } from 'common/types/enums';
import WINNERS_POPUP from 'client/const/components/WinnersPopupConst';
import SettingsPopup from './SettingsPopup';
import WinnerRow from './WinnerRow';

export default class Winners extends SettingsPopup {
  constructor(scene: Scene) {
    super(scene, LANGUAGE.startScene.winners[store.getState().app.lang], POPUP.canvas.winners);
    this.create();
  }

  public async create(): Promise<void> {
    console.log('winners');
    await this.createWinners();
    this.showPopup();
    this.initEvents();
  }

  private initEvents(): void {
    this.btnClose.on('pointerdown', this.closePopup.bind(this));
  }

  private async createWinners() {
    const response = await WinnerApiService.getWinners();
    const winnersData = response.data;
    console.log('winnersData: ', winnersData);

    const positions = this.getPositions();

    winnersData.forEach((winner, index) => {
      const winnerRow = new WinnerRow(this.scene, winner, index, positions[index]);
      this.add(winnerRow);
    });
  }

  private getPositions(): Position[] {
    const imageTexture = this.scene.textures
      .get(TextureKeys.Winner).getSourceImage();

    return PositionCalculation.getPositions({
      sceneWidth: this.scene.cameras.main.width,
      popupY: this.point,
      cols: 1,
      rows: 10,
      popupSize: {
        width: POPUP.canvas.winners.width,
        height: POPUP.canvas.winners.height,
      },
      imageSize: {
        width: POPUP.canvas.winners.width - WINNERS_POPUP.margin * 2,
        height: imageTexture.height,
      },
      gap: { width: 0, height: 14 },
      shift: { x: 0, y: 14 },
    });
  }
}
