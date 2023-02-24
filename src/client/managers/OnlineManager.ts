import { GameObjects, Scene } from 'phaser';
import { ElementTypeKeys } from 'common/types/enums';
import Ball from 'client/components/Ball';
import Map from 'client/scenes/game-scene/components/Map';
import { multiPlayerMap } from 'client/const/levels/MultiplayerLevels';
import { IPlayerInfo, Level, ScoreMessage, ServerBalls, StatusMessage } from 'common/types/types';
import TweenAnimationBuilder from 'client/utils/TweenAnimationBuilder';
import {
  animations,
  playerProps,
  powerIndicatorProps,
} from 'client/const/scenes/MultiplayerSceneConsts';
import Cup from 'client/scenes/game-scene/components/golf-course/Cup';
import Flag from 'client/scenes/game-scene/components/Flag';
import HoleBar from 'client/scenes/game-scene/components/golf-course/HoleBar';
import MapService from 'client/services/MapService';
import PlayerEnemy from 'client/scenes/multiplayer-scene/components/PlayerEnemy';
import { Socket } from 'socket.io-client';
import CalculateService from 'client/services/CalculateService';
import SocketService from 'client/services/SocketService';
import Player from '../scenes/multiplayer-scene/components/Player';
import ScorePanel from '../scenes/multiplayer-scene/components/ScorePanel';
import Count from 'client/scenes/online-scene/components/Count';

export default class OnlineManager extends Phaser.GameObjects.Container {
  socket: Socket;

  scene: Scene;

  mapService: MapService;

  socketService: SocketService;

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

  waitingMessage: GameObjects.Text | null = null;

  constructor(scene: Scene, tileSize: number, socket: Socket, socketService: SocketService) {
    super(scene);
    this.socket = socket;
    this.socketService = socketService;
    this.mapService = new MapService(tileSize);
    this.animationBuilder = new TweenAnimationBuilder();
    this.scene = scene;
    this.score = new ScorePanel(scene, { x: scene.cameras.main.centerX - 25, y: 0 });
    this.initEvents();
  }

  async createMap(map?: Level) {
    const mapTemplate = await this.createTemplate(map || multiPlayerMap);
    mapTemplate.setDepth(50);
    mapTemplate.y = 0;
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

  async hideTarget() {
    const { y, ease, duration } = animations.hideAnimation;
    await this.animationBuilder.moveY(this.scene, this.target, y, ease, duration);
  }

  async showTarget() {
    const { y, ease, duration } = animations.showAnimation;
    await this.animationBuilder.moveY(this.scene, this.target, y, ease, duration);
  }

  updatePlayers(players: IPlayerInfo[]) {
    players.forEach((el) => {
      if (el.socketId === this.socket.id && !this.currentPlayer) {
        this.currentPlayer = new Player(
          this.scene,
          { x: el.position.x, y: el.position.y },
          el.idReverse,
          el.id,
        );
        this.currentPlayer.isAvailable = false;
        this.currentPlayer.trajectory.stop();
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
    if (players.length === 1) {
      this.showWaitingMessage();
    } else {
      this.waitingMessage?.destroy();
      this.showCount();
    }
  }

  deletePlayer(players: IPlayerInfo[]) {
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
    const arr = balls.split('#');
    arr.pop();
    return arr.reduce((acc, el) => {
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

  mapServerBallsToBalls(serverBalls: ServerBalls) {
    const balls: { [key: string]: Ball } = {};
    Object.entries(serverBalls).forEach((el) => {
      const ball = new Ball(this.scene, { x: Number(el[1].x), y: Number(el[1].y) });
      if (el[1].player === '2') {
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
        if (el[1].player === '2') {
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
      this.socketService.emitHitBall(velocityX, velocityY, this.currentPlayer.id);
      this.currentPlayer.isAvailable = false;
      this.currentPlayer.isHit = false;
    }
  }

  // ToDo Add winner popup
  showWinPopup(score: ScoreMessage) {
    console.log('WINNER!!!');
    let text;
    if (score.score1 >= 5) text = 'First player win!';
    if (score.score2 >= 5) text = 'Second player win!';
    console.log(text);
  }

  clearField() {
    this.flag.destroy();
    const { cup } = this;
    this.cup = null;
    cup?.destroy();
    Object.values(this.balls).forEach((el) => el.destroy());
    this.balls = {};
  }

  updateStatus(status: StatusMessage) {
    this.currentPlayer.isAvailable = this.currentPlayer.id === 1 ? status.player1 : status.player2;
    if (this.currentPlayer.isAvailable) this.currentPlayer.trajectory.resume();
  }

  updateScore(score: ScoreMessage) {
    this.score.changeText1(String(score.score1));
    this.score.changeText2(String(score.score2));
  }

  createPlayerAnimation(player: number) {
    if (player === this.currentPlayer.id) {
      this.currentPlayer.character.hit();
    } else {
      this.enemy?.character.hit();
    }
  }

  showWaitingMessage() {
    this.waitingMessage = this.scene.add.text(
      this.scene.cameras.main.centerX - 25,
      this.scene.cameras.main.centerY,
      'Waiting for second player.',
    );
    this.waitingMessage.setOrigin(0.5);
  }

  async showCount() {
    const position = { x: this.scene.cameras.main.centerX - 25, y: this.scene.cameras.main.centerY };
    const textArr = ['3', '2', '1', 'GO!'];
    for (let i = 0; i < textArr.length; i += 1){
      const count = new Count(this.scene, position, textArr[i]);
      await count.animate();
      count.destroy();
    }
    this.isAvailable = true;
  }
}