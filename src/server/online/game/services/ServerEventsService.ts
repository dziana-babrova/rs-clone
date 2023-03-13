import { Server } from 'socket.io';
import { SocketEvents } from '../../../../common/types/events';
import { ScoreMessage, StatusMessage } from '../../../../common/types/types';

export default class ServerEventsService {
  server: Server;

  room: string;

  constructor(server: Server, room: string) {
    this.server = server;
    this.room = room;
  }

  emitSwitchTarget(data: { map: string[] }) {
    this.server.to(this.room).emit(SocketEvents.SwitchTarget, data);
  }

  emitPlayersStatus(data: StatusMessage) {
    this.server.to(this.room).emit(SocketEvents.ChangeStatus, data);
  }

  emitGameOver(data: 1 | 2) {
    this.server.to(this.room).emit(SocketEvents.GameOver, data);
  }

  emitPlayersScore(data: ScoreMessage) {
    this.server.to(this.room).emit(SocketEvents.ChangeScore, data);
  }

  emitClearField() {
    this.server.to(this.room).emit(SocketEvents.ClearField);
  }

  emitPlayerHit(player: number) {
    this.server.to(this.room).emit(SocketEvents.PlayerHit, player);
  }
}
