/* eslint-disable @typescript-eslint/no-unused-expressions */
import { GAME_SCENE, levelText } from 'client/const/scenes/GameSceneConsts';
import store from 'client/state/store';
import { LocalStorageKeys } from 'client/const/AppConstants';
import LocalStorageService from 'client/services/LocalStorageService';
import SoundService from 'client/services/SoundService';
import {
  TextureKeys, TopPanelFrames, SoundsKeys, SceneKeys,
} from 'common/types/enums';
import { Scene } from 'phaser';
import { setMusic, setSound } from 'client/state/features/AppSlice';
import { SwitchLevel } from 'common/types/types';
import { EventNames } from 'common/types/events';
import Levels from '../popups/Levels';

export default class TopPanel extends Phaser.GameObjects.Container {
  levelText!: Phaser.GameObjects.Text;

  popup: null | undefined | Levels;

  leftButtons: { [key: string]: Phaser.GameObjects.Image };

  rightButtons: { [key: string]: Phaser.GameObjects.Image };

  sceneKey: string;

  goTo: SwitchLevel;

  level: number;

  constructor(
    scene: Scene,
    sceneKey: string,
    hasRestart: boolean,
    hasLevels: boolean,
    goTo: SwitchLevel,
    level?: number,
  ) {
    super(scene);
    this.leftButtons = {};
    this.rightButtons = {};
    this.sceneKey = sceneKey;
    this.level = level || 1;
    this.createLevelText(level);
    this.createButtons(hasRestart, hasLevels);
    this.goTo = goTo.bind(scene);
    this.initEvents(goTo);
    this.add([...Object.values(this.leftButtons), ...Object.values(this.rightButtons)]);
    this.scene.add.existing(this);
  }

  private createLevelText(level?: number) {
    const text = level ? `Level ${(level + 1).toString().padStart(3, '0')}` : '';
    this.levelText = this.scene.add
      .text(this.scene.scale.width / 2, 50, text, levelText)
      .setOrigin(0.5);
    this.add(this.levelText);
  }

  private createButtons(hasRestart: boolean, hasLevels: boolean) {
    const musicState = store.getState().app.music;
    const soundState = store.getState().app.sound;
    const musicTexture = musicState ? TopPanelFrames.MusicOn : TopPanelFrames.MusicOff;
    const soundTexture = soundState ? TopPanelFrames.SoundOn : TopPanelFrames.SoundOff;

    this.createRightButton(musicTexture, 'music');
    this.createRightButton(soundTexture, 'sound');
    this.createLeftButton(TopPanelFrames.Back, true);
    this.createLeftButton(TopPanelFrames.Info, true);
    this.createLeftButton(TopPanelFrames.Restart, hasRestart);
    this.createLeftButton(TopPanelFrames.Levels, hasLevels);

    Object.values(this.rightButtons).forEach((el, i) => {
      el.setY(GAME_SCENE.topPanel.paddingY).setX(
        this.scene.scale.width - (el.width * i + GAME_SCENE.topPanel.paddingX),
      );
    });

    Object.values(this.leftButtons).forEach((el, i) => {
      el.setY(GAME_SCENE.topPanel.paddingY).setX(el.width * i + GAME_SCENE.topPanel.paddingX);
    });
  }

  private createRightButton(texture: string, key: string): void {
    const button = this.scene.add
      .image(0, 0, TextureKeys.TopPanel, texture)
      .setInteractive({ useHandCursor: true })
      .setScale(0.8);

    this.rightButtons[key] = button;
  }

  private createLeftButton(texture: string, visible: boolean): void {
    const button = this.scene.add
      .image(0, 0, TextureKeys.TopPanel, texture)
      .setInteractive({ useHandCursor: true })
      .setScale(0.8);
    button.setVisible(visible);

    this.leftButtons[texture] = button;
  }

  private initEvents(goTo: SwitchLevel): void {
    this.rightButtons.music.on('pointerup', this.toggleMusic.bind(this));
    this.rightButtons.sound.on('pointerup', this.toggleSound.bind(this));
    this.leftButtons[TopPanelFrames.Back].on('pointerup', goTo.bind(this.scene, SceneKeys.Start));
    this.leftButtons[TopPanelFrames.Restart].on(
      'pointerup',
      goTo.bind(this.scene, this.sceneKey, false),
    );
    this.leftButtons[TopPanelFrames.Levels].on('pointerup', this.openLevels.bind(this));
  }

  public toggleMusic(): void {
    const isPlaying = store.getState().app.music;
    const musicTexture = isPlaying ? TopPanelFrames.MusicOff : TopPanelFrames.MusicOn;
    store.dispatch(setMusic(!isPlaying));
    LocalStorageService.setItem<boolean>(LocalStorageKeys.music, !isPlaying);
    SoundService.playMusic(this.scene, SoundsKeys.Music);
    this.rightButtons.music.setTexture(TextureKeys.TopPanel, musicTexture);
  }

  public toggleSound(): void {
    const isPlaying = store.getState().app.sound;
    const soundTexture = isPlaying ? TopPanelFrames.SoundOff : TopPanelFrames.SoundOn;
    store.dispatch(setSound(!isPlaying));
    LocalStorageService.setItem<boolean>(LocalStorageKeys.sound, !isPlaying);
    this.rightButtons.sound.setTexture(TextureKeys.TopPanel, soundTexture);
  }

  public openLevels(): void {
    if (!this.popup) {
      this.popup = new Levels(this.scene, this.level);
      this.toggleButtonsInteractivity(false);
      this.popup.onClosePopup = this.toggleButtonsInteractivity.bind(this, true);
      this.popup.startLevel = this.startLevel.bind(this);
    }
  }

  public toggleButtonsInteractivity(isDisabled: boolean): void {
    const interactive = isDisabled ? 'setInteractive' : 'disableInteractive';
    Object.keys(this.leftButtons).forEach((el) => {
      this.leftButtons[el][interactive]();
    });
    Object.keys(this.rightButtons).forEach((el) => {
      this.rightButtons[el][interactive]();
    });
    this.popup = isDisabled ? null : this.popup;
    this.scene.events.emit(isDisabled ? EventNames.PopupClosed : EventNames.PopupOpen);
  }

  private startLevel(level?: number) {
    this.scene.cameras.main.fadeOut();
    this.scene.data.values.stars = 0;
    this.scene.data.values.isGameOver = false;
    this.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.scene.scene.stop();
        this.scene.events.removeListener(EventNames.BallStop);
        this.scene.scene.start(SceneKeys.Game, { level });
      },
    });
  }

  public handleEscInput() {
    if (this.popup) {
      this.popup.closePopup();
    } else {
      this.goTo(SceneKeys.Start);
    }
  }

  public openInfo() {}

  public toggleMute() {
    const isMusicPlaying = store.getState().app.music;
    const isSoundsPlaying = store.getState().app.sound;
    if (!isMusicPlaying && !isSoundsPlaying) {
      this.toggleMusic();
      this.toggleSound();
      return;
    }
    if (isMusicPlaying) this.toggleMusic();
    if (isSoundsPlaying) this.toggleSound();
  }

  public restart() {
    this.goTo(this.sceneKey, false);
  }
}
