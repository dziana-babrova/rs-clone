import { Server } from "socket.io";
import Room from "./socket/Room";

export default class State {

  rooms: Room[] = [];

  createRoom(roomName: string, id: string, server: Server){
    const room = new Room(roomName, id, server);
    this.rooms.push(room);
    return room;
  }

  leaveRoom(roomName: string, id: string){
    const candidateRoom = this.rooms.find((el) => el.name === roomName);
    if(!candidateRoom) return;
    candidateRoom.players = candidateRoom.players.filter(el => el.socketId !== id);
    if (!candidateRoom.players.length) {
      this.rooms = this.rooms.filter(el => el !== candidateRoom);
    }
  }

}