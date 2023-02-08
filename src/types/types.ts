import Colors, { ColorsNumber } from 'const/Colors';

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

export type TextButtonParams = {
  text: {
    eng: string;
    ru: string;
  }
  width: number,
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

export enum Language {
  eng = 'eng',
  ru = 'ru',
}
