import { LevelElements, Level, Maps } from 'types/types';
import { Levels } from 'const/levels/Levels';
import config from 'const/TileConfig';
import { ElementTypeKeys } from 'types/enums';
import { Scene } from 'phaser';
import Map from 'scenes/game-scene/components/Map';

export default class MapService {
  public tileSize: number;

  constructor(tileSize: number) {
    this.tileSize = tileSize;
  }

  public createLevelConfig(levelScheme: Level) {
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

  static getDefaultMapsObject(): Maps {
    const result: Maps = {};
    Levels.forEach((_, index) => {
      result[index] = {
        isUnlock: index === 0,
        start: 0,
      };
    });
    return result;
  }
}
