import { Scene } from 'phaser';
import Map from './components/Map';
import TilesGroup from './components/PlatfromGroup';
import SlopeGroup from './components/SlopeGroup';

export default class WorldBuilder {
  scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  build(level: number, tileSize: number) {
    const map = new Map(level, tileSize);
    const ground = new TilesGroup(
      this.scene,
      map.mapElements.filter((el) => el.type === 'tile'),
    );
    const slope = new SlopeGroup(
      this.scene,
      map.mapElements.filter((el) => el.type === 'slope'),
    );
    console.log(ground, slope);
  }
}
