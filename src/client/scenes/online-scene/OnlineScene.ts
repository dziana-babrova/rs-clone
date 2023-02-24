import { SceneKeys } from 'common/types/enums';
import store from 'client/state/store';
import Background from 'client/components/background/Background';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import SocketService from 'client/services/SocketService';
import OnlineManager from 'client/managers/OnlineManager';

export default class OnlineScene extends Phaser.Scene {
  elementsManager!: OnlineManager;

  background!: Background;

  socket!: Socket<DefaultEventsMap, DefaultEventsMap>;

  socketService!: SocketService;

  constructor() {
    super(SceneKeys.Online);
  }

  init(socketService: SocketService) {
    this.background = new Background(this, store.getState().app.background);
    this.socketService = socketService;
  }

  async create() {
    // const socket = await this.socketService.join();
    this.socket = this.socketService.socket;
    console.log(this.socket);
    this.elementsManager = new OnlineManager(this, 41, this.socket, this.socketService);
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
    this.socketService.playerHit(this.elementsManager.createPlayerAnimation, this.elementsManager);
    // this.socketService.connectToRoom('test');
  }

  update() {
    this.background.update();
  }
}
