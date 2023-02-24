import { GameObjects, Scene } from 'phaser';
import { BackgroundKeys, Move, TextureKeys } from 'common/types/enums';
import { Position } from 'common/types/types';
import TweenAnimationBuilder from 'client/utils/TweenAnimationBuilder';
import { START_SCENE, START_SCENE_ANIMATION } from 'client/const/scenes/StartSceneConst';
import store from 'client/state/store';

export default class LandscapeBtn extends GameObjects.Container {
  tweenAnimationBuilder: TweenAnimationBuilder;

  type: BackgroundKeys;

  id: number;

  image: GameObjects.Image;

  icon: GameObjects.Image;

  onChooseBackground!: (type: BackgroundKeys, id: number) => void;

  constructor(
    scene: Scene,
    type: BackgroundKeys,
    id: number,
    position: Position,
  ) {
    super(scene);
    this.tweenAnimationBuilder = new TweenAnimationBuilder();

    this.type = type;
    this.id = id;

    this.image = new Phaser.GameObjects.Image(
      this.scene,
      position.x,
      position.y,
      this.type,
    ).setOrigin(0);

    this.icon = new Phaser.GameObjects.Image(
      this.scene,
      position.x + this.image.width - START_SCENE.landscape.selectIcon.shift,
      position.y + START_SCENE.landscape.selectIcon.shift,
      TextureKeys.Select,
    ).setOrigin(0.5);

    if (this.type !== store.getState().app.background) this.icon.setScale(0);

    this.image.setInteractive({
      useHandCursor: true,
    });

    this.add(this.image);
    this.add(this.icon);

    this.initEvents();
  }

  private initEvents(): void {
    this.image.on('pointerdown', () => this.onChooseBackground(this.type, this.id));
  }

  public show(): Promise<void> {
    return this.scaleAnimation(Move.Show);
  }

  public hide(): Promise<void> {
    return this.scaleAnimation(Move.Hide);
  }

  public async scaleAnimation(type: Move): Promise<void> {
    await this.tweenAnimationBuilder.scaleToBig(
      this.scene,
      this.icon,
      START_SCENE_ANIMATION.scaleToOrigin.duration,
      type === Move.Show ? 1 : 0,
    );
  }
}
