import ElementsFactory from '../ElementGenerator';
import Preload from '../../assets/preload.gif';
import '../../styles/_loader.scss';

class Loader {
  wrapper: HTMLDivElement;

  constructor() {
    this.wrapper = ElementsFactory.createDivElement('preloader-wrapper');
    const img = new Image();
    img.src = Preload;
    img.alt = 'Loading...';
    img.classList.add('preloader-image');
    this.wrapper.append(img);
    this.wrapper.onclick = (e) => {
      e.stopImmediatePropagation();
    };
    // this.hideLoader();
  }

  showLoader() {
    this.wrapper.style.display = 'block';
  }

  hideLoader() {
    this.wrapper.style.display = 'none';
  }
}

export default new Loader();
