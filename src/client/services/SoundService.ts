/* eslint-disable no-param-reassign */
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
    if (store.getState().app.music && !scene.data.values.musicPlaying) {
      scene.sound.add(key, {
        volume: 0.2,
        loop: true,
      }).play();
      scene.data.values.musicPlaying = true;
    } else if (!store.getState().app.music) {
      scene.sound.removeByKey(key);
      scene.data.values.musicPlaying = false;
    }
  }
}
