export enum EventNames {
  DragStart = 'ballDragStart',
  BallHit = 'ballDragEnd',
  BallMove = 'ballMove',
  BallStop = 'ballStop',
  ChangeTrajectory = 'changeTrajectory',
  Win = 'win',
  GameOver = 'game-over',
  GameBotHit = 'game-bot-kick',
  PopupOpen = 'popup-open',
  PopupClosed = 'popup-closed',
  SceneChange = 'scene-change',
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
  RoomCreate = 'room-create',
  AutoConnect = 'auto-connect',
  HitBall = 'hit-ball',
  RoomConnectionError = 'room-error',
  CreateScene = 'create-scene',
  SuccessConnect = 'room-connect-success',
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
  GameOver = 'game-over-online',
  PlayerHit = 'player-hit',
  RoomConnectionError = 'room-error',
  SuccessConnection = 'success-connect-room',
}

export enum ServerSideEvents {
  HitBall = 'ball-kick',
  DestroyBall = 'ball-destroy',
}

export enum HotkeysEvents {
  Mute = 'hotkey-mute',
  Sounds = 'hotkey-sounds',
  Music = 'hotkey-music',
  Levels = 'hotkey-levels',
  Info = 'hotkey-info',
  Restart = 'hotkey-restart',
  Back = 'hotkey-esc',
  Winners = 'hotkey-winners',
}
