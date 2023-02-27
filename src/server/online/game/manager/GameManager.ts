import { Scene } from 'phaser';
import { Server } from 'socket.io';
import { ElementTypeKeys } from '../../../../common/types/enums';
import { ServerSideEvents } from '../../../../common/types/events';
import { Level } from '../../../../common/types/types';
import BallServer from '../components/BallServer';
import Cup from '../components/golf-course/Cup';
import Map from '../components/Map';
import { multiPlayerMap, targets } from '../const/MultiplayerLevels';
import { firstPlayerPosition, secondPlayerPosition } from '../const/OnlineGameProps';
import ServerEventsService from '../services/ServerEventsService';
import ServerMapService from '../services/ServerMapService';

/* eslint-disable  no-plusplus */
export default class GameManager {
  scene!: Scene;

  mapService!: ServerMapService;

  socketService: ServerEventsService;

  map!: Map;

  target!: Map;

  player1ball!: BallServer;

  player2ball!: BallServer;

  balls: BallServer[] = [];

  isAvailable = false;

  cup!: Cup | null;

  currentTarget = 0;

  score1 = 0;

  score2 = 0;

  server: Server;

  room: string;

  ballId = 0;

  player1IsActive = false;

  player2IsActive = false;

  constructor(scene: Scene, tileSize: number, server: Server, room: string) {
    this.scene = scene;
    this.mapService = new ServerMapService(tileSize);
    this.socketService = new ServerEventsService(server, room);
    this.server = server;
    this.room = room;
    this.scene.game.events.on(ServerSideEvents.HitBall, this.handleHit.bind(this));
    this.scene.events.on(ServerSideEvents.DestroyBall, this.destroyBall.bind(this));
  }

  async createMap() {
    this.map = this.createTemplate(multiPlayerMap);
  }

  async switchTarget(target = 0) {
    if (this.target) {
      this.target.each((el: Phaser.Physics.Matter.Sprite) => el.destroy());
    }
    this.target = this.createTemplate(targets[target]);
    this.socketService.emitSwitchTarget(targets[target]);
    if (target === 0) {
      await this.delay(3000);
      this.getStartBalls();
    } else {
      this.getStartBalls();
    }
    this.isAvailable = true;
  }

  createTemplate(level: Level) {
    const mapElements = this.mapService.createLevelConfig(level.map);
    const template = this.mapService.createMap(this.scene, mapElements);
    const cupConfig = this.mapService.getFilteredElements(mapElements, ElementTypeKeys.Cup);
    if (cupConfig.length) {
      this.cup = new Cup(this.scene, cupConfig[0]);
    }
    return template;
  }

  getStartBalls() {
    this.player1ball = new BallServer(this.scene, firstPlayerPosition, 1, this.ballId++);
    this.player2ball = new BallServer(this.scene, secondPlayerPosition, 2, this.ballId++);
    this.initCollisions(this.player1ball);
    this.initCollisions(this.player2ball);
    this.balls = [];
    this.balls.push(this.player1ball, this.player2ball);
    this.player1IsActive = true;
    this.player2IsActive = true;
    this.sendPlayersStatus();
  }

  initCollisions(ball: BallServer) {
    (ball.body as MatterJS.BodyType).setOnCollideWith(
      this.cup?.body as MatterJS.BodyType,
      () => this.handleWin(ball),
    );
  }

  /* eslint-disable  no-param-reassign */
  handleWin(ball: BallServer) {
    if (!this.isAvailable) return;
    this.isAvailable = false;
    if (ball.player === 1) {
      this.score1 += 1;
    }
    if (ball.player === 2) {
      this.score2 += 1;
    }
    if (this.score1 >= 5) {
      this.isAvailable = false;
      this.socketService.emitGameOver(1);
    } else if (this.score2 >= 5) {
      this.isAvailable = false;
      this.socketService.emitGameOver(2);
    } else {
      this.socketService.emitPlayersScore({ score1: this.score1, score2: this.score2 });
      this.destroyElements();
      this.switchTarget(++this.currentTarget);
    }
  }

  /* eslint-enable  no-param-reassign */
  destroyElements() {
    this.balls.forEach((el) => {
      el.destroy();
    });
    this.balls = [];
    const { cup } = this;
    this.cup = null;
    cup?.destroy();
    this.socketService.emitClearField();
  }

  getBallsChanges() {
    let changesString = '';
    this.balls.forEach((el) => {
      if (Math.abs(el.x - el.prevX) > 0.5 || Math.abs(el.y - el.prevY) > 0.5 || el.isNew) {
        changesString += `${el.id}%${el.player}%${Math.round(el.x).toString(36)}%${Math.round(el.y).toString(36)}#`;
      }
      el.updatePosition();
    });
    return changesString;
  }

  handleHit(data: { velocityX: number; velocityY: number; player: number }) {
    if (data.player === 1) {
      this.player1IsActive = false;
      this.sendPlayersStatus();
      this.player1ball.hitBall(data.velocityX, data.velocityY);
      this.socketService.emitPlayerHit(1);
      this.delay(1000).then(() => {
        this.player1ball = new BallServer(this.scene, firstPlayerPosition, 1, this.ballId++);
        this.initCollisions(this.player1ball);
        this.balls.push(this.player1ball);
        this.player1IsActive = true;
        this.sendPlayersStatus();
      });
    }
    if (data.player === 2) {
      this.player2IsActive = false;
      this.sendPlayersStatus();
      this.player2ball.hitBall(-data.velocityX, data.velocityY);
      this.socketService.emitPlayerHit(2);
      this.delay(1000).then(() => {
        this.player2ball = new BallServer(this.scene, secondPlayerPosition, 2, this.ballId++);
        this.initCollisions(this.player2ball);
        this.balls.push(this.player2ball);
        this.player2IsActive = true;
        this.sendPlayersStatus();
      });
    }
  }

  sendPlayersStatus() {
    this.socketService.emitPlayersStatus({
      player1: this.player1IsActive,
      player2: this.player2IsActive,
    });
  }

  destroyBall(ball: BallServer) {
    const candidate = this.balls.find((el) => el.id === ball.id);
    this.balls = this.balls.filter((el) => el.id !== ball.id);
    candidate?.destroy();
  }

  delay(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
