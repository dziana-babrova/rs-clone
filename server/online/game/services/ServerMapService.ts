import { Scene } from 'phaser';
import { ElementTypeKeys, LevelElements } from '../../types/types';
import Map from '../components/Map';
import config from '../const/TileConfig';

export default class ServerMapService {
  public tileSize: number;

  constructor(tileSize: number) {
    this.tileSize = tileSize;
  }

  public createLevelConfig(levelScheme: string[]) {
    const levelElements: LevelElements[] = [];
    levelScheme.forEach((row, y) => {
      for (let i = 0; i < row.length; i += 1) {
        const tile = row[i];
        const x = i;
        if (tile !== ' ') {
          const element = {
            ...config[tile.toString()],
            x: x * this.tileSize,
            y: y * this.tileSize,
          };
          levelElements.push(element);
        }
      }
    });
    return levelElements;
  }

  public getFilteredElements(elements: LevelElements[], ...types: string[]): LevelElements[] {
    const result: LevelElements[] = [];
    types.forEach((type) => {
      result.push(...elements.filter((el) => el.type === type));
    });
    return result;
  }

  public createMap(scene: Scene, elements: LevelElements[]) {
    const groundConfig = this.getFilteredElements(
      elements,
      ElementTypeKeys.Tile,
    );
    const leftSlopeConfig = this.getFilteredElements(
      elements,
      ElementTypeKeys.LeftSlope,
    );
    const rightSlopeConfig = this.getFilteredElements(elements, ElementTypeKeys.RightSlope);
    const holeConfig = this.getFilteredElements(
      elements,
      ElementTypeKeys.Hole,
      ElementTypeKeys.HoleWithCoin,
      ElementTypeKeys.Flag,
      ElementTypeKeys.Cup,
    );
    return new Map(scene, groundConfig, leftSlopeConfig, rightSlopeConfig, holeConfig);
  }

}
