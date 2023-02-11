import platfrom from 'assets/platforms.png';
import texture from 'assets/platforms.json';
import SceneKeys from 'const/SceneKeys';
import TextureKeys from 'const/TextureKeys';
import START_SCENE from 'const/StartSceneConst';
import PRELOAD_SCENE from 'const/PreloadSceneConsts';
import Phaser from 'phaser';
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
    this.createLoader();
    this.load.on('progress', this.trackProgress.bind(this));
    this.load.on('fileprogress', this.trackFileProgress.bind(this));
    this.load.on('complete', this.removeLoader.bind(this));
  }

  public preload(): void {
    this.load.image('logo', '../assets/logo.png');
    this.load.image('eng', '../assets/eng.png');
    this.load.image('ru', '../assets/ru.png');
    this.load.image('close', '../assets/close.svg');
    this.load.image('ball', '../assets/Golf-Ball-big.png');

    this.load.atlas(TextureKeys.Platforms, platfrom, texture);

    this.load.audio('music', '../assets/music.mp3');

    Object.values(START_SCENE.btnSettings.type).forEach((btn) => {
      if (btn === 'sound') {
        this.load.image(`${btn}-on`, `../assets/${btn}-on.svg`);
        this.load.image(`${btn}-off`, `../assets/${btn}-off.svg`);
      } else {
        this.load.image(btn, `../assets/${btn}.svg`);
      }
    });
  }

  public create(): void {
    this.add.text(this.scale.width / 2, this.scale.height / 2, 'Loaded').setOrigin(0.5, 0.5);
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
}
