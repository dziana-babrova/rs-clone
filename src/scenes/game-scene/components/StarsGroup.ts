import Phaser from 'phaser';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import TextureKeys from 'const/TextureKeys';
import ElementTypeKeys from 'const/ElementTypeKeys';
import TweenAnimationBuilder from 'utils/TweenAnimationBuilder';
import MapService from 'services/MapService';
import GAME_SCENE_ANIMATION from 'const/GameSceneAnimationConsts';

export default class StarsGroup extends Phaser.GameObjects.Group {
  tweenAnimationBuilder: TweenAnimationBuilder;

  mapService: MapService;

  matterCollision!: PhaserMatterCollisionPlugin;

  constructor(scene: Phaser.Scene, level: number, tileSize: number) {
    super(scene);
    this.tweenAnimationBuilder = new TweenAnimationBuilder();
    this.mapService = new MapService(level, tileSize);
    const stars = this.mapService.mapElements.filter(
      (el) => el.type === ElementTypeKeys.Star || el.type === ElementTypeKeys.HoleWithCoin,
    );

    stars.forEach((tile) => {
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
