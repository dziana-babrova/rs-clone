import SceneKeys from 'const/SceneKeys';
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
    // to test
    // this.load.image('logo', 'saw.png');
    // for (let i = 0; i < 500; i += 1) {
    //   this.load.image(`logo: ${i}`, 'saw.png');
    // }
  }

  public create(): void {
    // to test
    // const logo = this.add.image(this.scale.width / 2, this.scale.height / 2, 'logo');
  }

  private trackProgress(value: number): void {
    this.progressBar.fillProgressBar(value);
    this.progressPercentText.updatePercentage(value);
  }

  private trackFileProgress(file: Phaser.Loader.File): void {
    this.progressAssets.updateAssetName(file);
  }

  private removeLoader(): void {
    this.progressBar.destroy();
    this.progressBox.destroy();
    this.progressText.destroy();
    this.progressPercentText.destroy();
    this.progressAssets.destroy();
  }

  createLoader() {
    this.progressBar = new ProgressBar(this);
    this.progressBox = new ProgressBox(this);
    this.progressText = new ProgressText(this, 0, 0, 'Loading...', {
      font: '20px monospace',
    });
    this.progressPercentText = new ProgressPercentText(this, 0, 0, '0%', {
      font: '18px monospace',
    });
    this.progressAssets = new ProgressAssets(this, 0, 0, '', {
      font: '18px monospace',
    });
  }
}
