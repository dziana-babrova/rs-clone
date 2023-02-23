import Phaser from "phaser";
import { io, Socket } from "socket.io-client";
import { Level } from "types/types";
import BallServer from "../../server/online/game/components/BallServer";
import PlayerServer from "../../server/online/game/components/PlayerServer";

export default class SocketService {
  socket!: Socket;
  private events: Phaser.Events.EventEmitter;
  id: string = '';
  num = 1;

  constructor(){
    this.events = new Phaser.Events.EventEmitter();
  }

  async join(){
    this.socket = await io('http://localhost:3000/');
    this.socket.on('connect', () => this.id = this.socket.id);
    this.initEvents();
    console.log(this.socket)
    return this.socket;
  }

  updateId(){
    this.id = this.socket.id;
  }

  initEvents(){
    this.socket.on('create-map', (data: Level) => this.events.emit('create-map', data));
    this.socket.on('player-connected', (players: PlayerServer) => this.events.emit('add-player', players))
    this.socket.on('player-disconnected', (players: PlayerServer) => this.events.emit('delete-player', players));
    this.socket.on('switch-target', (target: Level) => this.events.emit('switch-target', target));
    this.socket.on('create-start-balls', (balls: string) => this.events.emit('create-start-balls', balls));
    this.socket.on('update-balls', (balls: string) => this.events.emit('update-balls', balls));
    this.socket.on('change-players-status', (status: {player1: boolean, player2: boolean}) => this.events.emit('status-change', status));
    this.socket.on('clear-field', () => this.events.emit('clear-field'));
    this.socket.on('change-score', (score: {score1: number, score2: number}) => this.events.emit('change-score', score));
    this.socket.on('game-over', (score: {score1: number, score2: number}) => this.events.emit('game-over', score));
    this.socket.on('error-message', (message: string) => console.log(message))
    
  }

  connectToRoom(name: string){
    this.socket.emit('room-connect', name);
  }

  emitHitBall(velocityX: number, velocityY: number, player: number){
    this.socket.emit('hit-ball', { velocityX, velocityY, player });
  }

  mapCreate(cb: (data: Level) => void, context?: any){
    this.events.on('create-map', cb, context);
  }
  addPlayer(cb: (data: PlayerServer[]) => void, context?: any){
    this.events.on('add-player', cb, context);
  }
  deletePlayer(cb: (data: PlayerServer[]) => void, context?: any){
    this.events.on('delete-player', cb, context);
  }
  switchTarget(cb: (data: Level) => void, context?: any){
    this.events.on('switch-target', cb, context);
  }
  createBalls(cb: (data: string) => void, context?: any){
    this.events.on('create-start-balls', cb, context);
  }
  updateBalls(cb: (data: string) => void, context?: any){
    this.events.on('update-balls', cb, context);
  }
  statusChange(cb: (data: {player1: boolean, player2: boolean}) => void, context?: any){
    this.events.on('status-change', cb, context);
  }
  clearField(cb: () => void, context?: any){
    this.events.on('clear-field', cb, context);
  }
  changeScore(cb: (data: {score1: number, score2: number}) => void, context?: any){
    this.events.on('change-score', cb, context);
  }
  gameOver(cb: (data: {score1: number, score2: number}) => void, context?: any){
    this.events.on('game-over', cb, context);
  }


}