import Controls from './control-panel/control-panel';
import Hangar from './hangar/hangar';

class Race {
  private controls: Controls;
  private hangar: Hangar;

  constructor() {
    this.controls = new Controls();
    this.hangar = new Hangar();
  }
}

export default Race;
