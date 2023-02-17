import { Scene } from 'phaser';
import { ElementTypeKeys } from 'types/enums';
import MapService from 'services/MapService';
import Ball from 'components/Ball';
import Trajectory from 'components/Trajectory';
import MultiplayerService from 'services/MultiplayerService';
import Map from 'scenes/game-scene/components/Map';
import { multiPlayerMap, targets } from 'const/MultiplayerLevels';
import { IComponentManager, Level, Position } from 'types/types';
import { Template } from 'webpack';
import TweenAnimationBuilder from 'utils/TweenAnimationBuilder';
import { MULTIPLAYER_ANIMATION } from 'const/Animations';
import { Body } from 'matter';
import Player from './Player';
import ScorePanel from './ScorePanel';
import Cup from 'scenes/game-scene/components/golf-course/Cup';
import Flag from 'scenes/game-scene/components/Flag';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import { position1, position2 } from 'const/MutiplayerSceneConsts';

export default class MultiplayerManager extends Phaser.GameObjects.Container {
  scene: Scene;

  mapService: MultiplayerService;

  map!: Map;

  target!: Map;

  cup!: Cup | null;

  flag!: Flag;

  animationBuilder: TweenAnimationBuilder;

  player1!: Player;
  player2!: Player;
  matterCollision!: PhaserMatterCollisionPlugin;
  isAvailable = true;
  currentTarget = 0;
  score: ScorePanel;

  constructor(scene: Scene, tileSize: number, matterCollision: PhaserMatterCollisionPlugin) {
    super(scene);
    this.matterCollision = matterCollision;
    this.mapService = new MultiplayerService(tileSize);
    this.animationBuilder = new TweenAnimationBuilder();
    this.scene = scene;
    this.initEvents();
    this.score = new ScorePanel(scene, { x: scene.cameras.main.centerX - 25, y: 0 });
  }

  async createMap() {
    this.map = await this.createTemplate(multiPlayerMap);
    await this.map.animate();
  }

  async switchTarget(target = 0) {
    if (this.target) {
      await this.hideTarget();
      this.target.each((el: Phaser.Physics.Matter.Sprite) => el.destroy());
    }
    this.target = await this.createTemplate(targets[target]);
    await this.showTarget();
    if (target > 0) {
      this.player1.currentBall?.setDepth(100);
      this.initCollisions(this.player1.currentBall!, this.player1);
      this.initCollisions(this.player2.currentBall!, this.player1);
      this.isAvailable = true;
    }
  }

  async createTemplate(level: Level) {
    const mapElements = this.mapService.createLevelConfig(level);
    const groundConfig = this.mapService.getFilteredElements(mapElements, ElementTypeKeys.Tile);
    const leftSlopeConfig = this.mapService.getFilteredElements(
      mapElements,
      ElementTypeKeys.LeftSlope,
    );
    const rightSlopeConfig = this.mapService.getFilteredElements(
      mapElements,
      ElementTypeKeys.RightSlope,
    );
    const holeConfig = this.mapService.getFilteredElements(
      mapElements,
      ElementTypeKeys.Hole,
      ElementTypeKeys.HoleWithCoin,
      ElementTypeKeys.Flag,
      ElementTypeKeys.Cup,
    );
    const starsConfig = this.mapService.getFilteredElements(
      mapElements,
      ElementTypeKeys.Star,
      ElementTypeKeys.HoleWithCoin,
    );
    const ballConfig = this.mapService.getFilteredElements(mapElements, ElementTypeKeys.Ball);
    const flagConfig = this.mapService.getFilteredElements(mapElements, ElementTypeKeys.Flag);
    const cupConfig = this.mapService.getFilteredElements(mapElements, ElementTypeKeys.Cup);

    const template = new Map(
      this.scene,
      groundConfig,
      leftSlopeConfig,
      rightSlopeConfig,
      holeConfig,
    );
    if (cupConfig.length) {
      this.cup = new Cup(this.scene, cupConfig[0]);
    }

    if (cupConfig.length) {
      this.flag = new Flag(this.scene, flagConfig[0].x, flagConfig[0].y);
      await this.flag.animate();
    }
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

  createPlayers() {
    this.player1 = new Player(this.scene, { x: position1.x, y: position1.y }, false, 1);
    this.player2 = new Player(this.scene, { x: position2.x, y: position2.y }, true, 2);
    this.initCollisions(this.player1.currentBall!, this.player1);
    this.initCollisions(this.player2.currentBall!, this.player2);
  }

  initEvents() {
    this.scene.input.keyboard.on('keydown-SPACE', this.handlePlayer1Click.bind(this));
    this.scene.input.keyboard.on('keydown-UP', this.handlePlayer2Click.bind(this));
  }

  async handlePlayer1Click() {
    if (!this.player1.isAvailable) return;
    if (!this.player1.isHit) {
      this.player1.fixAngle();
      this.player1.showPower();
    } else {
      this.player1.fixPower();
      await this.player1.hit();
      this.initCollisions(this.player1.currentBall!, this.player1);
    }
  }

  async handlePlayer2Click() {
    if (!this.player2.isAvailable) return;
    if (!this.player2.isHit) {
      this.player2.fixAngle();
      this.player2.showPower();
    } else {
      this.player2.fixPower();
      await this.player2.hit();
      this.initCollisions(this.player2.currentBall!, this.player2);
    }
  }

  initCollisions(ball: Ball, player: Player) {
    this.detectWin(this.cup!, ball, player);
  }

  private detectWin(
    objectA: Phaser.GameObjects.GameObject,
    objectB: Phaser.GameObjects.GameObject,
    player: Player,
  ) {
    this.matterCollision.addOnCollideStart({
      objectA,
      objectB,
      callback: this.handleWin.bind(this, player),
    });
  }

  handleWin(player: Player) {
    if (!this.isAvailable) return;
    this.isAvailable = false;
    player.score += 1;
    if (player === this.player1) {
      this.score.changeText1(this.player1.score.toString());
    }
    if (player === this.player2) {
      this.score.changeText1(this.player2.score.toString());
    }
    if (player.score >= 5) {
      this.player1.isAvailable = false;
      this.player2.isAvailable = false;
      this.showWinPopup(player);
    } else {
      this.destroyElements();
      this.switchTarget(++this.currentTarget);
    }
  }

  //ToDo Add winner popup
  showWinPopup(player: Player) {
    console.log('WIN' + player.id);
  }

  destroyElements() {
    this.player1.balls.clear(true, true);
    this.player2.balls.clear(true, true);
    this.flag.destroy();
    const cup = this.cup;
    this.cup = null;
    cup?.destroy();
  }
}
