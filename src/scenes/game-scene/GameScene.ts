import SceneKeys from 'const/SceneKeys';
import Phaser from 'phaser';
import Map from './components/Map';
import TilesGroup from './components/PlatfromGroup';

export default class GameScene extends Phaser.Scene {
  level!: number;

  map!: Map;

  constructor() {
    super(SceneKeys.Game);
  }

  init(props: { level?: number }) {
    const { level = 0 } = props;
    this.level = level;
  }

  create() {
    const map = new Map(this.level, 41);
    const ground = new TilesGroup(
      this,
      map.info.filter((el) => el.type === 'tile'),
    );
    // const slope = new
  }
}
