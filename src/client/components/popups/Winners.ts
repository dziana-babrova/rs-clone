import POPUP from 'client/const/components/PopupConst';
import LANGUAGE, { Language } from 'client/const/Language';
import { Scene } from 'phaser';
import store from 'client/state/store';
import { Position, WinnersResponse } from 'common/types/types';
import PositionCalculation from 'client/utils/PositionCalculation';
import WINNERS_POPUP from 'client/const/components/WinnersPopupConst';
import { TextureKeys } from 'common/types/enums';
import ERROR_POPUP from 'client/const/components/ErrorPopupConst';
import SettingsPopup from './SettingsPopup';
import WinnerRow from './WinnerRow';

export default class Winners extends SettingsPopup {
  constructor(scene: Scene, winners: WinnersResponse) {
    const popupParams = winners.length === 0 ? POPUP.canvas.error : POPUP.canvas.winners;
    super(scene, LANGUAGE.popup.winners.title[store.getState().app.lang], popupParams);

    if (winners.length === 0) {
      this.createEmptyMessage();
    } else {
      this.createWinners(winners);
    }

    this.showPopup();
    this.initEvents();
  }

  private initEvents(): void {
    this.btnClose.on('pointerdown', this.closePopup.bind(this));
  }

  public createEmptyMessage(): void {
    const errorMessage = this.scene.add.text(
      this.scene.cameras.main.centerX,
      this.scene.cameras.main.centerY + ERROR_POPUP.margin,
      LANGUAGE.popup.winners.emptyError[store.getState().app.lang as Language],
      ERROR_POPUP.text.style,
    ).setOrigin(0.5);
    this.add(errorMessage);
  }

  private async createWinners(winnersData: WinnersResponse) {
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
