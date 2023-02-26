import { ColorsNumber, TextureKeys } from 'common/types/enums';
import { GameObjects, Scene } from 'phaser';

export default class LoadingOverlay {
  scene: Scene;

  container!: GameObjects.Container;

  loadingBall1!: GameObjects.PathFollower;

  loadingBall2!: GameObjects.PathFollower;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  show() {
    this.container = this.scene.add.container();
    this.container.setDepth(2000);

    const rectangle = this.scene.add.rectangle(
      this.scene.cameras.main.centerX,
      this.scene.cameras.main.centerY,
      this.scene.cameras.main.width,
      this.scene.cameras.main.height,
      ColorsNumber.Secondary,
      60,
    ).setOrigin(0.5);

    const radius = 30;

    const path = new Phaser.Curves
      .Path(
        this.scene.cameras.main.centerX + radius,
        this.scene.cameras.main.centerY,
      ).circleTo(radius);

    this.loadingBall1 = this.scene.add
      .follower(
        path,
        this.scene.cameras.main.centerX + radius,
        this.scene.cameras.main.centerY,
        TextureKeys.Ball,
      )
      .setOrigin(0.5)
      .setScale(0);

    this.loadingBall2 = this.scene.add
      .follower(
        path,
        this.scene.cameras.main.centerX + radius,
        this.scene.cameras.main.centerY,
        TextureKeys.Ball,
      )
      .setOrigin(0.5)
      .setScale(0.1);

    this.container.add(rectangle);
    this.container.add(this.loadingBall1);
    this.container.add(this.loadingBall2);

    this.scene.add.existing(this.container);
    this.showLoading();
  }

  public showLoading(): void {
    this.startPathFollow(this.loadingBall1, 0.3);
    this.startPathFollow(this.loadingBall2, 0.8);
    this.startAnimationScale(this.loadingBall1);
    this.startAnimationScale(this.loadingBall2);
    this.startAnimationRotate(this.loadingBall1);
    this.startAnimationRotate(this.loadingBall2);
  }

  private startPathFollow(target: GameObjects.PathFollower, startPoint: number): void {
    target.startFollow({
      duration: 2000,
      ease: 'Linear',
      loop: -1,
      startAt: startPoint,
    });
  }

  private startAnimationScale(target: GameObjects.PathFollower): void {
    this.scene.tweens.add({
      targets: target,
      yoyo: true,
      ease: 'Linear',
      scale: !target.scale ? 0.1 : 0,
      duration: 2000,
      loop: -1,
    });
  }

  private startAnimationRotate(target: GameObjects.PathFollower): void {
    this.scene.tweens.add({
      targets: target,
      ease: 'Linear',
      loop: -1,
      angle: 360,
      duration: 1000,
    });
  }

  public hide(): void {
    this.container.destroy();
  }
}
