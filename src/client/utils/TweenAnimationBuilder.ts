export default class TweenAnimationBuilder {
  public async moveY(
    scene: Phaser.Scene,
    target:
    | Phaser.GameObjects.Container
    | Phaser.GameObjects.Group
    | Phaser.GameObjects.Sprite
    | Phaser.GameObjects.GameObject[]
    | Phaser.GameObjects.GameObject,
    y: number,
    ease: string,
    duration: number,
  ) {
    return new Promise((moveAnimationResolve) => {
      scene.tweens.add({
        targets: target,
        ease,
        duration,
        y,
        onComplete: moveAnimationResolve,
      });
    });
  }

  public async moveYFrom(
    scene: Phaser.Scene,
    target:
    | Phaser.GameObjects.Container
    | Phaser.GameObjects.Group
    | Phaser.GameObjects.GameObject[],
    from: number,
    to: number,
    ease: string,
    duration: number,
    yoyo: boolean,
  ) {
    return new Promise((animationResolve) => {
      scene.tweens.add({
        targets: target,
        yoyo,
        ease,
        duration,
        y: { from, to },
        onComplete: animationResolve,
      });
    });
  }

  public async scaleToBig(
    scene: Phaser.Scene,
    target: Phaser.GameObjects.GameObject,
    duration: number,
    scale: number,
  ) {
    return new Promise((animationResolve) => {
      scene.tweens.add({
        targets: target,
        duration,
        scale,
        onComplete: animationResolve,
      });
    });
  }

  public async scaleToZero(
    scene: Phaser.Scene,
    target: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[],
    ease: string,
    duration: number,
  ) {
    return new Promise((animationResolve) => {
      scene.tweens.add({
        targets: target,
        scale: 0,
        ease,
        duration,
        onComplete: animationResolve,
      });
    });
  }

  public async scaleToOrigin(
    scene: Phaser.Scene,
    target: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[],
    ease: string,
    duration: number,
  ) {
    return new Promise((animationResolve) => {
      scene.tweens.add({
        targets: target,
        scale: 1,
        ease,
        duration,
        onComplete: animationResolve,
      });
    });
  }

  public async moveX(
    scene: Phaser.Scene,
    target:
    | Phaser.GameObjects.Container
    | Phaser.GameObjects.Group
    | Phaser.GameObjects.Sprite
    | Phaser.GameObjects.GameObject[]
    | Phaser.GameObjects.GameObject,
    x: number,
    ease: string,
    duration: number,
  ) {
    return new Promise((moveAnimationResolve) => {
      scene.tweens.add({
        targets: target,
        ease,
        duration,
        x,
        onComplete: moveAnimationResolve,
      });
    });
  }
}
