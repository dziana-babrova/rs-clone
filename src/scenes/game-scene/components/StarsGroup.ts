import Phaser from 'phaser';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import { TextureKeys } from 'types/enums';
import TweenAnimationBuilder from 'utils/TweenAnimationBuilder';
import { GAME_SCENE_ANIMATION } from 'const/Animations';
import { LevelElements } from 'types/types';

export default class StarsGroup extends Phaser.GameObjects.Group {
  tweenAnimationBuilder: TweenAnimationBuilder;

  matterCollision!: PhaserMatterCollisionPlugin;

  constructor(scene: Phaser.Scene, tiles: LevelElements[]) {
    super(scene);
    this.tweenAnimationBuilder = new TweenAnimationBuilder();
    tiles.forEach((tile) => {
      this.create(tile.x, tile.y, 'star.png');
    });
    this.scene.add.existing(this);
  }

  public create(x: number, y: number, texture: string): void {
    const tile = this.scene.matter.add.image(x, y, texture, undefined).setScale(0);

    tile.setTexture(TextureKeys.Platforms, texture);

    tile.setBody(
      {
        width: 41,
        height: 41,
      },
      {
        isStatic: true,
        isSensor: true,
      },
    );

    this.add(tile);
  }

  public async scale(): Promise<void> {
    const { duration, scale } = GAME_SCENE_ANIMATION.scaleToBig;
    const stars = this.getChildren();
    await this.tweenAnimationBuilder.scaleToBig(this.scene, stars[0], duration, scale);
    await this.tweenAnimationBuilder.scaleToBig(this.scene, stars[1], duration, scale);
    await this.tweenAnimationBuilder.scaleToBig(this.scene, stars[2], duration, scale);
  }
}
