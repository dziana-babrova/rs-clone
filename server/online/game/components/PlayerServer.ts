import Ball from "components/Ball";
import { Position } from "../../types/types";
import { firstPlayerPosition, secondPlayerPosition } from "../const/PlayersPositions";

export default class PlayerServer {

  id: 1 | 2;
  socketId: string;
  position: Position;
  currentBall!: Ball;
  idReverse: boolean;
  score = 0;

  constructor(id: 1 | 2, socketId: string){
    this.id = id;
    this.socketId = socketId;
    this.position = id === 1 ? firstPlayerPosition : secondPlayerPosition;
    this.idReverse = id === 2; 
  }

}