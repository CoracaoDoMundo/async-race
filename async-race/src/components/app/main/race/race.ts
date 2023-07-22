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

  async pushCreateButton(elem: Button) {
    elem.button.addEventListener('click', async () => {
      let name: string;
      let color: string;
      let id: number;
      let index: number;
      let data: BalloonData;
      name = this.controls.inputCreate.input.value;
      color = this.controls.inputColorCreate.colorInput.value;

      try {
        const obj = await this.controller.getGarageObject();
        const arr: number[] = Object.values(obj)
          .map((el) => el.id)
          .sort((a, b) => a - b);
        index = arr[arr.length - 1] + 1;
        const balloonInfo = await this.controller.getBalloonInfo(index);
        id =
          Object.values(balloonInfo)[Object.values(balloonInfo).length - 1] + 1;
        data = { name, color, id };
        await this.controller.postNewBalloon(data);
        this.controls.inputCreate.input.value = '';
        const updatedGarageObj = await this.controller.getGarageObject();
        // console.log('Object.values(updatedGarageObj).length:', Object.values(updatedGarageObj).length);
        if (Object.values(updatedGarageObj).length <= 7) {
          // ЗДЕСЬ ДОБАВИТЬ ПРО НОМЕР СТРАНИЦЫ, КОГДА БУДЕТ ПАГИНАЦИЯ
          this.hangar.cleanBalloonBlocks();
          this.drawHangar();
        }
        this.hangar.updateBalloonsNum(this.hangar.balloonNum);
      } catch (error) {
        console.log('Something went wrong!');
      }
    });
  }

  pushRemoveBtn(elem: Button) {
    this.hangar.balloonBlocks = [];
    elem.button.addEventListener('click', () => {
      const id = Number(elem.button.id);
      this.controller.deleteBalloon(id);
      this.controller
        .getGarageObject()
        .then(() => this.hangar.cleanBalloonBlocks())
        .then(() => this.drawHangar())
        .then(() => this.hangar.updateBalloonsNum(this.hangar.balloonNum));
    });
  }

  addListenerOnRemoveButton(arr: BalloonBlock[]) {
    arr.forEach((elem) => this.pushRemoveBtn(elem.removeBtn));
  }
}

export default Race;
