import { POPUP_ANIMATION } from 'client/const/components/PopupConst';
import ElementsFactory from 'client/utils/ElementGenerator';
import TweenAnimationBuilder from 'client/utils/TweenAnimationBuilder';
import { Move } from 'common/types/enums';
import { GameObjects } from 'phaser';

export default class DOMPopup extends GameObjects.DOMElement {
  tweenAnimationBuilder: TweenAnimationBuilder;

  btnClose!: HTMLButtonElement;

  onClosePopup!: () => void;

  onClickPopup!: (target: HTMLElement) => void;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, -scene.cameras.main.height, 'div');
    (this.parent as HTMLElement).style.transformOrigin = 'top';

    this.node.className = 'overlay';
    this.tweenAnimationBuilder = new TweenAnimationBuilder();

    scene.add.existing(this);

    this.initEvents();
  }

  protected createPopup(): HTMLDivElement {
    return ElementsFactory.createDivElement('popup');
  }

  protected createBtnClose(): void {
    this.btnClose = ElementsFactory.createButtonElement('btn popup__close', '');
  }

  protected initEvents(): void {
    this.addListener('click');
    this.on('click', this.handleClick);
  }

  private async handleClick(e: Event): Promise<void> {
    if (e.target && (e.target as HTMLElement).closest('a')) return;

    e.preventDefault();
    const target = e.target as HTMLElement;

    if (target.closest('.popup__close')) {
      await this.closePopup();
      return;
    }

    if (this.onClickPopup) this.onClickPopup(target);
  }

  public async closePopup(): Promise<void> {
    await this.hide();
    this.setY(-this.scene.cameras.main.height);
    this.onClosePopup();
  }

  public show(): Promise<unknown> {
    return this.move(Move.Show);
  }

  public hide(): Promise<unknown> {
    return this.move(Move.Hide);
  }

  public move(type: Move): Promise<unknown> {
    return this.tweenAnimationBuilder.moveY(
      this.scene,
      this,
      type === Move.Show ? 0 : this.scene.cameras.main.height,
      POPUP_ANIMATION.ease,
      POPUP_ANIMATION.duration,
    );
  }
}
