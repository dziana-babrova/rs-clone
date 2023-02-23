import Phaser from 'phaser';
import { io, Socket } from 'socket.io-client';
import {
  IPlayerInfo, Level, ScoreMessage, StatusMessage,
} from 'common/types/types';
import { OnlineGameEvents, SocketEvents } from 'common/types/events';
import { SERVER_PROPS } from 'client/const/AppConstants';

export default class SocketService {
  socket!: Socket;

  private events: Phaser.Events.EventEmitter;

  id: string = '';

  num = 1;

  constructor() {
    this.events = new Phaser.Events.EventEmitter();
  }

  async join() {
    this.socket = await io(SERVER_PROPS.ONLINE);
    this.socket.on('connect', () => { this.id = this.socket.id; });
    this.initEvents();
    return this.socket;
  }

  updateId() {
    this.id = this.socket.id;
  }

  initEvents() {
    this.socket.on(
      SocketEvents.CreateMap,
      (data: Level) => this.events.emit(OnlineGameEvents.CreateMap, data),
    );
    this.socket.on(
      SocketEvents.PlayerConnected,
      (players: IPlayerInfo[]) => this.events.emit(OnlineGameEvents.AddPlayer, players),
    );
    this.socket.on(
      SocketEvents.PlayerDisconnected,
      (players: IPlayerInfo[]) => this.events.emit(OnlineGameEvents.DeletePlayer, players),
    );
    this.socket.on(
      SocketEvents.SwitchTarget,
      (target: Level) => this.events.emit(OnlineGameEvents.SwitchTarget, target),
    );
    this.socket.on(
      SocketEvents.CreateBalls,
      (balls: string) => this.events.emit(OnlineGameEvents.CreateBalls, balls),
    );
    this.socket.on(
      SocketEvents.UpdateBalls,
      (balls: string) => this.events.emit(OnlineGameEvents.UpdateBalls, balls),
    );
    this.socket.on(
      SocketEvents.ChangeStatus,
      (status: StatusMessage) => this.events.emit(OnlineGameEvents.ChangeStatus, status),
    );
    this.socket.on(
      SocketEvents.ClearField,
      () => this.events.emit(OnlineGameEvents.ClearField),
    );
    this.socket.on(
      SocketEvents.ChangeScore,
      (score: ScoreMessage) => this.events.emit(OnlineGameEvents.ChangeScore, score),
    );
    this.socket.on(
      SocketEvents.GameOver,
      (score: ScoreMessage) => this.events.emit(OnlineGameEvents.GameOver, score),
    );
    this.socket.on(
      SocketEvents.PlayerHit,
      (player: number) => this.events.emit(OnlineGameEvents.PlayerHit, player),
    );
    this.socket.on(
      SocketEvents.ErrorMessage,
      (message: string) => console.log(message),
    );
  }

  connectToRoom(name: string) {
    this.socket.emit(SocketEvents.RoomConnect, name);
  }

  emitHitBall(velocityX: number, velocityY: number, player: number) {
    this.socket.emit(SocketEvents.HitBall, { velocityX, velocityY, player });
  }

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  mapCreate(cb: (data: Level) => void, context?: any) {
    this.events.on(OnlineGameEvents.CreateMap, cb, context);
  }

  addPlayer(cb: (data: IPlayerInfo[]) => void, context?: any) {
    this.events.on(OnlineGameEvents.AddPlayer, cb, context);
  }

  deletePlayer(cb: (data: IPlayerInfo[]) => void, context?: any) {
    this.events.on(OnlineGameEvents.DeletePlayer, cb, context);
  }

  switchTarget(cb: (data: Level) => void, context?: any) {
    this.events.on(OnlineGameEvents.SwitchTarget, cb, context);
  }

  createBalls(cb: (data: string) => void, context?: any) {
    this.events.on(OnlineGameEvents.CreateBalls, cb, context);
  }

  updateBalls(cb: (data: string) => void, context?: any) {
    this.events.on(OnlineGameEvents.UpdateBalls, cb, context);
  }

  statusChange(cb: (data: StatusMessage) => void, context?: any) {
    this.events.on(OnlineGameEvents.ChangeStatus, cb, context);
  }

  clearField(cb: () => void, context?: any) {
    this.events.on(OnlineGameEvents.ClearField, cb, context);
  }

  changeScore(cb: (data: ScoreMessage) => void, context?: any) {
    this.events.on(OnlineGameEvents.ChangeScore, cb, context);
  }

  gameOver(cb: (data: ScoreMessage) => void, context?: any) {
    this.events.on(OnlineGameEvents.GameOver, cb, context);
  }

  playerHit(cb: (data: number) => void, context?: any) {
    this.events.on(OnlineGameEvents.PlayerHit, cb, context);
  }
  /* eslint-enable  @typescript-eslint/no-explicit-any */
}
