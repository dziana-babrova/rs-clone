import { GameObjects, Scene } from 'phaser';
import { ElementTypeKeys } from 'common/types/enums';
import Ball from 'client/components/Ball';
import Map from 'client/scenes/game-scene/components/Map';
import { multiPlayerMap } from 'client/const/levels/MultiplayerLevels';
import {
  IPlayerInfo, Level, ScoreMessage, StatusMessage,
} from 'common/types/types';
import { countStrings, waitMessageStyle } from 'client/const/scenes/MultiplayerSceneConsts';
import Flag from 'client/scenes/game-scene/components/Flag';
import HoleBar from 'client/scenes/game-scene/components/golf-course/HoleBar';
import MapService from 'client/services/MapService';
import PlayerEnemy from 'client/scenes/multiplayer-scene/components/PlayerEnemy';
import { Socket } from 'socket.io-client';
import SocketService from 'client/services/SocketService';
import Count from 'client/scenes/online-scene/components/Count';
import LANGUAGE from 'client/const/Language';
import store from 'client/state/store';
import OnlineSceneService from 'client/services/OnlineSceneService';
import ScorePanel from '../scenes/multiplayer-scene/components/ScorePanel';
import Player from '../scenes/multiplayer-scene/components/Player';

export default class OnlineManager extends Phaser.GameObjects.Container {
  socket: Socket;

  mapService: MapService;

  socketService: SocketService;

  onlineService: OnlineSceneService;

  target!: Map;

  flag!: Flag;

  bar!: HoleBar;

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
    this.scene = scene;
    this.score = new ScorePanel(scene, { x: scene.cameras.main.centerX - 25, y: 0 });
    this.onlineService = new OnlineSceneService(this.scene);
    this.initEvents();
  }

  private initEvents(): void {
    this.scene.input.keyboard.on('keydown-SPACE', this.handlePlayerClick.bind(this));
  }

  async createMap(map?: Level): Promise<void> {
    const mapTemplate = await this.createTemplate(map || multiPlayerMap);
    mapTemplate.setDepth(50);
    mapTemplate.y = 0;
  }

  async switchTarget(target: Level): Promise<void> {
    if (this.target) {
      this.bar.destroy();
      await this.onlineService.hideTarget(this.target);
      this.target.each((el: Phaser.Physics.Matter.Sprite) => el.destroy());
    }
    this.target = await this.createTemplate(target);
    await this.onlineService.showTarget(this.target);
    this.bar = new HoleBar(this.scene, {
      x: this.flag.x - 20,
      y: this.flag.y + 45,
      texture: 'hole-grass.png',
      type: ElementTypeKeys.Flag,
    });
    this.bar.setDepth(300);
    this.isAvailable = true;
  }

  async createTemplate(level: Level): Promise<Map> {
    const mapElements = this.mapService.createLevelConfig(level.map);
    const template = this.mapService.createMap(this.scene, mapElements);
    template.setDepth(40);
    const flagConfig = this.mapService.getFilteredElements(mapElements, ElementTypeKeys.Flag);
    if (flagConfig.length) {
      this.flag = new Flag(this.scene, flagConfig[0].x, flagConfig[0].y);
      await this.flag.animate();
    }
    return template;
  }

  public updatePlayers(players: IPlayerInfo[]): void {
    players.forEach((el) => {
      const {
        socketId, position, isReverse, id,
      } = el;
      const { x, y } = position;
      if (socketId === this.socket.id && !this.currentPlayer) {
        this.currentPlayer = this.onlineService.createStaticPlayer({ x, y }, isReverse, id);
      } else if (socketId !== this.socket.id) {
        this.enemy = new PlayerEnemy(this.scene, { x, y }, isReverse, id);
      }
    });
    if (players.length === 1) this.showWaitingMessage();
    if (players.length > 1) {
      this.waitingMessage?.destroy();
      this.showCount();
    }
  }

  public deletePlayer(players: IPlayerInfo[]): void {
    if (!players.find((el) => el.id === this.enemy?.id)) {
      this.enemy?.character.destroy();
      this.enemy = null;
    }
  }

  public setStartBalls(balls: string): void {
    const serverBalls = this.onlineService.deserializeBalls(balls);
    this.balls = this.onlineService.mapServerBallsToBalls(serverBalls);
    this.currentPlayer.isAvailable = true;
  }

  public updateBalls(balls: string): void {
    this.onlineService.updateBalls(this.balls, balls);
  }

  async handlePlayerClick(): Promise<void> {
    if (!this.currentPlayer.isAvailable) return;
    if (!this.currentPlayer.isHit) {
      this.currentPlayer.fixAngle();
      this.currentPlayer.showPower();
    } else {
      this.currentPlayer.fixPower();
      const { velocityX, velocityY } = this.onlineService.getBallVelocity(this.currentPlayer);
      this.socketService.emitHitBall(velocityX, velocityY, this.currentPlayer.id);
      this.currentPlayer.isAvailable = false;
      this.currentPlayer.isHit = false;
    }
  }

  // ToDo Add winner popup
  public showWinPopup(score: ScoreMessage): void {
    let text;
    if (score.score1 >= 5) text = 'First player win!';
    if (score.score2 >= 5) text = 'Second player win!';
    console.log(text);
  }

  public clearField(): void {
    this.flag.destroy();
    Object.values(this.balls).forEach((el) => el.destroy());
    this.balls = {};
  }

  public updateStatus(status: StatusMessage): void {
    this.currentPlayer.isAvailable = this.currentPlayer.id === 1 ? status.player1 : status.player2;
    if (this.currentPlayer.isAvailable) this.currentPlayer.trajectory.resume();
  }

  public updateScore(score: ScoreMessage): void {
    this.score.changeFirstScore(String(score.score1));
    this.score.changeSecondScore(String(score.score2));
  }

  public createPlayerAnimation(player: number): void {
    if (player === this.currentPlayer.id) {
      this.currentPlayer.character.hit();
    } else {
      this.enemy?.character.hit();
    }
  }

  private showWaitingMessage(): void {
    this.waitingMessage = this.scene.add.text(
      this.scene.cameras.main.centerX - 25,
      this.scene.cameras.main.centerY,
      LANGUAGE.multiplayerScene.waitMessage[store.getState().app.lang],
      waitMessageStyle,
    );
    this.waitingMessage.setOrigin(0.5);
  }

  /* eslint-disable  no-await-in-loop */
  async showCount(): Promise<void> {
    const position = {
      x: this.scene.cameras.main.centerX - 25,
      y: this.scene.cameras.main.centerY,
    };
    for (let i = 0; i < countStrings.length; i += 1) {
      const count = new Count(this.scene, position, countStrings[i]);
      await count.animate();
      count.destroy();
    }
    this.isAvailable = true;
  }
  /* eslint-enable  no-await-in-loop */
}
