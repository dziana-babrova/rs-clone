import { Language } from 'const/Language';
import { ColorsNumber, Colors, FormInputsKeys } from './enums';

export type TextObjectProps = {
  x: number;
  y: number;
  style: Phaser.Types.GameObjects.Text.TextStyle;
};

export type RectangleObjectProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: number;
  alpha: number;
};

export type GradientRectangleObjectProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  alpha: number;
  topLeft: number;
  topRight: number;
  bottomLeft: number;
  bottomRight: number;
};

export type Position = {
  x: number;
  y: number;
};

export interface IComponent {
  update: () => void;
}

export interface IComponentManager {
  components: IComponent[];
  addComponents: (...args: IComponent[]) => void;
}

export type TextButtonParams = {
  width: number;
  textSize: number;
  textColor: Colors;
  bgColor: Colors;
  hoverBgColor: Colors;
};

export type IconButtonParams = {
  width: number;
  height: number;
  bgColor: ColorsNumber;
  hoverBgColor: ColorsNumber;
};

export type Level = {
  map: string[],
  saw?: Saw,
};

export type Saw = {
  type: SawType;
  directionX: number;
  directionY: number;
  angle: number;
  distance: number;
};

export type SawType = 'rotate' | 'move' | '';

export type TileProps = {
  type: string;
  texture: string;
};

export type TilesConfig = {
  [key: string]: TileProps;
};

export type MapSize = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type LevelElements = {
  x: number;
  y: number;
} & TileProps;

export interface IUserState {
  isLoading: boolean;
  isAuth: boolean;
  user: User;
}

export interface IAppState {
  maps: Maps;
  lang: Language;
  music: boolean;
  sound: boolean;
}

export type User = {
  email: string;
  username: string;
  password: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type Maps = MapDescription[];

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type AxiosErrorResponse = {
  message: string;
  errors?: ServerValidationError[];
};

export type ServerValidationError = {
  value?: string;
  msg: string;
  param: string;
  location: string;
};

export type FormInput = {
  name: FormInputsKeys;
  type: string;
};

export type ClientValidationError = Pick<ServerValidationError, 'param' | 'msg'>;

export type ValidationErrorType = ServerValidationError | ClientValidationError;
export type MapDescription = {
  id: number;
  isUnlock: boolean;
  stars: number;
};

export type CharacterSettings = {
  texture: string;
  basicFrame: string;
  scale: number;
  correction: number;
  animations: CharacterAnimation;
};

export type CharacterAnimation = {
  prepare: AnimationDescription;
  hit: AnimationDescription;
  back: AnimationDescription;
};

export type AnimationDescription = {
  name: string;
  prefix: string;
  postfix: string;
  start: number;
  end: number;
  zeroPad: number;
  frameRate: number;
};

export type Winner = {
  username: string;
  stars: number;
};

export type WinnersResponse = Winner[];
