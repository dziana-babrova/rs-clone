import { Scene } from 'phaser';
import { ElementTypeKeys } from 'types/enums';
import Ball from 'components/Ball';
import Map from 'scenes/game-scene/components/Map';
import { multiPlayerMap, targets } from 'const/levels/MultiplayerLevels';
import { Level } from 'types/types';
import TweenAnimationBuilder from 'utils/TweenAnimationBuilder';
import { animations, position1, position2 } from 'const/scenes/MultiplayerSceneConsts';
import Cup from 'scenes/game-scene/components/golf-course/Cup';
import Flag from 'scenes/game-scene/components/Flag';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import MapService from 'services/MapService';
import ScorePanel from '../scenes/multiplayer-scene/components/ScorePanel';
import Player from '../scenes/multiplayer-scene/components/Player';

export default class MultiplayerManager extends Phaser.GameObjects.Container {
  scene: Scene;

  mapService: MapService;

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
    this.mapService = new MapService(tileSize);
    this.animationBuilder = new TweenAnimationBuilder();
    this.scene = scene;
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
      this.player2.currentBall?.setDepth(100);
      this.initCollisions(this.player1.currentBall!, this.player1);
      this.initCollisions(this.player2.currentBall!, this.player2);
      this.isAvailable = true;
    }
  }

  async createTemplate(level: Level) {
    const mapElements = this.mapService.createLevelConfig(level);
    const template = this.mapService.createMap(this.scene, mapElements);
    const flagConfig = this.mapService.getFilteredElements(mapElements, ElementTypeKeys.Flag);
    const cupConfig = this.mapService.getFilteredElements(mapElements, ElementTypeKeys.Cup);
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
    const { y, ease, duration } = animations.hideAnimation;
    await this.animationBuilder.moveY(this.scene, this.target, y, ease, duration);
  }

  async showTarget() {
    const { y, ease, duration } = animations.showAnimation;
    await this.animationBuilder.moveY(this.scene, this.target, y, ease, duration);
  }

  createPlayers() {
    this.player1 = new Player(this.scene, { x: position1.x, y: position1.y }, false, 1);
    this.player2 = new Player(this.scene, { x: position2.x, y: position2.y }, true, 2);
    this.initCollisions(this.player1.currentBall!, this.player1);
    this.initCollisions(this.player2.currentBall!, this.player2);
    this.initEvents();
  }

  initEvents() {
    this.scene.input.keyboard.on('keydown-SPACE', this.handlePlayerClick.bind(this, this.player1));
    this.scene.input.keyboard.on('keydown-UP', this.handlePlayerClick.bind(this, this.player2));
  }

  async handlePlayerClick(player: Player) {
    if (!player.isAvailable) return;
    if (!player.isHit) {
      player.fixAngle();
      player.showPower();
    } else {
      player.fixPower();
      await player.hit();
      this.initCollisions(player.currentBall!, player);
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

  /* eslint-disable  no-param-reassign */
  /* eslint-disable  no-plusplus */
  handleWin(player: Player) {
    if (!this.isAvailable) return;
    this.isAvailable = false;
    player.score += 1;
    if (player.id === 1) {
      this.score.changeText1(this.player1.score.toString());
    }
    if (player.id === 2) {
      this.score.changeText2(this.player2.score.toString());
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
  /* eslint-enable  no-plusplus */
  /* eslint-enable  no-param-reassign */

  // ToDo Add winner popup
  showWinPopup(player: Player) {
    console.log(`WIN${player.id}`);
  }

  destroyElements() {
    this.player1.balls.clear(true, true);
    this.player2.balls.clear(true, true);
    this.flag.destroy();
    const { cup } = this;
    this.cup = null;
    cup?.destroy();
  }
}
