import { hotkeys } from "client/const/AppConstants";
import { HotkeysEvents } from "common/types/events";
import { Scene } from "phaser";

export default class HotkeysService {

  static initHotkeysEvents(scene: Scene){
    const keyboard = scene.input.keyboard;
    keyboard.on(`keydown-${hotkeys.back}`, () => scene.events.emit(HotkeysEvents.Back));
    keyboard.on(`keydown-${hotkeys.info}`, () => scene.events.emit(HotkeysEvents.Info));
    keyboard.on(`keydown-${hotkeys.levels}`, () => scene.events.emit(HotkeysEvents.Levels));
    keyboard.on(`keydown-${hotkeys.music}`, () => scene.events.emit(HotkeysEvents.Music));
    keyboard.on(`keydown-${hotkeys.mute}`, () => scene.events.emit(HotkeysEvents.Mute));
    keyboard.on(`keydown-${hotkeys.restart}`, () => scene.events.emit(HotkeysEvents.Restart));
    keyboard.on(`keydown-${hotkeys.sounds}`, () => scene.events.emit(HotkeysEvents.Sounds));
    keyboard.on(`keydown-${hotkeys.winners}`, () => scene.events.emit(HotkeysEvents.Winners));
  }

  disablePopupHotkeys(scene: Scene){
    scene.input.keyboard.removeKey(hotkeys.levels);
    scene.input.keyboard.removeKey(hotkeys.info);
    scene.input.keyboard.removeKey(hotkeys.winners);
  }

}