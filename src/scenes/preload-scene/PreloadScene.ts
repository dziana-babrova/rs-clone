import SceneKeys from 'const/SceneKeys';
import START_SCENE from 'const/StartSceneConst';
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
    this.load.image('logo', 'logo.png');
    this.load.image('eng', 'eng.png');
    this.load.image('ball', '../assets/Golf-Ball-big.png');

    Object.values(START_SCENE.btnSettings.type).forEach((btn) => {
      this.load.image(btn, `${btn}.svg`);
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
    this.progressBar = new ProgressBar(this);
    this.progressBox = new ProgressBox(this);
    this.progressText = new ProgressText(this, {
      x: 0,
      y: 0,
      text: 'Loading...',
      style: {
        font: '20px monospace',
      },
    });

    this.progressPercentText = new ProgressPercentText(this, {
      x: 0,
      y: 0,
      text: '0%',
      style: {
        font: '18px monospace',
      },
    });

    this.progressAssets = new ProgressAssets(this, {
      x: 0,
      y: 0,
      text: '',
      style: {
        font: '18px monospace',
      },
    });
  }
}
