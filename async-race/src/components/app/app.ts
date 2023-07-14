import './main.scss';
import '../../assets/fonts/fonts.scss';
import Header from '../header/header';

class App {
  private header: Header;

  constructor() {
    this.header = new Header();
  }

  start() {
    this.header.draw();
  }

  draw() {}
}

export default App;
