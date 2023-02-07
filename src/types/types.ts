export type TextObjectProps = {
  x: number;
  y: number;
  text: string;
  style: Phaser.Types.GameObjects.Text.TextStyle;
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

export enum Controls {
  Mouse,
  Keyboard,
}

export type Level = string[];

export type TileProps = {
  type: string,
  texture: string,
};

export type TilesConfig = {
  [key: string]: TileProps;
};

export type MapSize = {
  x: number,
  y: number,
  width: number,
  height: number,
};

export type LevelElements = {
  x: number,
  y: number,
} & TileProps;
