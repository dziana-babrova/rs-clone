import Character from 'client/components/Character';
import characters from 'client/const/Characters';
import { Scene } from 'phaser';
import { Position } from 'common/types/types';

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

  destroyPlayer() {
    this.character.destroy();
  }
}
