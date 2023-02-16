import { position1 } from 'const/Multiplayer';
import SceneKeys from 'const/SceneKeys';
import { IComponent, IComponentManager } from 'types/types';
import MultiplayerManager from './components/MultiplayerManager';
import Player from './components/Player';

export default class MultiPlayerScene extends Phaser.Scene implements IComponentManager {
  components: IComponent[] = [];
  elementsManager!: MultiplayerManager;

  constructor() {
    super(SceneKeys.MultiPlayer);
  }

  async create() {
    this.elementsManager = new MultiplayerManager(this, 41);
    await this.elementsManager.createMap();
    this.elementsManager.createPlayers();
    await this.elementsManager.switchTarget(0);
    // const button = this.add.text(0, 0, 'NEXT LEVEL');
    // button.setInteractive(async () => {
    //   await this.elementsManager.switchTarget(1);
    // });
  }

  update() {
    this.components.forEach(el => el.update());
  }

  addComponents(...args: IComponent[]) {
    args.forEach((el) => this.components.push(el));
  }
}
