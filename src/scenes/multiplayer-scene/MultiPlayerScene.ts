import SceneKeys from "const/SceneKeys";
import { IComponent, IComponentManager } from "types/types";
import MultiplayerManager from "./components/MultiplayerManager";

export default class MultiPlayerScene extends Phaser.Scene implements IComponentManager {
  components: IComponent[] = [];
  elementsManager!: MultiplayerManager;
  

  constructor() {
    super(SceneKeys.MultiPlayer);
  }


  prepare(){
    console.log('prepare');
  }

  async create(){
    // this.
    this.elementsManager = new MultiplayerManager(this, 41);
    await this.elementsManager.createMap();
    await this.elementsManager.switchTarget(0);
  }

  update(){

  }

  addComponents(...args: IComponent[]) {
    args.forEach((el) => this.components.push(el));
  }

}