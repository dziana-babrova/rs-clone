import { Server } from 'socket.io';
import Room from './Room';

export default class State {
  rooms: Room[] = [];
  static autoRoomId = 0;
  static AUTO_ROOM_PREFIX = 'golf-auto-room';
  static currentRoom = 0;

  createRoom(roomName: string, id: string, server: Server) {
    const room = new Room(roomName, id, server);
    this.rooms.push(room);
    return room;
  }

  leaveRoom(roomName: string, id: string) {
    const candidateRoom = this.rooms.find((el) => el.name === roomName);
    if (!candidateRoom) return;
    candidateRoom.players = candidateRoom.players.filter((el) => el.socketId !== id);
    if (!candidateRoom.players.length) {
      this.rooms = this.rooms.filter((el) => el !== candidateRoom);
    }
  }

  createAutoRoom(id: string, server: Server){
    const roomName = State.AUTO_ROOM_PREFIX + State.autoRoomId;
    State.currentRoom = State.autoRoomId;
    State.autoRoomId += 1;
    const room = new Room(roomName, id, server);
    this.rooms.push(room);
    return room;
  }

  connectToAutoRoom(id: string, server: Server) {
    const candidateRoom = this.rooms.find((el) => el.name === State.AUTO_ROOM_PREFIX + State.currentRoom);
    if (candidateRoom?.players.length !== 1){
      return this.createAutoRoom(id, server);
    } else {
      candidateRoom.addPlayer(id);
      return candidateRoom;
    }
  }
}
