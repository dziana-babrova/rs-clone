import { Server } from "socket.io"
import config from "./config"

export class ServerGame extends Phaser.Game {

  server: Server;
  room: string;

  constructor(server: Server, room: string) {
    super(config);
    this.server = server;
    this.room = room
    this.scene.start('OnlineScene', {server, room});
  }
}
