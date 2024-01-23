import Controls from "./control-panel/control-panel";
import Hangar from "./hangar/hangar";
import Button from "../button/button";
import {
  BalloonData,
  NameFirstPart,
  NameSecondPart,
  BalloonColor,
  QueryBurnerParams,
} from "../../../../utilities/types";
import Controller from "../../../../utilities/server-requests";
import BalloonBlock from "./hangar/balloon-block/balloon-block";
import {
  moveBalloon,
  moveBalloonOnStart,
  createWinnerAnnounce,
  sortValues,
} from "../../../../utilities/service-functions";

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

  public draw(): void {
    this.controls.draw();
    this.hangar.draw();
  }

  private addListeners(): void {
    this.pushPreviousPaginationButton(this.hangar.prevBtn);
    this.pushNextPaginationButton(this.hangar.nextBtn);
    this.addListenerOnCreateButton(this.controls.createBtn);
    this.addListenerOnUpdateButton(this.controls.updateBtn);
    this.pushGenerateBalloonsButton(this.controls.generateBtn);
    this.pushRaceButton(this.controls.raceBtn);
    this.pushResetButton(this.controls.resetBtn);
  }

  public removeContentWhileChangePage(): void {
    this.controls.controlBlock.remove();
    this.hangar.hangarBlock.remove();
    this.hangar.balloonBlocksContainer.remove();
  }

  private async drawHangar(): Promise<void> {
    this.hangar.balloonBlocks = [];
    await this.hangar.fillBalloonBlocks(this.hangar.pageNum);
    this.addListenerOnRemoveButton(this.hangar.balloonBlocks);
    this.addListenerOnSelectButton(this.hangar.balloonBlocks);
    this.addListenerOnUpButton(this.hangar.balloonBlocks);
    this.addListenerOnLandButton(this.hangar.balloonBlocks);
  }

  private async pushCreateButton(elem: Button): Promise<void> {
    elem.button.addEventListener("click", async () => {
      const name: string = this.controls.inputCreate.input.value;
      const color: string = this.controls.inputColorCreate.colorInput.value;
      let id: number;
      let index: number;
      try {
        const obj: BalloonData[] = await this.controller.getGarageObject();
        const arr = sortValues(obj);
        if (arr.length === 0) {
          index = 1;
        } else {
          const filteredArr: number[] = arr.filter(
            (el): el is number => el !== undefined,
          );
          index = filteredArr[filteredArr.length - 1];
        }
        const balloonInfo: BalloonData | void = await this.controller
          .getBalloonInfo(index)
          .then(async (result) => {
            if (result.id) {
              id = result.id + 1;
            }
            const data: BalloonData = { name, color, id };
            await this.controller.postNewBalloon(data);
          });
        this.controls.inputCreate.input.value = "";
        if (
          this.hangar.pageNum === this.hangar.pagesQuantity ||
          this.hangar.pagesQuantity === 0
        ) {
          this.hangar.cleanBalloonBlocks();
          this.drawHangar();
        }
        this.hangar.updateBalloonsNum(this.hangar.balloonNum);
        this.hangar.countPages();
      } catch (error) {
        console.log("Something went wrong!");
      }
    });
  }

  private addListenerOnCreateButton(btn: Button): void {
    this.pushCreateButton(btn);
  }

  private pushUpdateButton(elem: Button): void {
    elem.button.addEventListener("click", async (): Promise<void> => {
      const name: string = this.controls.inputUpdate.input.value;
      const color: string = this.controls.inputColorUpdate.colorInput.value;

      try {
        const data: BalloonData = { name, color };
        if (typeof this.hangar.selected === "number") {
          await this.controller.postUpdatedBalloon(this.hangar.selected, data);
          this.controls.inputUpdate.input.value = "";
          this.controls.inputUpdate.input.setAttribute("disabled", "");
          this.controls.inputColorUpdate.colorInput.setAttribute(
            "disabled",
            "",
          );
          this.controls.updateBtn.button.classList.add("inactive");
          const updatedGarageObj: BalloonData[] =
            await this.controller.getGarageObject();
          await this.hangar.cleanBalloonBlocks();
          this.drawHangar();
          this.hangar.selected = null;
        }
      } catch (error) {
        console.log("Something went wrong!");
      }
    });
  }

  private addListenerOnUpdateButton(btn: Button): void {
    this.pushUpdateButton(btn);
  }

  private pushRemoveBtn(elem: Button): void {
    elem.button.addEventListener("click", (): void => {
      const id: number = Number(elem.button.id);
      this.controller.deleteBalloon(id);
      this.controller
        .getGarageObject()
        .then(() => this.hangar.cleanBalloonBlocks())
        .then(() => this.drawHangar())
        .then(() => {
          this.hangar.updateBalloonsNum(this.hangar.balloonNum);
          this.hangar.countPages();
          this.controller.deleteWinner(id);
          this.controls.raceBtn.button.classList.remove("inactive");
          this.controls.resetBtn.button.classList.add("inactive");
        });
    });
  }

  private addListenerOnRemoveButton(arr: BalloonBlock[]): void {
    arr.forEach((elem): void => this.pushRemoveBtn(elem.removeBtn));
  }

  private pushSelectBtn(elem: Button): void {
    elem.button.addEventListener("click", async (event): Promise<void> => {
      this.hangar.selected = Number(elem.button.id);
      this.controls.inputUpdate.input.removeAttribute("disabled");
      if (this.hangar.selected !== null) {
        await this.controller
          .getBalloonInfo(this.hangar.selected)
          .then((result) => {
            this.controls.inputUpdate.input.value = result.name;
            this.controls.inputColorUpdate.colorInput.value = result.color;
          });
        this.controls.inputColorUpdate.colorInput.removeAttribute("disabled");
      }
      this.controls.updateBtn.button.classList.remove("inactive");
    });
  }

  private addListenerOnSelectButton(arr: BalloonBlock[]): void {
    arr.forEach((elem): void => this.pushSelectBtn(elem.selectBtn));
  }

  private pushNextPaginationButton(elem: Button): void {
    elem.button.addEventListener("click", (): void => {
      if (
        this.hangar.pagesQuantity > 1 &&
        this.hangar.pageNum < this.hangar.pagesQuantity
      ) {
        this.hangar.prevBtn.button.classList.remove("inactive");
        this.hangar.pageNum += 1;
        this.hangar.pageNumContainer.textContent = `# ${this.hangar.pageNum}`;
        this.hangar.cleanBalloonBlocks();
        this.drawHangar();
        this.controls.raceBtn.button.classList.remove("inactive");
        this.controls.resetBtn.button.classList.add("inactive");
        if (this.hangar.pageNum === this.hangar.pagesQuantity) {
          this.hangar.nextBtn.button.classList.add("inactive");
        }
      }
    });
  }

  private pushPreviousPaginationButton(elem: Button): void {
    elem.button.addEventListener("click", (): void => {
      if (this.hangar.pagesQuantity > 1 && this.hangar.pageNum > 1) {
        this.hangar.nextBtn.button.classList.remove("inactive");
        this.hangar.pageNum -= 1;
        this.hangar.pageNumContainer.textContent = `# ${this.hangar.pageNum}`;
        this.hangar.cleanBalloonBlocks();
        this.drawHangar();
        this.controls.raceBtn.button.classList.remove("inactive");
        this.controls.resetBtn.button.classList.add("inactive");
        if (this.hangar.pageNum === 1) {
          this.hangar.prevBtn.button.classList.add("inactive");
        }
      }
    });
  }

  private createDataForBalloon(): BalloonData {
    const data: BalloonData = {
      name: `${NameFirstPart[Math.floor(Math.random() * 11)]} ${
        NameSecondPart[Math.floor(Math.random() * 11)]
      }`,
      color: BalloonColor[Math.floor(Math.random() * 25)],
      id: 0,
    };
    return data;
  }

  private async createHundredOfBalloons(id: number): Promise<void> {
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

  private pushGenerateBalloonsButton(elem: Button): void {
    elem.button.addEventListener("click", async (): Promise<void> => {
      let id: number;
      let index: number;
      const data: BalloonData = this.createDataForBalloon();

      try {
        const obj: BalloonData[] = await this.controller.getGarageObject();
        const arr = sortValues(obj);
        const filteredArr: number[] = arr.filter(
          (el): el is number => el !== undefined,
        );
        index = filteredArr[filteredArr.length - 1] + 1;
        await this.controller.getBalloonInfo(index).then(async (result) => {
          if (result.id) {
            id = result.id + 1;
            data.id = id;
          }
          await this.controller.postNewBalloon(data);
          await this.createHundredOfBalloons(id);
        });

        await this.controller.getGarageObject();
        if (this.hangar.pageNum === this.hangar.pagesQuantity) {
          this.hangar.cleanBalloonBlocks();
          this.drawHangar();
        }
        this.hangar.updateBalloonsNum(this.hangar.balloonNum);
        this.hangar.nextBtn.button.classList.remove("inactive");
        this.hangar.countPages();
      } catch (error) {
        console.log("Something went wrong!");
      }
    });
  }

  private async pushUpButton(
    elem: HTMLDivElement,
    isRace: boolean,
  ): Promise<
    { resp: Response; balloonId: number; velocity: number } | undefined
  > {
    if (!elem.classList.contains("inactive")) {
      const data: QueryBurnerParams = {
        id: Number(elem.id),
        status: "started",
      };
      const startResponse = await this.controller.startStopBurner(data);
      if (startResponse) {
        const stopBtn: ChildNode | null = elem.nextSibling;
        if (stopBtn !== null && stopBtn instanceof HTMLDivElement) {
          stopBtn.classList.remove("inactive");
          elem.classList.add("inactive");
        }
        data.status = "drive";
        let timer: NodeJS.Timer | undefined;
        this.hangar.balloonBlocks.forEach((el) => {
          if (data.id === Number(el.balloonSvg.balloon.id)) {
            const parentContainer: HTMLDivElement | null =
              el.balloonSvg.balloon.closest(".raceBlock");
            if (parentContainer) {
              timer = moveBalloon(
                el.balloonSvg.balloon,
                parentContainer,
                startResponse.velocity,
              );
            }
          }
        });
        if (timer) {
          return this.controller.switchBalloonEngineToDrive(
            data,
            timer,
            startResponse.velocity,
            isRace,
          );
        }
      }
    }
  }

  private addListenerOnUpButton(arr: BalloonBlock[]): void {
    arr.forEach((elem): void => {
      elem.upButton.button.addEventListener("click", (): void => {
        this.pushUpButton(elem.upButton.button, false);
      });
    });
  }

  private async pushLandButton(elem: HTMLDivElement): Promise<void> {
    if (!elem.classList.contains("inactive")) {
      const data: QueryBurnerParams = {
        id: Number(elem.id),
        status: "stopped",
      };
      const endResponse = await this.controller.startStopBurner(data);
      if (endResponse) {
        const startBtn = elem.previousSibling;
        if (startBtn instanceof HTMLDivElement) {
          startBtn.classList.remove("inactive");
          elem.classList.add("inactive");
        }

        this.hangar.balloonBlocks.forEach((el): void => {
          if (data.id === Number(el.balloonSvg.balloon.id)) {
            const animatedBalloon: SVGElement = el.balloonSvg.balloon;
            moveBalloonOnStart(animatedBalloon);
          }
        });
      }
    }
  }

  private addListenerOnLandButton(arr: BalloonBlock[]): void {
    arr.forEach((elem): void => {
      elem.landButton.button.addEventListener("click", (): void => {
        this.pushLandButton(elem.landButton.button);
      });
    });
  }

  private pushRaceButton(elem: Button): void {
    elem.button.addEventListener("click", async (): Promise<void> => {
      if (!elem.button.classList.contains("inactive")) {
        elem.button.classList.add("inactive");
        const promisesArr = this.hangar.balloonBlocks.map(
          async (
            el,
          ): Promise<
            { resp: Response; balloonId: number; velocity: number } | undefined
          > => this.pushUpButton(el.upButton.button, true),
        );
        this.controls.resetBtn.button.classList.remove("inactive");
        try {
          const winnerPromise = await Promise.any(promisesArr);
          if (winnerPromise) {
            const { resp, balloonId, velocity } = winnerPromise;
            this.hangar.balloonBlocks.forEach(async (el): Promise<void> => {
              if (Number(el.balloonName.id) === balloonId) {
                const winnerName: string = el.balloonName.innerText;
                const winnerTime: number =
                  (this.hangar.balloonBlocksContainer.clientWidth -
                    16.6 -
                    14.6 -
                    4.8) /
                  velocity;
                createWinnerAnnounce(
                  document.body,
                  winnerName,
                  String(winnerTime.toFixed(2)),
                );
                this.controller.chooseUpdateOrCreateUser(balloonId, {
                  wins: 1,
                  time: Number(winnerTime.toFixed(2)),
                  id: balloonId,
                });
              }
            });
          }
        } catch {
          this.controls.resetBtn.button.classList.remove("inactive");
        }
      }
    });
  }

  private pushResetButton(elem: Button): void {
    elem.button.addEventListener("click", (): void => {
      if (!elem.button.classList.contains("inactive")) {
        this.hangar.balloonBlocks.forEach(async (el): Promise<void> => {
          await this.pushLandButton(el.landButton.button);
        });
        elem.button.classList.add("inactive");
        setTimeout(
          (): void => this.controls.raceBtn.button.classList.remove("inactive"),
          3000,
        );
      }
    });
  }
}

export default Race;
