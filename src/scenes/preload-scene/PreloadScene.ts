import platfrom from 'assets/platforms.png';
import texture from 'assets/platforms.json';
import {
  SceneKeys, TextureKeys, AnimationKeys, SoundsKeys,
} from 'types/enums';
import START_SCENE from 'const/scenes/StartSceneConst';
import PRELOAD_SCENE from 'const/scenes/PreloadSceneConsts';
import Phaser from 'phaser';
import LocalStorageService from 'services/LocalStorageService';
import { LocalStorageKeys } from 'const/AppConstants';
import {
  axiosGetMaps, setLang, setMusic, setSound,
} from 'state/features/AppSlice';
import store from 'state/store';
import { Language } from 'const/Language';
import { axiosCheckAuth } from 'state/features/UserSlice';
import ProgressAssets from './components/ProgressAssets';
import ProgressBar from './components/ProgressBar';
import ProgressBox from './components/ProgressBox';
import ProgressPercentText from './components/ProgressPercentText';
import ProgressText from './components/ProgressText';

export default class PreloadScene extends Phaser.Scene {
  progressBar!: ProgressBar;

  progressBox!: ProgressBox;

  progressText!: ProgressText;

  progressPercentText!: ProgressPercentText;

  progressAssets!: ProgressAssets;

  constructor() {
    super(SceneKeys.Preloader);
  }

  public init(): void {
    this.setStoreFromLocalStorage();

    this.createLoader();
    this.load.on('progress', this.trackProgress.bind(this));
    this.load.on('fileprogress', this.trackFileProgress.bind(this));
    this.load.on('complete', this.removeLoader.bind(this));
  }

  public preload(): void {
    if (LocalStorageService.getAccessToken()) {
      store.dispatch(axiosCheckAuth()).then(() => {
        if (store.getState().user.isAuth) {
          store.dispatch(axiosGetMaps());
        }
      });
    }
    this.load.image(TextureKeys.Logo, '../assets/logo.png');
    this.load.image(TextureKeys.eng, '../assets/eng.png');
    this.load.image(TextureKeys.ru, '../assets/ru.png');
    this.load.image(TextureKeys.Close, '../assets/close.svg');
    this.load.image(TextureKeys.Next, '../assets/next.svg');
    this.load.image(TextureKeys.Restart, '../assets/restart.svg');
    this.load.image(TextureKeys.Ball, '../assets/Golf-Ball-big.png');

    this.load.atlas(TextureKeys.Platforms, platfrom, texture);
    this.load.atlas(TextureKeys.Flag, '../assets/flag.png', '../assets/flag.json');

    this.textures.generate(TextureKeys.Fireworks, PRELOAD_SCENE.fireworksTexture);

    this.load.audio('music', '../assets/music.mp3');
    this.load.audio(SoundsKeys.Hit, '../assets/music/hit.mp3');
    this.load.audio(SoundsKeys.Firework, '../assets/music/firework.mp3');
    this.load.audio(SoundsKeys.Ready, '../assets/music/ready.mp3');
    this.load.audio(SoundsKeys.Click, '../assets/music/click.mp3');
    this.load.audio(SoundsKeys.Star, '../assets/music/star.mp3');
    this.load.audio(SoundsKeys.ResultStar, '../assets/music/result-star.mp3');
    this.load.audio(SoundsKeys.GameOver, '../assets/music/game-over.mp3');

    Object.values(START_SCENE.btnSettings.type).forEach((btn) => {
      if (btn === 'music') {
        this.load.image(TextureKeys.MusicOn, `../assets/${btn}-on.svg`);
        this.load.image(TextureKeys.MusicOff, `../assets/${btn}-off.svg`);
      } else {
        this.load.image(btn, `../assets/${btn}.svg`);
      }
    });
  }

  public create(): void {
    this.anims.create({
      key: AnimationKeys.Wave,
      frames: this.anims.generateFrameNames(TextureKeys.Flag, {
        prefix: '',
        start: 1,
        end: 16,
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: 10,
    });

    this.scene.start(SceneKeys.Start);
  }

  private trackProgress(value: number): void {
    this.progressBar.fillProgressBar(value);
    this.progressPercentText.updatePercentage(value);
  }

  private trackFileProgress(file: Phaser.Loader.File): void {
    this.progressAssets.updateAssetName(file);
  }

  private removeLoader(): void {
    this.progressText.destroy();
    this.progressPercentText.destroy();
    this.progressAssets.destroy();
    this.progressBar.destroy();
    this.progressBox.destroy();
  }

  createLoader() {
    this.progressBar = new ProgressBar(this, PRELOAD_SCENE.gradientRectangle);
    this.progressBox = new ProgressBox(this, PRELOAD_SCENE.coloredRectangle);
    this.progressText = new ProgressText(this, PRELOAD_SCENE.mainText);
    this.progressPercentText = new ProgressPercentText(this, PRELOAD_SCENE.secondaryText);
    this.progressAssets = new ProgressAssets(this, PRELOAD_SCENE.secondaryText);
  }

  private setStoreFromLocalStorage(): void {
    const lsLang: Language | null = LocalStorageService.getItem(LocalStorageKeys.lang);
    const lsMusic: boolean | null = LocalStorageService.getItem(LocalStorageKeys.music);
    console.log('lsMusic: ', lsMusic);
    const lsSound: boolean | null = LocalStorageService.getItem(LocalStorageKeys.sound);
    if (lsLang !== null) store.dispatch(setLang(lsLang));
    if (lsMusic !== null) store.dispatch(setMusic(lsMusic));
    if (lsSound !== null) store.dispatch(setSound(lsSound));
  }
}
