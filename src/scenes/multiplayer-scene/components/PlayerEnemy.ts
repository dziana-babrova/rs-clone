import Ball from 'components/Ball';
import Character from 'components/Character';
import characters from 'const/Characters';
import { playerProps, powerIndicatorProps } from 'const/scenes/MultiplayerSceneConsts';
import { Scene } from 'phaser';
import CalculateService from 'services/CalculateService';
import { Position } from 'types/types';
import MultiplayerTrajectory from './MultiplayerTrajectory';
import PowerPanel from './PowerPanel';

export default class PlayerEnemy {
  id: number;

  isReverse: boolean;

  position: Position;

  scene: Scene;

  score = 0;

  character: Character;

  constructor(scene: Scene, position: Position, isReverse: boolean, id: number) {
    this.scene = scene;
    this.position = position;
    this.character = new Character(scene, position, characters[id === 1 ? 0 : 1]);
    this.character.setDepth(50);
    if (isReverse) {
      this.character.scaleX = -this.character.scaleX;
    }
    this.isReverse = isReverse;
    this.id = id;
  }

}
