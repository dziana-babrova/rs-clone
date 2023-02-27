import { SceneKeys } from 'common/types/enums';
import store from 'client/state/store';
import Background from 'client/components/background/Background';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import SocketService from 'client/services/SocketService';
import OnlineManager from 'client/managers/OnlineManager';
import HotkeysService from 'client/services/HotkeysService';
import { HotkeysEvents } from 'common/types/events';
import TopPanel from 'client/components/top-panel/TopPanel';

export default class OnlineScene extends Phaser.Scene {
  elementsManager!: OnlineManager;

  background!: Background;

  socket!: Socket<DefaultEventsMap, DefaultEventsMap>;

  socketService!: SocketService;

  panel!: TopPanel;

  constructor() {
    super(SceneKeys.Online);
  }

  init(socketService: SocketService) {
    this.background = new Background(this, store.getState().app.background);
    this.socketService = socketService;
  }

  async create() {
    this.socket = this.socketService.socket;
    this.elementsManager = new OnlineManager(this, 41, this.socket, this.socketService);
    this.panel = new TopPanel(
      this,
      SceneKeys.Online,
      false,
      false,
      this.elementsManager.goToScene.bind(this.elementsManager),
    );
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
    this.socketService.sceneCreated();
    this.initHotkeys();
  }

  private initHotkeys() {
    HotkeysService.initHotkeysEvents(this);
    this.events.on(HotkeysEvents.Info, this.panel.openInfo.bind(this.panel));
    this.events.on(HotkeysEvents.Back, this.panel.closePopup.bind(this.panel));
    this.events.on(HotkeysEvents.Sounds, this.panel.toggleSound.bind(this.panel));
    this.events.on(HotkeysEvents.Music, this.panel.toggleMusic.bind(this.panel));
    this.events.on(HotkeysEvents.Mute, this.panel.toggleMute.bind(this.panel));
  }

  update() {
    this.background.update();
  }
}
