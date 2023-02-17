import { SceneKeys } from 'types/enums';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import { IComponent, IComponentManager } from 'types/types';
import MultiplayerManager from './components/MultiplayerManager';
import Player from './components/Player';

export default class MultiPlayerScene extends Phaser.Scene {
  elementsManager!: MultiplayerManager;
  matterCollision!: PhaserMatterCollisionPlugin;


  constructor() {
    super(SceneKeys.MultiPlayer);
  }

  async create() {
    this.elementsManager = new MultiplayerManager(this, 41, this.matterCollision);
    await this.elementsManager.createMap();
    await this.elementsManager.switchTarget(0);
    this.elementsManager.createPlayers();
  }

  update() {
  }

}
