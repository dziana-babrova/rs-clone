import { Scene } from 'phaser';
import ElementTypeKeys from 'const/ElementTypeKeys';
import MapService from 'services/MapService';
import Ball from 'components/Ball';
import Trajectory from 'components/Trajectory';
import MultiplayerService from 'services/MultiplayerService';
import Map from 'scenes/game-scene/components/Map';
import { multiPlayerMap, position1, position2, targets } from 'const/Multiplayer';
import { IComponentManager, Level, Position } from 'types/types';
import { Template } from 'webpack';
import TweenAnimationBuilder from 'utils/TweenAnimationBuilder';
import MULTIPLAYER_ANIMATION from 'const/MultiplayerAnimation';
import { Body } from 'matter';
import Player from './Player';

export default class MultiplayerManager extends Phaser.GameObjects.Container {

  scene: Scene;

  mapService: MultiplayerService;

  map!: Map;

  target!: Map;

  animationBuilder: TweenAnimationBuilder;

  player1!: Player;
  player2!: Player;

  constructor(scene: Scene, tileSize: number) {
    super(scene);
    this.mapService = new MultiplayerService(tileSize);
    this.animationBuilder = new TweenAnimationBuilder();
    this.scene = scene;
    this.initEvents();
  }

  async createMap() {
    this.map = this.createTemplate(multiPlayerMap);
    await this.map.animate();
  }

  async switchTarget(target: number) {
    if (this.target) {
      await this.hideTarget();
      this.target.each((el: Phaser.Physics.Matter.Sprite) => el.destroy());
    }
    this.target = this.createTemplate(targets[target]);
    await this.showTarget();
  }

  private createTemplate(level: Level) {
    const mapElements = this.mapService.createLevelConfig(level);
    const groundConfig = mapElements.filter((el) => el.type === ElementTypeKeys.Tile);
    const leftSlopeConfig = mapElements.filter((el) => el.type === ElementTypeKeys.LeftSlope);
    const rightSlopeConfig = mapElements.filter((el) => el.type === ElementTypeKeys.RightSlope);
    const holeConfig = mapElements.filter(
      (el) => el.type === ElementTypeKeys.Hole || el.type === ElementTypeKeys.HoleWithCoin,
    );

    const starsConfig = mapElements.filter(
      (el) => el.type === ElementTypeKeys.Star || el.type === ElementTypeKeys.HoleWithCoin,
    );
    const ballConfig = mapElements.filter((el) => el.type === ElementTypeKeys.Ball);

    const template = new Map(
      this.scene,
      groundConfig,
      leftSlopeConfig,
      rightSlopeConfig,
      holeConfig,
    );
    return template;
  }

  async hideTarget() {
    const { y, ease, duration } = MULTIPLAYER_ANIMATION.hideAnimation;
    await this.animationBuilder.moveY(this.scene, this.target, y, ease, duration);
  }

  async showTarget() {
    const { y, ease, duration } = MULTIPLAYER_ANIMATION.showAnimation;
    await this.animationBuilder.moveY(this.scene, this.target, y, ease, duration);
  }

  createPlayers(){
    this.player1 = new Player(this.scene, { x: position1.x, y: position1.y }, false);
    this.player2 = new Player(this.scene, { x: position2.x, y: position2.y }, true);
  }

  initEvents(){
    this.scene.input.keyboard.on('keydown-SPACE', this.handlePlayer1Click.bind(this));
    this.scene.input.keyboard.on('keydown-UP', this.handlePlayer2Click.bind(this));
  }

  handlePlayer1Click(){
    if (!this.player1.isAvailable) return;
    if (!this.player1.isHit) {
      this.player1.fixAngle();
      this.player1.showPower();
    } else {
      this.player1.fixPower();
      this.player1.hit();
    }
  }

  handlePlayer2Click(){
    if (!this.player2.isAvailable) return;
    if (!this.player2.isHit) {
      this.player2.fixAngle();
      this.player2.showPower();
    } else {
      this.player2.fixPower();
      this.player2.hit();
    }
  }

}
