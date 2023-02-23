import { IPlayerInfo, Position } from '../../../../common/types/types';
import { firstPlayerPosition, secondPlayerPosition } from '../const/OnlineGameProps';

export default class PlayerServer implements IPlayerInfo {
  id: 1 | 2;

  socketId: string;

  position: Position;

  idReverse: boolean;

  score = 0;

  constructor(id: 1 | 2, socketId: string) {
    this.id = id;
    this.socketId = socketId;
    this.position = id === 1 ? firstPlayerPosition : secondPlayerPosition;
    this.idReverse = id === 2;
  }
}
