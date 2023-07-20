import './app.scss';
import '../../assets/fonts/fonts.scss';
import Header from './header/header';
import Main from './main/main';
// import Controls from './main/race/control-panel/control-panel';
// import Hangar from './main/race/hangar/hangar';

class App {
  private header: Header;
  private main: Main;
  // private controls: Controls;
  // private hangar: Hangar;

  constructor() {
    this.header = new Header();
    this.main = new Main();
    // this.controls = new Controls();
    // this.hangar = new Hangar();
  }

  start() {}
}

export default App;
