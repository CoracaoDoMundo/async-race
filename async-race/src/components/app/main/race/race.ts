import Controls from './control-panel/control-panel';
import Hangar from './hangar/hangar';
import Button from '../button/button';
import { BalloonData } from '../../../../utilities/types';
import Controller from '../../../../utilities/server-requests';
import BalloonBlock from './hangar/balloon-block/balloon-block';

class Race {
  private controls: Controls;
  private controller: Controller;
  private hangar: Hangar;

  constructor() {
    this.controls = new Controls();
    this.addListenerOnCreateButton(this.controls.createBtn);
    this.hangar = new Hangar();
    this.drawHangar();
    this.controller = Controller.getInstance();
  }

  async drawHangar() {
    await this.hangar.fillBalloonBlocks();
    this.addListenerOnRemoveButton(this.hangar.balloonBlocks);
  }

  addListenerOnCreateButton(btn: Button) {
    this.pushCreateButton(btn);
  }

  pushCreateButton(elem: Button) {
    elem.button.addEventListener('click', () => {
      let name: string;
      let color: string;
      let id: number;
      let index: number;
      let data: BalloonData;
      name = this.controls.inputCreate.input.value;
      color = this.controls.inputColorCreate.colorInput.value;
      this.controller
        .getGarageObject()
        .then((obj) => {
          const arr: number[] = Object.values(obj)
            .map((el) => el.id)
            .sort((a, b) => a - b);
          index = arr[arr.length - 1] + 1;
          this.controller.getBalloonInfo(index).then((obj) => {
            id = Object.values(obj)[Object.values(obj).length - 1] + 1;
            data = { name, color, id };
            this.controller.postNewBalloon(data);
          });
          this.controls.inputCreate.input.value = '';
        })
        .then(() => {
          this.controller
            .getGarageObject()
            .then(() => this.hangar.cleanBalloonBlocks())
            .then(() => this.hangar.fillBalloonBlocks());
        });
    });
  }

  pushRemoveBtn(elem: Button) {
    elem.button.addEventListener('click', () => {
      const id = Number(elem.button.id);
      this.controller.deleteBalloon(id);
    });
  }

  addListenerOnRemoveButton(arr: BalloonBlock[]) {
    arr.forEach((elem) => this.pushRemoveBtn(elem.removeBtn));
  }
}

export default Race;
