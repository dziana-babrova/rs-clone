import { SceneKeys } from 'types/enums';
import store from 'state/store';
import Background from 'components/background/Background';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import MultiplayerManager from '../../managers/MultiplayerManager';
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import SocketService from 'services/SocketService';
import OnlineManager from 'managers/OnlineManager';

export default class OnlineScene extends Phaser.Scene {
  elementsManager!: OnlineManager;

  matterCollision!: PhaserMatterCollisionPlugin;

  background!: Background;

  socket!: Socket<DefaultEventsMap, DefaultEventsMap>;

  socketService!: SocketService;

  constructor() {
    super(SceneKeys.Online);
  }

  init() {
    this.background = new Background(this, store.getState().app.background);
    this.socketService = new SocketService();
  }

  async create() {
    const socket = await this.socketService.join();
    this.socket = socket;
    this.elementsManager = new OnlineManager(this, 41, socket, this.socketService);
    this.socketService.mapCreate(this.elementsManager.createMap, this.elementsManager);
    this.socketService.switchTarget(this.elementsManager.switchTarget, this.elementsManager);
    this.socketService.addPlayer(this.elementsManager.updatePlayers, this.elementsManager);
    this.socketService.deletePlayer(this.elementsManager.deletePlayer, this.elementsManager);
    this.socketService.createBalls(this.elementsManager.setStartBalls, this.elementsManager);
    this.socketService.updateBalls(this.elementsManager.updateBalls, this.elementsManager);
    this.socketService.statusChange(this.elementsManager.updateStatus, this.elementsManager);
    this.socketService.clearField(this.elementsManager.clearField, this.elementsManager);
    this.socketService.changeScore(this.elementsManager.updateScore, this.elementsManager);
    this.socketService.gameOver(this.elementsManager.showWinPopup, this.elementsManager);
    this.socketService.connectToRoom('test');
  }

  update() {
    this.background.update();
    // this.socketService.socket.emit('hello', `Hello from APP ${Date.now()}`)
  }
}
