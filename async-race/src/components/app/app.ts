import './main.scss';
import '../../assets/fonts/fonts.scss';
import Header from '../header/header';
import Controls from '../control-panel/control-panel';

class App {
  private header: Header;
  private controls: Controls;

  constructor() {
    this.header = new Header();
    this.controls = new Controls();
  }

  start() {}

  draw() {}
}

export default App;
