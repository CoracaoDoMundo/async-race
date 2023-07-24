import Controls from './control-panel/control-panel';
import Hangar from './hangar/hangar';
import Button from '../button/button';
import {
  BalloonData,
  NameFirstPart,
  NameSecondPart,
  BalloonColor,
  QueryBurnerParams,
} from '../../../../utilities/types';
import Controller from '../../../../utilities/server-requests';
import BalloonBlock from './hangar/balloon-block/balloon-block';
import {
  moveBalloon,
  moveBalloonOnStart,
} from '../../../../utilities/service-functions';

class Race {
  public controls: Controls;
  private controller: Controller;
  public hangar: Hangar;

  constructor() {
    this.controls = new Controls();
    this.hangar = new Hangar();
    this.drawHangar();
    this.addListeners();
    this.controller = Controller.getInstance();
  }

  draw() {
    this.controls.draw();
    this.hangar.draw();
  }

  addListeners() {
    this.pushPreviousPaginationButton(this.hangar.prevBtn);
    this.pushNextPaginationButton(this.hangar.nextBtn);
    this.addListenerOnCreateButton(this.controls.createBtn);
    this.addListenerOnUpdateButton(this.controls.updateBtn);
    this.pushGenerateBalloonsButton(this.controls.generateBtn);
    this.pushRaceButton(this.controls.raceBtn);
    this.pushResetButton(this.controls.resetBtn);
  }

  removeContentWhileChangePage() {
    this.controls.controlBlock.remove();
    this.hangar.hangarBlock.remove();
    this.hangar.balloonBlocksContainer.remove();
  }

  async drawHangar(): Promise<void> {
    this.hangar.balloonBlocks = [];
    await this.hangar.fillBalloonBlocks(this.hangar.pageNum);
    this.addListenerOnRemoveButton(this.hangar.balloonBlocks);
    this.addListenerOnSelectButton(this.hangar.balloonBlocks);
    this.addListenerOnUpButton(this.hangar.balloonBlocks);
    this.addListenerOnLandButton(this.hangar.balloonBlocks);
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
          this.toggleInactiveStatusForBtn(
            this.controls.updateBtn.button,
            'inactive'
          );
          // this.controls.updateBtn.button.classList.add('inactive');
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
      // this.controls.updateBtn.button.classList.remove('inactive');
      this.toggleInactiveStatusForBtn(this.controls.updateBtn.button, 'active');
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
        this.controls.raceBtn.button.classList.remove('inactive');
        this.controls.resetBtn.button.classList.add('inactive');
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
        this.controls.raceBtn.button.classList.remove('inactive');
        this.controls.resetBtn.button.classList.add('inactive');
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
        this.hangar.nextBtn.button.classList.remove('inactive');
        this.hangar.countPages();
      } catch (error) {
        console.log('Something went wrong!');
      }
    });
  }

  async pushUpButton(elem: HTMLDivElement) /*: Promise<void>*/ {
    if (!elem.classList.contains('inactive')) {
      let data: QueryBurnerParams = {
        id: Number(elem.id),
        status: 'started',
      };
      // console.log('data before start/stop:', data);
      // let driveResponse: Promise<{ success: boolean } | void>;
      const startResponse = await this.controller.startStopBurner(data);
      // console.log('startResponse:', startResponse);
      if (startResponse) {
        const stopBtn = elem.nextSibling ? elem.nextSibling : null;
        if (stopBtn instanceof HTMLDivElement) {
          this.toggleInactiveStatusForBtn(stopBtn, 'active');
          this.toggleInactiveStatusForBtn(elem, 'inactive');
        }
        data.status = 'drive';
        // console.log('data before drive:', data);
        let animatedBalloon: SVGElement;
        let parentContainer: HTMLDivElement;
        let timer: NodeJS.Timer | undefined;
        this.hangar.balloonBlocks.forEach((el) => {
          if (data.id === Number(el.balloonSvg.balloon.id)) {
            animatedBalloon = el.balloonSvg.balloon;
            if (
              el.balloonSvg.balloon.parentElement instanceof HTMLDivElement &&
              el.balloonSvg.balloon.parentElement.parentElement instanceof
                HTMLDivElement
            ) {
              parentContainer =
                el.balloonSvg.balloon.parentElement.parentElement;
            }
            timer = moveBalloon(
              animatedBalloon,
              parentContainer,
              startResponse.velocity
            );
          }
        });
        if (timer) {
          let driveResponse = await this.controller.switchBalloonEngineToDrive(
            data,
            timer
          );
          // console.log('driveResponse:', driveResponse);
          return driveResponse;
        }
      }
    }
  }

  addListenerOnUpButton(arr: BalloonBlock[]): void {
    arr.forEach((elem): void => {
      elem.upButton.button.addEventListener('click', () => {
        this.pushUpButton(elem.upButton.button);
      });
    });
  }

  async pushLandButton(elem: HTMLDivElement): Promise<void> {
    if (!elem.classList.contains('inactive')) {
      let data: QueryBurnerParams = {
        id: Number(elem.id),
        status: 'stopped',
      };
      const endResponse = await this.controller.startStopBurner(data);
      if (endResponse) {
        const startBtn = elem.previousSibling ? elem.previousSibling : null;
        if (startBtn instanceof HTMLDivElement) {
          this.toggleInactiveStatusForBtn(startBtn, 'active');
          this.toggleInactiveStatusForBtn(elem, 'inactive');
        }

        let animatedBalloon: SVGElement;
        this.hangar.balloonBlocks.forEach((el) => {
          if (data.id === Number(el.balloonSvg.balloon.id)) {
            animatedBalloon = el.balloonSvg.balloon;
            moveBalloonOnStart(animatedBalloon);
          }
        });
      }
    }
  }

  addListenerOnLandButton(arr: BalloonBlock[]): void {
    arr.forEach((elem): void => {
      elem.landButton.button.addEventListener('click', () => {
        this.pushLandButton(elem.landButton.button);
      });
    });
  }

  toggleInactiveStatusForBtn(
    button: HTMLDivElement,
    status: 'active' | 'inactive'
  ) {
    button.classList.toggle('inactive');
  }

  pushRaceButton(elem: Button): void {
    elem.button.addEventListener('click', async (): Promise<void> => {
      let promises: (Response | undefined)[] = [];
      if (!elem.button.classList.contains('inactive')) {
        elem.button.classList.add('inactive');
        const promisesArr = this.hangar.balloonBlocks.map(async (el) => {
          let prom: { resp: Response; balloonId: number } | undefined =
            await this.pushUpButton(el.upButton.button);
          // console.log('prom:', prom);
          this.controls.resetBtn.button.classList.remove('inactive');
          return prom;
        });
        const responses = await Promise.all(promisesArr);
        const alternative = await Promise.race(promisesArr);
        // console.log('alternative:', alternative);
        // НЕКОРРЕКТНАЯ РАБОТА ОПРЕДЕЛЕНИЯ ПОБЕДИТЕЛЯ!!! NEED TO BE FIXED!
        Promise.race(responses)
          .then((result: { resp: Response; balloonId: number } | undefined) => {
            if (result) {
              const { resp, balloonId } = result;
              // console.log('id:', balloonId);
              let winnerName: string;
              this.hangar.balloonBlocks.forEach((el) => {
                if (Number(el.balloonName.id) === balloonId) {
                  winnerName = el.balloonName.innerText;
                  console.log('winnerName:', winnerName);
                };
              });
            } else {
              // console.log('Unfortunately, there is no winner!');
            }
          })
          .catch((error: Error) => {
            console.log('Something went wrong!');
          });
      }
    });
  }

  pushResetButton(elem: Button) {
    elem.button.addEventListener('click', () => {
      if (!elem.button.classList.contains('inactive')) {
        this.hangar.balloonBlocks.forEach(async (el) => {
          let prom = await this.pushLandButton(el.landButton.button);
          elem.button.classList.add('inactive');
          this.controls.raceBtn.button.classList.remove('inactive');
        });
      }
    });
  }
}

export default Race;
