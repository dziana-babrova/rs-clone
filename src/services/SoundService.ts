import { Scene } from 'phaser';
import { SoundsKeys } from 'types/enums';

export default class SoundService {
  static hitSound(scene: Scene) {
    console.log('hit');
    scene.sound.add(SoundsKeys.Hit, {
      volume: 1,
      loop: false,
    }).play();
  }

  static fireworksSound(scene: Scene) {
    scene.sound.add(SoundsKeys.Firework, {
      volume: 1,
      loop: false,
    }).play();
  }

  static readySound(scene: Scene) {
    scene.sound.add(SoundsKeys.Ready, {
      volume: 1,
      loop: false,
    }).play();
  }

  static clickSound(scene: Scene) {
    scene.sound.add(SoundsKeys.Click, {
      volume: 1,
      loop: false,
    }).play();
  }

  static starSound(scene: Scene) {
    scene.sound.add(SoundsKeys.Star, {
      volume: 1,
      loop: false,
    }).play();
  }

  static resultStarSound(scene: Scene) {
    scene.sound.add(SoundsKeys.ResultStar, {
      volume: 1,
      loop: false,
    }).play();
  }
}
