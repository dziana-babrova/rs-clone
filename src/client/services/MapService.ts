import { LevelElements, MapDescription, Maps } from 'common/types/types';
import config from 'client/const/TileConfig';
import { ElementTypeKeys } from 'common/types/enums';
import { Scene } from 'phaser';
import { Levels } from 'client/const/levels/Levels';
import Map from 'client/scenes/game-scene/components/Map';

export default class MapService {
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
    const waterConfig = this.getFilteredElements(elements, ElementTypeKeys.Water);
    return new Map(scene, groundConfig, leftSlopeConfig, rightSlopeConfig, holeConfig, waterConfig);
  }

  static getDefaultMapsObject(): Maps {
    return Levels.map((_el, index) => ({
      id: index,
      isUnlock: index === 0,
      stars: 0,
    }));
  }

  static updateMapsObject(maps: Maps, index: number, stars: number): Maps {
    const indexMap: MapDescription = {
      id: maps[index].id,
      isUnlock: true,
      stars,
    };

    const nextMap: MapDescription = {
      id: maps[index + 1].id,
      isUnlock: true,
      stars: maps[index + 1].stars,
    };

    const newMaps: Maps = [...maps.slice(0, index), indexMap, nextMap, ...maps.slice(index + 2)];

    return newMaps;
  }
}
