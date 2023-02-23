import { Server } from 'socket.io';

export default class ServerEventsService {

  server: Server;
  room: string;

  constructor(server: Server, room: string){
    this.server = server;
    this.room = room;
  }

  emitSwitchTarget(data: { map: string[] }) {
    this.server.to(this.room).emit('switch-target', data);
  }

  emitCreateBall(data: string) {
    this.server.to(this.room).emit('create-start-balls', data);
  }

  emitPlayersStatus(data: {player1: boolean, player2: boolean}) {
    this.server.to(this.room).emit('change-players-status', data);
  }

  emitGameOver(data:  {score1: number, score2: number }) {
    this.server.to(this.room).emit('game-over', data);
  }
  emitPlayersScore(data:  {score1: number, score2: number }) {
    this.server.to(this.room).emit('change-score', data);
  }
  emitClearField() {
    this.server.to(this.room).emit('clear-field');
  }
}
