import { hotkeys } from 'client/const/AppConstants';
import { HotkeysEvents } from 'common/types/events';
import { Scene } from 'phaser';

export default class HotkeysService {
  static initHotkeysEvents(scene: Scene) {
    const { keyboard } = scene.input;
    keyboard.on(`keydown-${hotkeys.back}`, () => scene.events.emit(HotkeysEvents.Back));
    keyboard.on(`keydown-${hotkeys.info}`, () => scene.events.emit(HotkeysEvents.Info));
    keyboard.on(`keydown-${hotkeys.levels}`, () => scene.events.emit(HotkeysEvents.Levels));
    keyboard.on(`keydown-${hotkeys.music}`, () => scene.events.emit(HotkeysEvents.Music));
    keyboard.on(`keydown-${hotkeys.mute}`, () => scene.events.emit(HotkeysEvents.Mute));
    keyboard.on(`keydown-${hotkeys.restart}`, () => scene.events.emit(HotkeysEvents.Restart));
    keyboard.on(`keydown-${hotkeys.sounds}`, () => scene.events.emit(HotkeysEvents.Sounds));
    keyboard.on(`keydown-${hotkeys.winners}`, () => scene.events.emit(HotkeysEvents.Winners));
  }

  static disablePopupHotkeys(scene: Scene) {
    scene.events.removeAllListeners(HotkeysEvents.Info);
    scene.events.removeAllListeners(HotkeysEvents.Levels);
    scene.events.removeAllListeners(HotkeysEvents.Winners);
  }

  static removeAllHotkeysEvents(scene: Scene) {
    scene.events.removeAllListeners(HotkeysEvents.Back);
    scene.events.removeAllListeners(HotkeysEvents.Info);
    scene.events.removeAllListeners(HotkeysEvents.Levels);
    scene.events.removeAllListeners(HotkeysEvents.Music);
    scene.events.removeAllListeners(HotkeysEvents.Mute);
    scene.events.removeAllListeners(HotkeysEvents.Restart);
    scene.events.removeAllListeners(HotkeysEvents.Sounds);
    scene.events.removeAllListeners(HotkeysEvents.Winners);
  }

  /* eslint-disable no-param-reassign */
  static keyBoardOff(scene: Scene) {
    scene.input.keyboard.enabled = false;
  }

  static keyBoardOn(scene: Scene) {
    scene.input.keyboard.enabled = true;
  }
  /* eslint-enable no-param-reassign */
}
