import Controls from './control-panel/control-panel';
import Hangar from './hangar/hangar';
import Button from '../button/button';
import {
  BalloonData,
  NameFirstPart,
  NameSecondPart,
  BalloonColor,
} from '../../../../utilities/types';
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
    this.pushPreviousPaginationButton(this.hangar.prevBtn);
    this.pushNextPaginationButton(this.hangar.nextBtn);
    this.drawHangar();
    this.controller = Controller.getInstance();
  }

  async drawHangar() {
    await this.hangar.fillBalloonBlocks(this.hangar.pageNum);
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
        if (this.hangar.pageNum === this.hangar.pagesQuantity) {
          this.hangar.cleanBalloonBlocks();
          this.drawHangar();
        }
        this.hangar.updateBalloonsNum(this.hangar.balloonNum);
        this.hangar.countPages();
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
        .then(() => {
          this.hangar.updateBalloonsNum(this.hangar.balloonNum);
          this.hangar.countPages();
        });
    });
  }

  addListenerOnRemoveButton(arr: BalloonBlock[]) {
    arr.forEach((elem) => this.pushRemoveBtn(elem.removeBtn));
  }

  pushNextPaginationButton(elem: Button) {
    elem.button.addEventListener('click', () => {
      if (this.hangar.pagesQuantity > 1 && this.hangar.pageNum < this.hangar.pagesQuantity) {
        this.hangar.pageNum += 1;
        localStorage.setItem('coracao_pageNum', `${this.hangar.pageNum}`);
        this.hangar.pageNumContainer.textContent = `# ${this.hangar.pageNum}`;
        this.hangar.cleanBalloonBlocks();
        this.drawHangar();
      }
    });
  }

  pushPreviousPaginationButton(elem: Button) {
    elem.button.addEventListener('click', () => {
      if (this.hangar.pagesQuantity > 1 && this.hangar.pageNum > 1) {
        this.hangar.pageNum -= 1;
        localStorage.setItem('coracao_pageNum', `${this.hangar.pageNum}`);
        this.hangar.pageNumContainer.textContent = `# ${this.hangar.pageNum}`;
        this.hangar.cleanBalloonBlocks();
        this.drawHangar();
      }
    });
  }
}

export default Race;
