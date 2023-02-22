export type TileProps = {
  type: string;
  texture: string;
};

export type Tile = {
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


export type Level = {
  map: string[]
};

export type Position = {
  x: number;
  y: number;
};


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
}