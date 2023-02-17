import { LevelElements, Level } from 'types/types';
import config from 'const/TileConfig';
import { Levels } from 'const/Levels';

export default class MapService {
  public mapElements: LevelElements[];

  constructor(currentLevel: number, tileSize: number) {
    const map = Levels[currentLevel];
    this.mapElements = this.createLevelConfig(map, tileSize);
  }

  private createLevelConfig(levelScheme: Level, tileSize: number) {
    const levelElements: LevelElements[] = [];
    levelScheme.forEach((row, y) => {
      for (let i = 0; i < row.length; i += 1) {
        const tile = row[i];
        const x = i;
        if (tile !== ' ') {
          const element = {
            ...config[tile.toString()],
            x: x * tileSize,
            y: y * tileSize,
          };
          levelElements.push(element);
        }
      }
    });
    return levelElements;
  }

  public getFilteredElements(...types: string[]): LevelElements[] {
    const elements: LevelElements[] = [];
    types.forEach((type) => {
      elements.push(...this.mapElements.filter((el) => el.type === type));
    });
    return elements;
  }
}
