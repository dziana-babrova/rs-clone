import { IPositionParams, Position } from 'common/types/types';

export default class PositionCalculation {
  public static getPositions(param: IPositionParams): Position[] {
    const positions: Position[] = [];
    const {
      sceneWidth, popupY, imageSize, popupSize, gap, cols, rows, shift,
    } = param;

    const popupX = (sceneWidth - popupSize.width) / 2;

    const elementsWidth = cols * (imageSize.width + gap.width) - gap.width;
    const elementsHeight = rows * (imageSize.height + gap.height) - gap.height;

    const marginLeft = (popupSize.width - elementsWidth) / 2;
    const marginTop = (popupSize.height - elementsHeight) / 2;

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const x = marginLeft + col * (imageSize.width + gap.width) + popupX;
        const y = marginTop + row * (imageSize.height + gap.height) + popupY + shift.y;
        positions.push({ x, y });
      }
    }

    return positions;
  }
}
