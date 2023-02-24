import POPUP from 'client/const/components/PopupConst';
import WINNERS_POPUP from 'client/const/components/WinnersPopupConst';
import { ColorsNumber, TextureKeys } from 'common/types/enums';
import { Position, Winner } from 'common/types/types';
import { GameObjects, Scene } from 'phaser';

export default class WinnerRow extends GameObjects.Container {
  constructor(
    scene: Scene,
    winner: Winner,
    id: number,
    position: Position,
  ) {
    super(scene);

    const rowParam = {
      width: POPUP.canvas.winners.width - WINNERS_POPUP.margin * 2,
      height: WINNERS_POPUP.winnerImage.width + WINNERS_POPUP.rowFill.padding * 2,
      centerX: position.x + (POPUP.canvas.winners.width - WINNERS_POPUP.margin * 2) / 2,
      centerY: position.y + WINNERS_POPUP.winnerImage.width / 2
        + WINNERS_POPUP.rowFill.padding,
    };

    const graphics = this.scene.add.graphics();
    graphics.fillStyle(ColorsNumber.PopupBorder);
    graphics.fillRoundedRect(
      position.x,
      position.y,
      rowParam.width,
      rowParam.height,
      WINNERS_POPUP.rowFill.radius,
    );

    graphics.lineStyle(
      WINNERS_POPUP.rowFill.lineWidth,
      ColorsNumber.PopupLine,
    );
    graphics.strokeRoundedRect(
      position.x,
      position.y,
      rowParam.width,
      rowParam.height,
      10,
    );

    const indexImage = this.scene.add.image(
      position.x + WINNERS_POPUP.rowFill.padding,
      rowParam.centerY,
      TextureKeys.Winner,
    ).setOrigin(0, 0.5);

    const indexText = this.scene.add.text(
      position.x + WINNERS_POPUP.rowFill.padding + WINNERS_POPUP.winnerImage.width + 5,
      rowParam.centerY,
      (id + 1).toString(),
      WINNERS_POPUP.indexText.style,
    ).setOrigin(0, 0.5);

    const winnerText = this.scene.add.text(
      rowParam.centerX,
      rowParam.centerY,
      winner.username,
      WINNERS_POPUP.winnerText.style,
    ).setOrigin(0.5, 0.5);

    const starText = this.scene.add.text(
      position.x + rowParam.width - WINNERS_POPUP.rowFill.padding,
      rowParam.centerY,
      winner.stars.toString(),
      WINNERS_POPUP.starText.style,
    ).setOrigin(1, 0.5);

    const starImage = this.scene.add.image(
      position.x + rowParam.width - WINNERS_POPUP.rowFill.padding - 40,
      rowParam.centerY,
      TextureKeys.Star,
    ).setOrigin(1, 0.5);

    indexImage.setDisplaySize(WINNERS_POPUP.winnerImage.width, WINNERS_POPUP.winnerImage.width);
    starImage.setDisplaySize(WINNERS_POPUP.starImage.width, WINNERS_POPUP.starImage.width);

    this.add(graphics);
    this.add(indexImage);
    this.add(indexText);
    this.add(winnerText);
    this.add(starImage);
    this.add(starText);
  }
}
