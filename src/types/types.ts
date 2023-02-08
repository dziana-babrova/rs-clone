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
