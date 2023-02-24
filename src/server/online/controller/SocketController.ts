import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { multiPlayerMap } from '../game/const/MultiplayerLevels';
import State from '../state/State';
import Room from '../state/Room';
import { ServerSideEvents, SocketEvents } from '../../../common/types/events';

/* eslint @typescript-eslint/no-explicit-any: 0 */
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
    this.socket.on(SocketEvents.RoomCreate, this.createRoom.bind(this));
    this.socket.on(SocketEvents.RoomConnect, this.connectRoom.bind(this));
    this.socket.on(SocketEvents.AutoConnect, this.autoConnect.bind(this));
    this.socket.on(SocketEvents.HitBall, this.handleHit.bind(this));
    this.socket.on('disconnect', this.disconnectSocket.bind(this));
  }

  createRoom(room: string) {
    try {
      const candidateRoom = this.state.rooms.find((el) => el.name === room);
      if (candidateRoom) {
        this.socket.emit(SocketEvents.ErrorMessage, 'Room with this name already exists.');
        console.log(`Room ${room} already exists.`)
        return;
      }
      console.log('Create room - ', room);
      this.room = this.state.createRoom(room, this.socket.id, this.io);
      this.socket.join(room);
      this.roomName = room;
      this.socket.emit(SocketEvents.CreateMap, multiPlayerMap);
      this.sendStartState();
    } catch (e) {
      this.socket.to(this.roomName || '').emit(SocketEvents.ErrorMessage, (e as Error).message);
    }
  }

  connectRoom(room: string) {
    try {
      const candidateRoom = this.state.rooms.find((el) => el.name === room);
      if (!candidateRoom){
        this.socket.emit(SocketEvents.ErrorMessage, 'Room with this name does not exist.');
        return;
      }
      if (candidateRoom && candidateRoom.players.length === 2) {
        this.socket.emit(SocketEvents.ErrorMessage, 'Room is full.');
        return;
      }
      if (candidateRoom && candidateRoom.players.length === 0) {
        this.socket.emit(SocketEvents.ErrorMessage, 'Something went wrong you are alone in the room.');
        return;
      }
      this.room = candidateRoom;
      candidateRoom.addPlayer(this.socket.id);
      this.socket.join(room);
      this.roomName = room;
      this.socket.emit(SocketEvents.CreateMap, multiPlayerMap);
      this.sendStartState();
      this.room.createGame();
    } catch (e) {
      this.socket.to(this.roomName || '').emit(SocketEvents.ErrorMessage, (e as Error).message);
    }
  }

  autoConnect(){
    try {
      this.room = this.state.connectToAutoRoom(this.socket.id, this.io);
      this.socket.join(this.room.name);
      this.roomName = this.room.name;
      this.socket.emit(SocketEvents.CreateMap, multiPlayerMap);
      this.sendStartState();
      if (this.room.players.length === 2){
        this.room.createGame();
      }
    } catch (e) {
      this.socket.to(this.roomName || '').emit(SocketEvents.ErrorMessage, (e as Error).message);
    }
  }

  disconnectSocket() {
    try {
      if (!this.roomName) return;
      this.state.leaveRoom(this.roomName || '', this.socket.id);
      this.io.to(this.roomName).emit(SocketEvents.PlayerDisconnected, this.room.players);
      console.log('Disconnect', this.socket.id, this.roomName);
    } catch (e) {
      this.socket.to(this.roomName || '').emit(SocketEvents.ErrorMessage, (e as Error).message);
    }
  }

  sendStartState() {
    try {
      this.io.to(this.roomName!).emit(SocketEvents.PlayerConnected, this.room.players);
    } catch (e) {
      this.socket.to(this.roomName || '').emit(SocketEvents.ErrorMessage, (e as Error).message);
    }
  }

  handleHit(data: { velocityX: number; velocityY: number; player: number }) {
    try {
      this.room.game.events.emit(ServerSideEvents.HitBall, data);
    } catch (e) {
      this.socket.to(this.roomName || '').emit(SocketEvents.ErrorMessage, (e as Error).message);
    }
  }
}
