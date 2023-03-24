import { Scene } from 'phaser';
import { Server } from 'socket.io';
import { SocketEvents } from '../../../../common/types/events';
import GameManager from '../manager/GameManager';

export default class OnlineScene extends Scene {
  elementsManager!: GameManager;

  server!: Server;

  room!: string;

  constructor() {
    super('OnlineScene');
  }

  init(data: { server: Server, room: string }) {
    this.server = data.server;
    this.room = data.room;
    this.elementsManager = new GameManager(this, 41, this.server, this.room);
  }

  create() {
    this.elementsManager.createMap();
    this.elementsManager.switchTarget(0);
  }

  update() {
    const changes = this.elementsManager.getBallsChanges();
    if (changes.length) {
      this.server.to(this.room).emit(SocketEvents.UpdateBalls, changes);
    }
  }
}
