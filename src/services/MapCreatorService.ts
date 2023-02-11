import { LevelElements, Level } from 'types/types';
import config from 'const/tileConfig';
import { Levels } from 'const/levels';

export default class MapCreatorService {
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
}
