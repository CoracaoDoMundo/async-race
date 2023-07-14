import './main.scss';
import '../../assets/fonts/fonts.scss';
import Header from '../header/header';
import Controls from '../control-panel/control-panel';

class App {
  private header: Header;

  constructor() {
    this.header = new Header();
  }

  start() {}

  draw() {}
}

export default App;
