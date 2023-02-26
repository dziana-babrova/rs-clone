import { SceneKeys } from 'common/types/enums';
import store from 'client/state/store';
import TopPanel from 'client/components/top-panel/TopPanel';
import Background from 'client/components/background/Background';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import MultiplayerManager from '../../managers/MultiplayerManager';

export default class MultiPlayerScene extends Phaser.Scene {
  elementsManager!: MultiplayerManager;

  matterCollision!: PhaserMatterCollisionPlugin;

  panel!: TopPanel;

  background!: Background;

  withBot = false;

  constructor() {
    super(SceneKeys.MultiPlayer);
  }

  init(data: { withBot?: boolean }) {
    this.background = new Background(this, store.getState().app.background);
    if (data.withBot) {
      this.withBot = data.withBot;
    }
  }

  async create() {
    this.elementsManager = new MultiplayerManager(this, 41, this.matterCollision);
    await this.elementsManager.createMap();
    await this.elementsManager.switchTarget(0);
    this.elementsManager.createPlayers(this.withBot);

    this.panel = new TopPanel(
      this,
      SceneKeys.MultiPlayer,
      true,
      false,
      this.elementsManager.goToScene.bind(this.elementsManager),
    );
  }

  update() {
    this.background.update();
  }
}
