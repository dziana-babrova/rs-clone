export type TextObjectProps = {
  x: number;
  y: number;
  text: string;
  style: Phaser.Types.GameObjects.Text.TextStyle;
};

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
