import { Scene } from 'phaser';
import { ElementTypeKeys } from 'types/enums';
import Ball from 'components/Ball';
import Map from 'scenes/game-scene/components/Map';
import { multiPlayerMap, targets } from 'const/levels/MultiplayerLevels';
import { Level } from 'types/types';
import TweenAnimationBuilder from 'utils/TweenAnimationBuilder';
import {
  animations,
  firstPlayerPosition,
  playerProps,
  powerIndicatorProps,
  secondPlayerPosition,
} from 'const/scenes/MultiplayerSceneConsts';
import Cup from 'scenes/game-scene/components/golf-course/Cup';
import Flag from 'scenes/game-scene/components/Flag';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import HoleBar from 'scenes/game-scene/components/golf-course/HoleBar';
import MapService from 'services/MapService';
import ScorePanel from '../scenes/multiplayer-scene/components/ScorePanel';
import Player from '../scenes/multiplayer-scene/components/Player';
import PlayerServer from '../../server/online/game/components/PlayerServer';
import PlayerEnemy from 'scenes/multiplayer-scene/components/PlayerEnemy';
import e from 'express';
import { Socket } from 'socket.io-client';
import CalculateService from 'services/CalculateService';

export default class OnlineManager extends Phaser.GameObjects.Container {
  socket: Socket;
  scene: Scene;

  mapService: MapService;

  map!: Map;

  target!: Map;

  cup!: Cup | null;

  flag!: Flag;

  bar!: HoleBar;

  animationBuilder: TweenAnimationBuilder;

  enemy!: PlayerEnemy | null;

  currentPlayer!: Player;

  isAvailable = false;

  currentTarget = 0;

  score: ScorePanel;

  balls: { [key: string]: Ball } = {};

  constructor(scene: Scene, tileSize: number, socket: Socket) {
    super(scene);
    this.socket = socket;
    this.mapService = new MapService(tileSize);
    this.animationBuilder = new TweenAnimationBuilder();
    this.scene = scene;
    this.score = new ScorePanel(scene, { x: scene.cameras.main.centerX - 25, y: 0 });
    this.initEvents();
  }

  async createMap(map?: Level) {
    this.map = await this.createTemplate(map || multiPlayerMap);
    await this.map.animate();
  }

  async switchTarget(target: Level) {
    if (this.target) {
      this.bar.destroy();
      await this.hideTarget();
      this.target.each((el: Phaser.Physics.Matter.Sprite) => el.destroy());
    }
    this.target = await this.createTemplate(target);
    await this.showTarget();
    this.bar = new HoleBar(this.scene, {
      x: this.flag.x - 20,
      y: this.flag.y + 45,
      texture: 'hole-grass.png',
      type: ElementTypeKeys.Flag,
    });
    this.bar.setDepth(300);
    this.isAvailable = true;
  }

  async createTemplate(level: Level) {
    const mapElements = this.mapService.createLevelConfig(level.map);
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

  updatePlayers(players: PlayerServer[]) {
    players.forEach((el) => {
      console.log(el.socketId, this.socket.id);
      if (el.socketId === this.socket.id && !this.currentPlayer) {
        this.currentPlayer = new Player(
          this.scene,
          { x: el.position.x, y: el.position.y },
          el.idReverse,
          el.id,
        );
        this.currentPlayer.currentBall?.destroy();
      } else if (el.socketId !== this.socket.id) {
        this.enemy = new PlayerEnemy(
          this.scene,
          { x: el.position.x, y: el.position.y },
          el.idReverse,
          el.id,
        );
      }
    });
  }

  deletePlayer(players: PlayerServer[]) {
    if (!players.find((el) => el.id === this.enemy?.id)) {
      this.enemy?.character.destroy();
      this.enemy = null;
    }
  }

  setStartBalls(balls: string) {
    const serverBalls = this.deserializeBalls(balls);
    this.balls = this.mapServerBallsToBalls(serverBalls);
    this.currentPlayer.isAvailable = true;
  }

  deserializeBalls(balls: string) {
    const init: { [key: string]: { player: string; x: string; y: string } } = {};
    return balls.split('#').reduce((acc, el) => {
      const elems = el.split('%');
      const id = elems[0];
      init[id] = {
        player: elems[1],
        x: elems[2],
        y: elems[3],
      };
      return init;
    }, init);
  }

  removeBalls() {
    Object.values(this.balls).forEach((el) => el.destroy());
  }

  mapServerBallsToBalls(serverBalls: { [key: string]: { player: string; x: string; y: string } }) {
    const balls: { [key: string]: Ball } = {};
    Object.entries(serverBalls).forEach((el) => {
      const ball = new Ball(this.scene, { x: Number(el[1].x), y: Number(el[1].y) });
      if (el[1].player == '2') {
        ball.setTint(playerProps.secondBallColor);
      }
      ball.setDepth(100);
      (ball.body as MatterJS.BodyType).isStatic = true;
      (ball.body as MatterJS.BodyType).circleRadius = 0;
      const id = el[0];
      balls[id] = ball;
    });
    return balls;
  }

  updateBalls(balls: string) {
    const serverBalls = this.deserializeBalls(balls);
    Object.entries(serverBalls).forEach((el) => {
      const target = this.balls[el[0]];
      if (target) {
        target.x = Number(el[1].x);
        target.y = Number(el[1].y);
      } else {
        const ball = new Ball(this.scene, { x: Number(el[1].x), y: Number(el[1].y) });
        if (el[1].player == '2') {
          ball.setTint(playerProps.secondBallColor);
        }
        ball.setDepth(100);
        (ball.body as MatterJS.BodyType).isStatic = true;
        (ball.body as MatterJS.BodyType).circleRadius = 0;
        const id = el[0];
        this.balls[id] = ball;
      }
    });
  }

  initEvents() {
    this.scene.input.keyboard.on('keydown-SPACE', this.handlePlayerClick.bind(this));
  }

  async handlePlayerClick() {
    console.log(this.currentPlayer.isAvailable);
    if (!this.currentPlayer.isAvailable) return;
    if (!this.currentPlayer.isHit) {
      this.currentPlayer.fixAngle();
      this.currentPlayer.showPower();
    } else {
      this.currentPlayer.fixPower();
      const { angle } = this.currentPlayer.trajectory;
      const power = this.currentPlayer.powerPanel.indicator.width / powerIndicatorProps.width;
      const { velocityX, velocityY } = CalculateService.calculateVelocityByAngleInDegreesAndPower(
        -Math.abs(angle),
        power,
      );
      this.socket.emit('hit-ball', { velocityX, velocityY, player: this.currentPlayer.id });
      this.currentPlayer.isAvailable = false;
      this.currentPlayer.isHit = false;
    }
  }

  // ToDo Add winner popup
  showWinPopup(player: Player) {
    console.log(`WIN${player.id}`);
  }

  clearField() {
    this.flag.destroy();
    const { cup } = this;
    this.cup = null;
    cup?.destroy();
    Object.values(this.balls).forEach(el => el.destroy());
    this.balls = {};
  }

  updateStatus(status: {player1: boolean, player2: boolean}){
    this.currentPlayer.isAvailable = this.currentPlayer.id === 1 ? status.player1 : status.player2;
    if (this.currentPlayer.isAvailable) this.currentPlayer.trajectory.resume();
  }
}
