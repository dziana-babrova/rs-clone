import { GameObjects, Scene } from 'phaser';
import { CharacterSettings, Position } from 'types/types';

export default class Character extends GameObjects.Sprite {
  readonly character: CharacterSettings;

  constructor(scene: Scene, position: Position, character: CharacterSettings) {
    super(scene, position.x, -250, character.texture, character.basicFrame);
    this.character = character;
    this.scene.add.existing(this);
    this.createAnimations();
    this.scale = character.scale;
    this.y = position.y - this.height / 4 - character.correction;
    this.on('animationcomplete', this.setDefaultPosition.bind(this));
  }

  setCharacterPosition(position: Position) {
    this.x = position.x;
    this.y = position.y - this.height / 4 - this.character.correction;
  }

  setDefaultPosition() {
    if (this.anims.currentAnim.key === this.character.animations.hit.name) {
      this.anims.play(this.character.animations.back.name);
    }
  }

  private createAnimations() {
    this.anims.create({
      key: this.character.animations.prepare.name,
      frames: this.anims.generateFrameNames(this.character.texture, {
        prefix: this.character.animations.prepare.prefix,
        suffix: this.character.animations.prepare.postfix,
        start: this.character.animations.prepare.start,
        end: this.character.animations.prepare.end,
        zeroPad: this.character.animations.prepare.zeroPad,
      }),
      frameRate: this.character.animations.prepare.frameRate,
    });
    this.anims.create({
      key: this.character.animations.hit.name,
      frames: this.anims.generateFrameNames(this.character.texture, {
        prefix: this.character.animations.hit.prefix,
        suffix: this.character.animations.hit.postfix,
        start: this.character.animations.hit.start,
        end: this.character.animations.hit.end,
        zeroPad: this.character.animations.hit.zeroPad,
      }),
      frameRate: this.character.animations.hit.frameRate,
    });
    this.anims.create({
      key: this.character.animations.back.name,
      frames: this.anims.generateFrameNames(this.character.texture, {
        prefix: this.character.animations.back.prefix,
        suffix: this.character.animations.back.postfix,
        start: this.character.animations.back.start,
        end: this.character.animations.back.end,
        zeroPad: this.character.animations.back.zeroPad,
      }),
      frameRate: this.character.animations.back.frameRate,
    });
  }

  prepare() {
    this.anims.play(this.character.animations.prepare.name);
  }

  hit() {
    this.anims.play(this.character.animations.hit.name);
  }

  show() {
    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      yoyo: false,
      duration: 300,
      ease: 'Ease-in-out',
    });
  }

  hide() {
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      yoyo: false,
      duration: 300,
      ease: 'Ease-in-out',
    });
  }
}
