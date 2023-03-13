import POPUP from 'client/const/components/PopupConst';
import LANGUAGE from 'client/const/Language';
import { GameObjects, Scene } from 'phaser';
import store from 'client/state/store';
import { TextureKeys } from 'common/types/enums';
import { Maps, Position, SwitchLevel } from 'common/types/types';
import PositionCalculation from 'client/utils/PositionCalculation';
import LevelBtn from './LevelBtn';
import SettingsPopup from './SettingsPopup';
import PaginationArrows from './PaginationArrows';

export default class Levels extends SettingsPopup {
  startLevel!: (levelId: number) => void | SwitchLevel;

  level: number;

  currentPage = 1;

  pages = 1;

  pagination: PaginationArrows;

  buttons: GameObjects.Group;

  constructor(scene: Scene, level: number) {
    super(scene, LANGUAGE.popup.levels.title[store.getState().app.lang], POPUP.canvas.levels);
    this.level = level === -1 ? 1 : level + 1;
    const {
      width, height, arrowSize, arrowGap, bottomPadding, shift, xCorrection,
    } = POPUP.canvas.levels;
    this.pagination = new PaginationArrows(
      scene,
      {
        x: (this.scene.cameras.main.width - width) / 2 + width / 2 + xCorrection,
        y: this.point + height + shift - bottomPadding,
      },
      arrowSize,
      arrowGap,
      this.prevPage.bind(this),
      this.nextPage.bind(this),
    );
    this.add(this.pagination);
    this.buttons = scene.add.group();
    const { currentPage, pages } = this.getPaginationInfo();
    this.currentPage = currentPage;
    this.pages = pages;
    this.create();
  }

  public create(): void {
    this.updateArrows();
    this.createLevels(this.getLevelsByPage(this.currentPage));
    this.showPopup();
    this.initEvents();
  }

  private initEvents(): void {
    this.btnClose.on('pointerdown', this.closePopup.bind(this));
  }

  private createLevels(levelsData: Maps) {
    const imagePositions = this.getLevelsPositions();

    levelsData.forEach((level, index) => {
      const levelBtn = new LevelBtn(this.scene, level, index, imagePositions);
      this.add(levelBtn);
      this.buttons.add(levelBtn);
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

  private getPaginationInfo() {
    const { perPage } = POPUP.canvas.levels;
    const levelsData = store.getState().app.maps;
    const pages = Math.ceil(levelsData.length / perPage);
    const currentPage = Math.ceil(Math.abs(this.level) / perPage);
    return { currentPage, pages };
  }

  private getLevelsByPage(page: number) {
    const levelsData = store.getState().app.maps;
    const { perPage } = POPUP.canvas.levels;
    return levelsData.slice((page - 1) * perPage, page * perPage);
  }

  private updateArrows() {
    if (this.currentPage === 1) {
      this.pagination.disablePrevArrow();
      this.pagination.enableNextArrow();
      return;
    }
    if (this.currentPage === this.pages) {
      this.pagination.enablePrevArrow();
      this.pagination.disableNextArrow();
      return;
    }
    this.pagination.enablePrevArrow();
    this.pagination.enableNextArrow();
  }

  protected async nextPage() {
    if (this.currentPage >= this.pages) return;
    this.currentPage += 1;
    await this.changePage();
  }

  protected async prevPage() {
    if (this.currentPage <= 1) return;
    this.currentPage -= 1;
    await this.changePage();
  }

  protected async changePage() {
    await this.changeAlpha(this.buttons, 0);
    const { buttons } = this;
    this.buttons = this.scene.add.group();
    buttons.destroy();
    const levels = this.getLevelsByPage(this.currentPage);
    this.createLevels(levels);
    this.updateArrows();
  }

  private changeAlpha(targets: GameObjects.Group, to: number) {
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: targets.getChildren(),
        alpha: to,
        duration: 300,
        onComplete: resolve,
      });
    });
  }
}
