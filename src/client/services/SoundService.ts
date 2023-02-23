import { Scene } from 'phaser';
import store from 'client/state/store';

export default class SoundService {
  static playSound(scene: Scene, key: string) {
    if (store.getState().app.sound) {
      scene.sound.add(key, {
        volume: 1,
        loop: false,
      }).play();
    }
  }

  static playMusic(scene: Scene, key: string) {
    if (store.getState().app.music) {
      scene.sound.add(key, {
        volume: 0.2,
        loop: true,
      }).play();
    } else {
      scene.sound.removeByKey(key);
    }
  }
}
