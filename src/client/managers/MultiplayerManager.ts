import { Scene } from 'phaser';
import { ElementTypeKeys } from 'common/types/enums';
import Ball from 'client/components/Ball';
import Map from 'client/scenes/game-scene/components/Map';
import { multiPlayerMap, targets } from 'client/const/levels/MultiplayerLevels';
import { Level } from 'common/types/types';
import TweenAnimationBuilder from 'client/utils/TweenAnimationBuilder';
import { animations, firstPlayerPosition, secondPlayerPosition } from 'client/const/scenes/MultiplayerSceneConsts';
import Cup from 'client/scenes/game-scene/components/golf-course/Cup';
import Flag from 'client/scenes/game-scene/components/Flag';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import HoleBar from 'client/scenes/game-scene/components/golf-course/HoleBar';
import MapService from 'client/services/MapService';
import ScorePanel from '../scenes/multiplayer-scene/components/ScorePanel';
import Player from '../scenes/multiplayer-scene/components/Player';

export default class MultiplayerManager extends Phaser.GameObjects.Container {
  scene: Scene;

  mapService: MapService;

  map!: Map;

  target!: Map;

  cup!: Cup | null;

  flag!: Flag;

  bar!: HoleBar;

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

  async createMap(): Promise<void> {
    this.map = await this.createTemplate(multiPlayerMap);
    this.map.setDepth(50);
    await this.map.animate();
  }

  async switchTarget(target = 0): Promise<void> {
    if (this.target) {
      this.bar.destroy();
      await this.hideTarget();
      this.target.each((el: Phaser.Physics.Matter.Sprite) => el.destroy());
    }
    this.target = await this.createTemplate(targets[target]);
    await this.showTarget();
    this.bar = new HoleBar(this.scene, {
      x: this.flag.x - 20, y: this.flag.y + 45, texture: 'hole-grass.png', type: ElementTypeKeys.Flag,
    });
    this.bar.setDepth(300);
    if (target > 0) {
      this.player1.currentBall?.setDepth(100);
      this.player2.currentBall?.setDepth(100);
      this.initCollisions(this.player1.currentBall!, this.player1);
      this.initCollisions(this.player2.currentBall!, this.player2);
      this.isAvailable = true;
    }
  }

  async createTemplate(level: Level): Promise<Map> {
    const mapElements = this.mapService.createLevelConfig(level.map);
    const template = this.mapService.createMap(this.scene, mapElements);
    template.setDepth(40);
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

  async hideTarget(): Promise<void> {
    const { y, ease, duration } = animations.hideAnimation;
    await this.animationBuilder.moveY(this.scene, this.target, y, ease, duration);
  }

  async showTarget(): Promise<void> {
    const { y, ease, duration } = animations.showAnimation;
    await this.animationBuilder.moveY(this.scene, this.target, y, ease, duration);
  }

  public createPlayers(): void {
    this.player1 = new Player(
      this.scene,
      { x: firstPlayerPosition.x, y: firstPlayerPosition.y },
      false,
      1,
    );
    this.player2 = new Player(
      this.scene,
      { x: secondPlayerPosition.x, y: secondPlayerPosition.y },
      true,
      2,
    );
    this.initCollisions(this.player1.currentBall!, this.player1);
    this.initCollisions(this.player2.currentBall!, this.player2);
    this.initEvents();
  }

  private initEvents(): void {
    this.scene.input.keyboard.on('keydown-SPACE', this.handlePlayerClick.bind(this, this.player1));
    this.scene.input.keyboard.on('keydown-UP', this.handlePlayerClick.bind(this, this.player2));
  }

  async handlePlayerClick(player: Player): Promise<void> {
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

  private initCollisions(ball: Ball, player: Player): void {
    this.detectWin(this.cup!, ball, player);
  }

  private detectWin(
    objectA: Phaser.GameObjects.GameObject,
    objectB: Phaser.GameObjects.GameObject,
    player: Player,
  ): void {
    this.matterCollision.addOnCollideStart({
      objectA,
      objectB,
      callback: this.handleWin.bind(this, player),
    });
  }

  /* eslint-disable  no-param-reassign */
  /* eslint-disable  no-plusplus */
  private handleWin(player: Player): void {
    if (!this.isAvailable) return;
    this.isAvailable = false;
    player.score += 1;
    if (player.id === 1) {
      this.score.changeFirstScore(this.player1.score.toString());
    }
    if (player.id === 2) {
      this.score.changeSecondScore(this.player2.score.toString());
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
  private showWinPopup(player: Player): void {
    console.log(`WIN${player.id}`);
  }

  private destroyElements(): void {
    this.player1.balls.clear(true, true);
    this.player2.balls.clear(true, true);
    this.flag.destroy();
    const { cup } = this;
    this.cup = null;
    cup?.destroy();
  }
}
