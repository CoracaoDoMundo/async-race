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
    this.addListenerOnUpdateButton(this.controls.updateBtn);
    this.pushGenerateBalloonsButton(this.controls.generateBtn);
    this.hangar = new Hangar();
    this.pushPreviousPaginationButton(this.hangar.prevBtn);
    this.pushNextPaginationButton(this.hangar.nextBtn);
    this.drawHangar();
    this.controller = Controller.getInstance();
  }

  async drawHangar(): Promise<void> {
    await this.hangar.fillBalloonBlocks(this.hangar.pageNum);
    this.addListenerOnRemoveButton(this.hangar.balloonBlocks);
    this.addListenerOnSelectButton(this.hangar.balloonBlocks);
    this.addListenerOnUpButton(this.hangar.balloonBlocks);
    this.hangar.balloonBlocks = [];
  }

  async pushCreateButton(elem: Button): Promise<void> {
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

  addListenerOnCreateButton(btn: Button): void {
    this.pushCreateButton(btn);
  }

  pushUpdateButton(elem: Button): void {
    elem.button.addEventListener('click', async (): Promise<void> => {
      let name: string;
      let color: string;
      let data: BalloonData;
      name = this.controls.inputUpdate.input.value;
      color = this.controls.inputColorUpdate.colorInput.value;

      try {
        data = { name, color };
        if (typeof this.hangar.selected === 'number') {
          await this.controller.postUpdatedBalloon(this.hangar.selected, data);
          this.controls.inputUpdate.input.value = '';
          this.controls.inputUpdate.input.setAttribute('disabled', '');
          this.controls.inputColorUpdate.colorInput.setAttribute(
            'disabled',
            ''
          );
          this.controls.updateBtn.button.classList.add('inactive');
          const updatedGarageObj = await this.controller.getGarageObject();
          this.hangar.cleanBalloonBlocks();
          this.drawHangar();
          this.hangar.selected = null;
        }
      } catch (error) {
        console.log('Something went wrong!');
      }
    });
  }

  addListenerOnUpdateButton(btn: Button): void {
    this.pushUpdateButton(btn);
  }

  pushRemoveBtn(elem: Button): void {
    elem.button.addEventListener('click', (): void => {
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

  addListenerOnRemoveButton(arr: BalloonBlock[]): void {
    arr.forEach((elem) => this.pushRemoveBtn(elem.removeBtn));
  }

  pushSelectBtn(elem: Button): void {
    elem.button.addEventListener('click', async (event): Promise<void> => {
      this.hangar.selected = Number(elem.button.id);
      this.controls.inputUpdate.input.removeAttribute('disabled');
      if (this.hangar.selected !== null) {
        const balloonInfo = await this.controller.getBalloonInfo(
          this.hangar.selected
        );
        this.controls.inputUpdate.input.value = Object.values(balloonInfo)[0];
        this.controls.inputColorUpdate.colorInput.removeAttribute('disabled');
        this.controls.inputColorUpdate.colorInput.value =
          Object.values(balloonInfo)[1];
      }
      this.controls.updateBtn.button.classList.remove('inactive');
    });
  }

  addListenerOnSelectButton(arr: BalloonBlock[]): void {
    arr.forEach((elem): void => this.pushSelectBtn(elem.selectBtn));
  }

  pushNextPaginationButton(elem: Button): void {
    elem.button.addEventListener('click', (): void => {
      if (
        this.hangar.pagesQuantity > 1 &&
        this.hangar.pageNum < this.hangar.pagesQuantity
      ) {
        this.hangar.prevBtn.button.classList.remove('inactive');
        this.hangar.pageNum += 1;
        localStorage.setItem('coracao_pageNum', `${this.hangar.pageNum}`);
        this.hangar.pageNumContainer.textContent = `# ${this.hangar.pageNum}`;
        this.hangar.cleanBalloonBlocks();
        this.drawHangar();
        if (this.hangar.pageNum === this.hangar.pagesQuantity) {
          this.hangar.nextBtn.button.classList.add('inactive');
        }
      }
    });
  }

  pushPreviousPaginationButton(elem: Button): void {
    elem.button.addEventListener('click', (): void => {
      if (this.hangar.pagesQuantity > 1 && this.hangar.pageNum > 1) {
        this.hangar.nextBtn.button.classList.remove('inactive');
        this.hangar.pageNum -= 1;
        localStorage.setItem('coracao_pageNum', `${this.hangar.pageNum}`);
        this.hangar.pageNumContainer.textContent = `# ${this.hangar.pageNum}`;
        this.hangar.cleanBalloonBlocks();
        this.drawHangar();
        if (this.hangar.pageNum === 1) {
          this.hangar.prevBtn.button.classList.add('inactive');
        }
      }
    });
  }

  createDataForBalloon(): BalloonData {
    let data: BalloonData = {
      name:
        NameFirstPart[Math.floor(Math.random() * 11)] +
        ' ' +
        NameSecondPart[Math.floor(Math.random() * 11)],
      color: BalloonColor[Math.floor(Math.random() * 25)],
      id: 0,
    };
    return data;
  }

  async createHundredOfBalloons(id: number): Promise<void> {
    let i = 0;
    let index: number = id;
    let data: BalloonData;
    while (i < 99) {
      data = this.createDataForBalloon();
      index += 1;
      data.id = index;
      await this.controller.postNewBalloon(data);
      i += 1;
    }
  }

  pushGenerateBalloonsButton(elem: Button): void {
    elem.button.addEventListener('click', async (): Promise<void> => {
      let id: number;
      let index: number;
      let data: BalloonData = this.createDataForBalloon();

      try {
        const obj = await this.controller.getGarageObject();
        const arr: number[] = Object.values(obj)
          .map((el) => el.id)
          .sort((a, b) => a - b);
        index = arr[arr.length - 1] + 1;
        const balloonInfo = await this.controller.getBalloonInfo(index);
        id =
          Object.values(balloonInfo)[Object.values(balloonInfo).length - 1] + 1;
        data.id = id;
        await this.controller.postNewBalloon(data);
        await this.createHundredOfBalloons(id);

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

  pushUpButton(elem: Button): void {
    elem.button.addEventListener('click', (): void => {

    });
  }

  addListenerOnUpButton(arr: BalloonBlock[]): void {
    arr.forEach((elem): void => this.pushUpButton(elem.upButton));
  }
}

export default Race;
