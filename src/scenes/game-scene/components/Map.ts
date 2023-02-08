import { LevelElements, Level } from 'types/types';
import config from 'const/tileConfig';
import { Levels } from 'const/levels';

export default class Map {
  public mapElements: LevelElements[];

  constructor(currentLevel: number, tileSize: number) {
    const map = Levels[currentLevel];
    this.mapElements = this.createLevelConfig(map, tileSize);
  }

  private createLevelConfig(levelScheme: Level, tileSize: number) {
    console.log(levelScheme);
    const levelElements: LevelElements[] = [];
    levelScheme.forEach((row, y) => {
      for (let i = 0; i < row.length; i += 1) {
        const tile = row[i];
        const x = i;
        if (tile !== ' ') {
          const info = {
            ...config[tile.toString()],
            x: x * tileSize,
            y: y * tileSize,
          };
          levelElements.push(info);
        }
      }
    });
    return levelElements;
  }
}
