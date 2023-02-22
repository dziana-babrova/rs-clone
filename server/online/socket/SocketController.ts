import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { multiPlayerMap } from '../game/const/MultiplayerLevels';
import State from '../State';
import Room from './Room';

export default class SocketController {

  io: Server;
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
  state: State;
  roomName: string | null = null;
  room!: Room;

  constructor(
    io: Server,
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    state: State,
  ) {
    this.io = io;
    this.socket = socket;
    this.state = state;
    this.init();
  }

  init() {
    console.log(`Connected ${this.socket.id}`);
    this.socket.emit('create-map', multiPlayerMap);
    this.socket.on('room-connect', this.connectRoom.bind(this));
    this.socket.on('disconnect', this.disconnectSocket.bind(this));
    this.socket.on('hit-ball', this.handleHit.bind(this));
  }

  connectRoom(room: string) {
    const candidateRoom = this.state.rooms.find((el) => el.name === room);
    if (candidateRoom && candidateRoom.players.length === 2) {
      this.socket.emit('error-message', 'Room is full.');
      return;
    };
    if (candidateRoom && candidateRoom.players.length === 1) {
      this.room = candidateRoom;
      candidateRoom.addPlayer(this.socket.id);
      this.socket.join(room);
      this.roomName = room;
      this.sendStartState();
      this.room.createGame();
      return;
    }
    this.room = this.state.createRoom(room, this.socket.id, this.io);
    this.socket.join(room);
    this.roomName = room;
    this.sendStartState();
  }

  disconnectSocket() {
    if (!this.roomName) return;
    this.state.leaveRoom(this.roomName || '', this.socket.id);
    this.io.to(this.roomName).emit('player-disconnected', this.room.players);
    console.log('Disconnect', this.socket.id);
  }

  sendStartState() {
    this.io.to(this.roomName!).emit('player-connected', this.room.players);
  }

  handleHit(data: {velocityX: number, velocityY: number, player: number}){
    console.log(this.room.game.events.emit('ball-kick', data));
  }
}
