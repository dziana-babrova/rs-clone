import platfrom from 'client/assets/platforms.png';
import texture from 'client/assets/platforms.json';
import {
  SceneKeys, TextureKeys, AnimationKeys, SoundsKeys, BackgroundKeys,
} from 'common/types/enums';
import PRELOAD_SCENE from 'client/const/scenes/PreloadSceneConsts';
import Phaser from 'phaser';
import LocalStorageService from 'client/services/LocalStorageService';
import { LocalStorageKeys } from 'client/const/AppConstants';
import {
  axiosCreateMaps,
  axiosGetMaps, setBackground, setLang, setMaps, setMusic, setSound,
} from 'client/state/features/AppSlice';
import store from 'client/state/store';
import { Language } from 'client/const/Language';
import { axiosCheckAuth } from 'client/state/features/UserSlice';
import MapService from 'client/services/MapService';
import { Maps } from 'common/types/types';
import { START_SCENE } from 'client/const/scenes/StartSceneConst';
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
          store.dispatch(axiosGetMaps()).then((response) => {
            if ('error' in response) {
              store.dispatch(axiosCreateMaps(MapService.getDefaultMapsObject()));
            }
          });
        } else {
          this.getMapsFromLocalStorage();
        }
      });
    } else {
      this.getMapsFromLocalStorage();
    }
    this.load.image(TextureKeys.Logo, '../assets/logo.png');
    this.load.image(TextureKeys.eng, '../assets/eng.png');
    this.load.image(TextureKeys.ru, '../assets/ru.png');
    this.load.image(TextureKeys.Close, '../assets/close.svg');
    this.load.image(TextureKeys.Next, '../assets/next.svg');
    this.load.image(TextureKeys.Restart, '../assets/restart.svg');
    this.load.image(TextureKeys.Ball, '../assets/Golf-Ball-big.png');
    this.load.image(TextureKeys.MiniBall, '../assets/mini-ball.png');
    this.load.image(TextureKeys.Saw, '../assets/saw.png');
    this.load.image(TextureKeys.LevelEmpty, '../assets/levelEmpty.svg');
    this.load.image(TextureKeys.LevelOneStar, '../assets/level1.svg');
    this.load.image(TextureKeys.LevelTwoStars, '../assets/level2.svg');
    this.load.image(TextureKeys.LevelThreeStars, '../assets/level3.svg');
    this.load.image(TextureKeys.LevelLock, '../assets/levelLock.svg');

    this.load.atlas(TextureKeys.Platforms, platfrom, texture);
    this.load.atlas(TextureKeys.Flag, '../assets/flag.png', '../assets/flag.json');
    this.load.atlas(
      TextureKeys.Background,
      '../assets/background.png',
      '../assets/background.json',
    );
    this.load.atlas(TextureKeys.Water, '../assets/water.png', '../assets/water.json');

    this.load.json('star', '../assets/star.json');

    this.textures.generate(TextureKeys.Fireworks, PRELOAD_SCENE.fireworksTexture);

    this.load.audio(SoundsKeys.Music, '../assets/music.mp3');
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

    this.load.atlas('player1', 'assets/players/player1/player1.png', 'assets/players/player1/player1.json');
    this.load.atlas('player2', 'assets/players/player2/player2.png', 'assets/players/player2/player2.json');
  }

  public create(): void {
    this.anims.create({
      key: AnimationKeys.Wave,
      frames: this.anims.generateFrameNames(TextureKeys.Flag, {
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
    const lsSound: boolean | null = LocalStorageService.getItem(LocalStorageKeys.sound);
    const lsBackground: BackgroundKeys | null = LocalStorageService.getItem(
      LocalStorageKeys.background,
    );
    if (lsLang !== null) store.dispatch(setLang(lsLang));
    if (lsMusic !== null) store.dispatch(setMusic(lsMusic));
    if (lsSound !== null) store.dispatch(setSound(lsSound));
    if (lsBackground !== null) store.dispatch(setBackground(lsBackground));
  }

  private getMapsFromLocalStorage() {
    console.log('getMapsFromLocalStorage');
    const maps: Maps | null = LocalStorageService.getItem(LocalStorageKeys.maps);
    if (maps === null) {
      store.dispatch(setMaps(MapService.getDefaultMapsObject()));
    } else {
      store.dispatch(setMaps(maps));
    }
  }
}
