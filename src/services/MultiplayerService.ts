import { LevelElements, Level } from 'types/types';
import config from 'const/TileConfig';
import { multiPlayerMap } from 'const/MultiplayerLevels';

export default class MultiplayerService {

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
  
  

}
