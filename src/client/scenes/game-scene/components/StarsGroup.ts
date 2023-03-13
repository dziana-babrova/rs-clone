import Phaser from 'phaser';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import { TextureKeys } from 'common/types/enums';
import TweenAnimationBuilder from 'client/utils/TweenAnimationBuilder';
import { GAME_SCENE_ANIMATION } from 'client/const/scenes/GameSceneConsts';
import { LevelElements } from 'common/types/types';
import { textures } from 'client/const/TileConfig';

export default class StarsGroup extends Phaser.GameObjects.Group {
  tweenAnimationBuilder: TweenAnimationBuilder;

  matterCollision!: PhaserMatterCollisionPlugin;

  constructor(scene: Phaser.Scene, tiles: LevelElements[]) {
    super(scene);
    this.tweenAnimationBuilder = new TweenAnimationBuilder();
    tiles.forEach((tile) => {
      this.create(tile.x, tile.y, textures.star);
    });
    this.scene.add.existing(this);
  }

  public create(x: number, y: number, texture: string): void {
    const shapes = this.scene.cache.json.get('star');
    const starBody = this.scene.matter.add.fromPhysicsEditor(x, y, shapes.star, undefined, false);
    const tile = this.scene.matter.add
      .sprite(x, y, TextureKeys.Platforms, texture)
      .setScale(0);

    tile.setBody(
      { width: tile.width, height: tile.height },
      {
        vertices: starBody.vertices,
        isSensor: true,
        isStatic: true,
      },
    );
    tile.setTexture(TextureKeys.Platforms, texture);
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
