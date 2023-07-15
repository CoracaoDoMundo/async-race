import './main.scss';
import '../../assets/fonts/fonts.scss';
import Header from '../header/header';
import Controls from '../control-panel/control-panel';
import Hangar from '../hangar/hangar';

class App {
  private header: Header;
  private controls: Controls;
  private hangar: Hangar;

  constructor() {
    this.header = new Header();
    this.controls = new Controls();
    this.hangar = new Hangar();
  }

  start() {}

  draw() {}
}

export default App;
