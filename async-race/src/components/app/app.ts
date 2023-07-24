import './app.scss';
import '../../assets/fonts/fonts.scss';
import Header from './header/header';
import Main from './main/main';

class App {
  private header: Header;
  private main: Main;

  constructor() {
    this.header = new Header();
    this.main = new Main(this.header.hangarBtn, this.header.winnersBtn);
  }

  start(): void {}
}

export default App;
