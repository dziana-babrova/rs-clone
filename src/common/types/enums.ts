export enum Language {
  Eng = 'eng',
  Ru = 'ru',
}

export enum AnimationKeys {
  Wave = 'flag-wave',
}

export enum ElementTypeKeys {
  Tile = 'tile',
  RightSlope = 'slope-right',
  LeftSlope = 'slope-left',
  Hole = 'hole',
  HoleWithCoin = 'coin-in-hole',
  Star = 'star',
  Ball = 'ball',
  Flag = 'flag',
  Cup = 'cup',
  Saw = 'saw',
  Water = 'water',
}

export enum SceneKeys {
  Preloader = 'preload-scene',
  Start = 'start-scene',
  Game = 'game-scene',
  MultiPlayer = 'multiplayer-scene',
  Online = 'online-scene',
}

export enum TextureKeys {
  Platforms = 'platforms',
  Ball = 'ball',
  BallMini = 'ball-mini',
  BallMedium = 'ball-medium',
  Logo = 'logo',
  Close = 'close',
  MusicOn = 'music-on',
  MusicOff = 'music-off',
  eng = 'eng',
  ru = 'ru',
  Flag = 'flag',
  Fireworks = 'fireworks',
  Restart = 'restart',
  Next = 'next',
  Saw = 'saw',
  Background = 'background',
  Water = 'water',
  LevelEmpty = 'levelEmpty',
  LevelOneStar = 'levelOneStar',
  LevelTwoStars = 'levelTwoStars',
  LevelThreeStars = 'levelThreeStars',
  LevelLock = 'levelLock',
  Select = 'select',
  Winner = 'winner',
  Star = 'star',
  Buttons = 'buttons',
  TopPanel = 'top-panel',
  Pagination = 'pagination-arrow',
}

export enum Colors {
  Primary = '#ffffff',
  Secondary = '#000000',
  Text = '#ffffff',
  Blue = '#46b4e1',
  BlueDark = '#1A9ED4',
  Sky = '#88C0E0',
  Grass = '#8ab868',
  GrassDark = '#778e5b',
  Ground = '#524338',
  Hole = '#312822',
  StartSceneBG = '#FFC332',
  Pink = '#E11195',
  PinkDark = '#C20F81',
  FireworksRed = '#ED0F0F',
  FireworksBrightBlue = '#0F34ED',
  FireworksYellow = '#E6ED0F',
  FireworksGreen = '#3DA925',
  FireworksPurple = '#EE04E7',
  PopupBackground = '#d78d43',
  PopupBorder = '#fefee4',
  PopupLine = '#000000',
  StarTemplate = '#dbdbdb',
  Star = '#e7e702',
  StarPulse = '#693849',
  Stroke = '#000000',
  BackgroundDay = '#46B4E1',
  BackgroundNight = '#18445C',
  BackgroundMountains = '#5691B2',
  BackgroundPalms = '#F0D99C',
}

export enum ColorsNumber {
  Primary = 0xffffff,
  Secondary = 0x000000,
  Text = 0xffffff,
  Blue = 0x46b4e1,
  BlueDark = 0x1a9ed4,
  Sky = 0x88c0e0,
  Grass = 0x8ab868,
  GrassDark = 0x778e5b,
  Ground = 0x524338,
  Hole = 0x312822,
  StartSceneBG = 0xffc332,
  Pink = 0xe11195,
  PinkDark = 0xc20f81,
  FireworksRed = 0xed0f0f,
  FireworksBrightBlue = 0x0f34ed,
  FireworksYellow = 0xe6ed0f,
  FireworksGreen = 0x3da925,
  FireworksPurple = 0xee04e7,
  PopupBorder = 0xd78d43,
  PopupBackground = 0xfefee4,
  PopupLine = 0x000000,
  StarTemplate = 0xdbdbdb,
  Star = 0xe7e702,
  StarPulse = 0x693849,
  Stroke = 0x000000,
  Green = 0x00ff00,
  Orange = 0xff9600,
  ButtonHovered = 0x9a652f,
}

export enum Controls {
  Mouse,
  Keyboard,
}

export enum Move {
  Show,
  Hide,
}

export enum AuthFormInputsKeys {
  Email = 'email',
  Username = 'username',
  Password = 'password',
}

export enum RoomFormInputsKeys {
  Room = 'room',
}

export enum FormType {
  SignIn = 'signIn',
  SignUp = 'signUp',
}

export enum PopupType {
  Auth = 'auth',
  Room = 'room',
}

export enum SoundsKeys {
  Hit = 'hit-sound',
  Firework = 'fireworks-sound',
  Ready = 'ready-sound',
  Click = 'click-sound',
  Star = 'star-sound',
  ResultStar = 'result-star-sound',
  GameOver = 'game-over-sound',
  Music = 'music',
  SwitchTarget = 'switch-target',
  PlayerWin = 'player-win',
  PlayerLose = 'player-lose',
}

export enum BackgroundKeys {
  Daytime = 'daytime',
  Night = 'night',
  Mountains = 'mountains',
  Palms = 'palms',
}

export enum BackgroundFrames {
  Stars = 'stars.png',
  Mountains = 'mountains.png',
  Palms = 'bgTrees.png',
  Sun = 'sun.png',
  Moon = 'moon.png',
  BigCloud = 'cloud1.png',
  SmallCloud = 'cloud2.png',
}

export enum SettingsPopupKeys {
  Levels = 'levels',
  Landscape = 'landscape',
  Winners = 'winners',
}

export enum RoomPopupFormBtns {
  createRoom = 'createRoom',
  getInRoom = 'getInRoom',
}

export enum ButtonsFrames {
  Restart = 'restart.png',
  Next = 'next.png',
  Back = 'back.png',
}

export enum WinReasons {
  EnemyLeave = 'leave',
}

export enum TopPanelFrames {
  Restart = 'restart.png',
  Back = 'back.png',
  Levels = 'levels.png',
  SoundOn = 'sound-on.png',
  SoundOff = 'sound-off.png',
  MusicOn = 'music-on.png',
  MusicOff = 'music-off.png',
  Info = 'info.png',
}
