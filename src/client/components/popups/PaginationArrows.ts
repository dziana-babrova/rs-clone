import { TextureKeys } from 'common/types/enums';
import { Position } from 'common/types/types';
import { CustomValidation } from 'express-validator/src/context-items';
import { GameObjects, Scene } from 'phaser';

export default class PaginationArrows extends GameObjects.Container {
  prevArrow: GameObjects.Sprite;
  nextArrow: GameObjects.Sprite;
  onPrevPageClick: () => void;
  onNextPageClick: () => void;

  constructor(scene: Scene, position: Position, size: number, gap: number, onPrevCallback: () => void, onNextCallback: () => void) {
    super(scene, position.x, position.y);
    this.onNextPageClick = onNextCallback;
    this.onPrevPageClick = onPrevCallback;
    this.prevArrow = this.createArrow((-size - gap) / 2, 0, size);
    this.prevArrow.scaleX = -size / this.prevArrow.width;
    this.nextArrow = this.createArrow(gap / 2, 0, size);
    this.add([this.prevArrow, this.nextArrow]);
    this.setDepth(350);
  }

  createArrow(x: number, y: number, size: number) {
    const arrow = this.scene.add.sprite(x, y, TextureKeys.Pagination);
    arrow.setOrigin(0);
    arrow.scale = size / arrow.width;
    arrow.setInteractive({
      useHandCursor: true,
    });
    return arrow;
  }

  disablePrevArrow() {
    this.prevArrow.removeInteractive();
    this.prevArrow.setAlpha(0.5);
  }

  disableNextArrow() {
    this.nextArrow.removeInteractive();
    this.nextArrow.setAlpha(0.5);
  }

  enablePrevArrow() {
    this.prevArrow.setInteractive({
      useHandCursor: true,
    });
    this.prevArrow.setAlpha(1);
  }

  enableNextArrow() {
    this.nextArrow.setInteractive({
      useHandCursor: true,
    });
    this.nextArrow.setAlpha(1);
  }
}
