import "./hangar.scss";
import {
  createBalloonBlocks,
  insertElement,
} from "../../../../../utilities/service-functions";
import Controller from "../../../../../utilities/server-requests";
import Button from "../../button/button";
import BalloonBlock from "./balloon-block/balloon-block";
import { BalloonData } from "../../../../../utilities/types";

class Hangar {
  private controller: Controller;

  public hangarBlock: HTMLDivElement = document.createElement("div");

  private headerLine: HTMLDivElement = document.createElement("div");

  private header: HTMLHeadingElement = document.createElement("h3");

  public balloonNum: HTMLHeadingElement = document.createElement("h3");

  private paginationLine: HTMLDivElement = document.createElement("div");

  private pageText: HTMLHeadingElement = document.createElement("h5");

  public pageNumContainer: HTMLHeadingElement = document.createElement("h5");

  public pageNum: number = 1;

  public pagesQuantity: number = 1;

  public balloonBlocksContainer: HTMLDivElement = document.createElement("div");

  public balloonBlocksContainers: HTMLDivElement[] = [];

  public balloonBlocks: BalloonBlock[] = [];

  public selected: number | null = null;

  private paginationButtonsBlock: HTMLDivElement =
    document.createElement("div");

  public prevBtn: Button = new Button(this.paginationButtonsBlock, {
    name: "PREV",
  });

  public nextBtn: Button = new Button(this.paginationButtonsBlock, {
    name: "NEXT",
  });

  private restartQuantity: number = 0;

  constructor() {
    this.controller = Controller.getInstance();
  }

  public draw(): void {
    insertElement(this.hangarBlock, ["hangarBlock"], document.body);
    insertElement(this.headerLine, ["headerLine"], this.hangarBlock);
    insertElement(this.header, ["hangarHeader"], this.headerLine, "Hangar");
    insertElement(this.balloonNum, ["balloonsNum"], this.headerLine);
    this.updateBalloonsNum(this.balloonNum);
    insertElement(this.paginationLine, ["paginationLine"], this.hangarBlock);
    insertElement(this.pageText, ["pageText"], this.paginationLine, "Page");
    insertElement(
      this.pageNumContainer,
      ["pageNumContainer"],
      this.paginationLine,
      `# ${this.pageNum}`,
    );
    insertElement(
      this.balloonBlocksContainer,
      ["balloonBlocksContainer"],
      this.hangarBlock,
    );
    if (this.restartQuantity === 0) {
      this.restartQuantity = 1;
      this.balloonBlocksContainers = createBalloonBlocks(
        this.balloonBlocksContainer,
      );
    }
    insertElement(
      this.paginationButtonsBlock,
      ["paginationButtonsBlock"],
      this.hangarBlock,
    );
    if (this.pageNum === 1) {
      this.prevBtn.button.classList.add("inactive");
    }
    this.countPages();
  }

  public async fillBalloonBlocks(page: number): Promise<void> {
    const obj: BalloonData[] = await this.controller.getGarageObject();
    const { length } = Object.keys(obj);
    let i: number = 0 + (page - 1) * 7;
    let k: number = 0;
    while (i < length && k < 7) {
      const { name } = Object.values(obj)[i];
      const { color } = Object.values(obj)[i];
      const { id } = Object.values(obj)[i];
      const block: BalloonBlock = new BalloonBlock(
        this.balloonBlocksContainers[k],
        name,
        color,
        id,
      );
      block.raceBlock.id = `${k + 1}`;
      this.balloonBlocks.push(block);
      i += 1;
      k += 1;
    }
  }

  public async countPages(): Promise<void> {
    const obj: BalloonData[] = await this.controller.getGarageObject();
    const itemsOnPage: number = 7;
    this.pagesQuantity = Math.ceil(Object.keys(obj).length / itemsOnPage);
    if (this.pageNum === this.pagesQuantity) {
      this.nextBtn.button.classList.add("inactive");
    } else if (this.pagesQuantity > 1 && this.pageNum !== this.pagesQuantity) {
      this.nextBtn.button.classList.remove("inactive");
    }
  }

  public updateBalloonsNum(elem: HTMLHeadingElement): void {
    this.controller.getGarageObject().then((obj): void => {
      const updatedElem = elem;
      updatedElem.innerText = `(${Object.keys(obj).length})`;
      if (this.headerLine.lastChild) this.headerLine.lastChild.remove();
      this.balloonNum = updatedElem;
      this.headerLine.appendChild(this.balloonNum);
    });
  }

  public cleanBalloonBlocks(): void {
    this.balloonBlocksContainers.forEach((el): void => {
      while (el.firstChild) {
        el.removeChild(el.firstChild);
      }
    });
  }
}

export default Hangar;
