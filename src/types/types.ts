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
