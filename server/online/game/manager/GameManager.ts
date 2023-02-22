import { GameObjects, Scene } from 'phaser';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import { Server } from 'socket.io';
import { ElementTypeKeys, Level } from '../../types/types';
import BallServer from '../components/BallServer';
import Cup from '../components/golf-course/Cup';
import Map from '../components/Map';
import PlayerServer from '../components/PlayerServer';
import { multiPlayerMap, targets } from '../const/MultiplayerLevels';
import { firstPlayerPosition, secondPlayerPosition } from '../const/PlayersPositions';
import ServerMapService from '../services/ServerMapService';

export default class GameManager {
  scene!: Scene;
  mapService!: ServerMapService;
  map!: Map;
  target!: Map;
  player1ball!: BallServer;
  player2ball!: BallServer;
  balls: BallServer[] = [];
  matterCollision!: PhaserMatterCollisionPlugin;
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

  constructor(
    scene: Scene,
    tileSize: number,
    matterCollision: PhaserMatterCollisionPlugin,
    server: Server,
    room: string,
  ) {
    this.scene = scene;
    this.matterCollision = matterCollision;
    this.mapService = new ServerMapService(tileSize);
    this.server = server;
    this.room = room;
    this.scene.game.events.on('ball-kick', this.handleKick.bind(this));
    this.scene.events.on('destroy-ball', (ball: BallServer) => {
      const candidate = this.balls.find((el) => el.id === ball.id);
      this.balls = this.balls.filter((el) => el !== candidate);
      candidate?.destroy();
    });
  }

  async createMap() {
    this.map = this.createTemplate(multiPlayerMap);
  }

  switchTarget(target = 0) {
    if (this.target) {
      this.target.each((el: Phaser.Physics.Matter.Sprite) => el.destroy());
    }
    this.target = this.createTemplate(targets[target]);
    this.server.to(this.room).emit('switch-target', targets[target]);
    this.getStartBalls();
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
    this.balls.push(this.player1ball, this.player2ball);
    this.server.to(this.room).emit('create-start-balls', this.serializeBalls());
    this.player1IsActive = true;
    this.player2IsActive = true;
    this.sendPlayersStatus();
  }

  initCollisions(ball: BallServer) {
    (ball.body as MatterJS.BodyType).setOnCollideWith(this.cup?.body as MatterJS.BodyType, () =>
      this.handleWin(ball),
    );
  }

  /* eslint-disable  no-param-reassign */
  /* eslint-disable  no-plusplus */
  handleWin(ball: BallServer) {
    // if (!this.isAvailable) return;
    this.isAvailable = false;
    if (ball.player === 1) {
      this.score1 += 1;
    }
    if (ball.player === 2) {
      this.score2 += 1;
    }
    if (this.score1 >= 5 || this.score2 >= 5) {
      this.isAvailable = false;
    } else {
      this.destroyElements();
      this.switchTarget(++this.currentTarget);
    }
  }
  /* eslint-enable  no-plusplus */
  /* eslint-enable  no-param-reassign */

  destroyElements() {
    this.balls.forEach((el) => {
      el.destroy();
    });
    this.balls = [];
    const { cup } = this;
    this.cup = null;
    cup?.destroy();
    this.server.to(this.room).emit('clear-field');
  }

  serializeBalls() {
    const textBalls = this.balls.map((el) => `${el.id}%${el.player}%${el.x}%${el.y}`);
    return textBalls.join('#');
  }

  getBallsChanges() {
    let changesString = '';
    this.balls.forEach((el) => {
      if (Math.abs(el.x - el.prevX) > 0.5 || Math.abs(el.y - el.prevY) > 0.5 || el.isNew) {
        changesString += `${el.id}%${el.player}%${el.x}%${el.y}#`;
      }
      el.updatePosition();
    });
    return changesString;
  }

  handleKick(data: { velocityX: number; velocityY: number; player: number }) {
    if (data.player === 1) {
      this.player1IsActive = false;
      this.sendPlayersStatus();
      this.player1ball.hitBall(data.velocityX, data.velocityY);
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
    this.server.to(this.room).emit('change-players-status', {
      player1: this.player1IsActive,
      player2: this.player2IsActive,
    });
  }

  delay(ms: number) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, ms);
    });
  }
}
