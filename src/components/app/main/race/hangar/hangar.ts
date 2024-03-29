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

  private restartQuantity = 0;

  private balloonsPerPage = 7;

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
    const startPageId = 0 + (page - 1) * this.balloonsPerPage;
    this.balloonBlocks = obj
      .slice(startPageId, startPageId + this.balloonsPerPage)
      .map((item, index) => {
        const block: BalloonBlock = new BalloonBlock(
          this.balloonBlocksContainers[index],
          item.name,
          item.color,
          item.id,
        );
        block.raceBlock.id = `${index + 1}`;
        return block;
      });
  }

  public async countPages(): Promise<void> {
    const obj: BalloonData[] = await this.controller.getGarageObject();
    this.pagesQuantity = Math.ceil(
      Object.keys(obj).length / this.balloonsPerPage,
    );
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
