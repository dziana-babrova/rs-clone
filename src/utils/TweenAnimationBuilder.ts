export default class TweenAnimationBuilder {
  public async moveY(
    scene: Phaser.Scene,
    target: Phaser.GameObjects.Container | Phaser.GameObjects.Group,
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
    target: Phaser.GameObjects.Container,
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
}
