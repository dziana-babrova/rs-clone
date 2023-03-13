import { Server } from 'socket.io';
import PlayerServer from '../game/components/PlayerServer';
import ServerGame from '../game/ServerGame';

export default class Room {
  name: string;

  game!: Phaser.Game;

  players: PlayerServer[] = [];

  server: Server;

  constructor(name: string, socketId: string, server: Server) {
    this.name = name;
    this.players.push(new PlayerServer(1, socketId));
    this.server = server;
  }

  addPlayer(socketId: string) {
    if (!this.players[0] || (this.players[0] && this.players[0].id === 2)) {
      this.players.push(new PlayerServer(1, socketId));
    }
    if (this.players[0] && this.players[0].id === 1) {
      this.players.push(new PlayerServer(2, socketId));
    }
  }

  createGame() {
    this.game = new ServerGame(this.server, this.name);
  }
}
