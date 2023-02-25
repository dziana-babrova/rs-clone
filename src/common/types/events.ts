export enum EventNames {
  DragStart = 'ballDragStart',
  BallHit = 'ballDragEnd',
  BallMove = 'ballMove',
  BallStop = 'ballStop',
  ChangeTrajectory = 'changeTrajectory',
  Win = 'win',
  GameOver = 'game-over',
  GameBotHit = 'game-bot-kick',
}

export enum SocketEvents {
  CreateMap = 'create-map',
  PlayerConnected = 'player-connected',
  PlayerDisconnected = 'player-disconnected',
  SwitchTarget = 'switch-target',
  CreateBalls = 'create-start-balls',
  UpdateBalls = 'update-balls',
  ChangeStatus = 'change-players-status',
  ClearField = 'clear-field',
  ChangeScore = 'change-score',
  GameOver = 'game-over',
  PlayerHit = 'player-hit',
  ErrorMessage = 'error-message',
  RoomConnect = 'room-connect',
  HitBall = 'hit-ball',
}

export enum OnlineGameEvents {
  CreateMap = 'create-map',
  AddPlayer = 'add-player',
  DeletePlayer = 'delete-player',
  SwitchTarget = 'switch-target',
  CreateBalls = 'create-start-balls',
  UpdateBalls = 'update-balls',
  ChangeStatus = 'status-change',
  ClearField = 'clear-field',
  ChangeScore = 'change-score',
  GameOver = 'game-over',
  PlayerHit = 'player-hit',
}

export enum ServerSideEvents {
  HitBall = 'ball-kick',
  DestroyBall = 'ball-destroy',
}
