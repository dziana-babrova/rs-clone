import { Scene } from 'phaser';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import { Server } from 'socket.io';
import GameManager from '../manager/GameManager';

export default class OnlineScene extends Scene {
  elementsManager!: GameManager;

  matterCollision!: PhaserMatterCollisionPlugin;

  server!: Server;

  room!: string;

  constructor() {
    super('OnlineScene');
  }

  init(data: {server: Server, room: string}) {
    this.server = data.server;
    this.room = data.room;
  }
  
  create() {
    this.matterCollision = new PhaserMatterCollisionPlugin(this, this.plugins, 'matterCollision');
    this.elementsManager = new GameManager(this, 41, this.server, this.room);
    this.elementsManager.createMap();
    this.elementsManager.switchTarget(0);
  }

  update() {
    if (!this.elementsManager) return;
    const changes = this.elementsManager.getBallsChanges();
    if (changes.length) {
      this.server.to(this.room).emit('update-balls', changes.slice(0, -1));
    } 
  }
}
