import "./winners-table.scss";
import {
  createElement,
  insertElement,
} from "../../../../../utilities/service-functions";
import Controller from "../../../../../utilities/server-requests";
import Button from "../../button/button";
import {
  ColumnNames,
  QueryWinnersParams,
  WinnerRespond,
} from "../../../../../utilities/types";
import Balloon from "../../race/hangar/balloon-block/balloon/balloon";

class WinnersTable {
  private controller: Controller;

  public winnersBlock: HTMLDivElement = document.createElement("div");

  private headerLine: HTMLDivElement = document.createElement("div");

  private header: HTMLHeadingElement = document.createElement("h3");

  public winnersNum: HTMLHeadingElement = document.createElement("h3");

  private paginationLine: HTMLDivElement = document.createElement("div");

  private pageText: HTMLHeadingElement = document.createElement("h5");

  public pageNumContainer: HTMLHeadingElement = document.createElement("h5");

  public pageNum: number = 1;

  public pagesQuantity: number = 1;

  public winnersTableBlock: HTMLDivElement = document.createElement("div");

  private paginationButtonsBlock: HTMLDivElement =
    document.createElement("div");

  public prevBtn: Button = new Button(this.paginationButtonsBlock, "PREV");

  public nextBtn: Button = new Button(this.paginationButtonsBlock, "NEXT");

  private restartQuantity: number = 0;

  private winsSort: "ASC" | "DESC" = "ASC";

  private timeSort: "ASC" | "DESC" = "ASC";

  constructor() {
    this.controller = Controller.getInstance();
  }

  public draw(): void {
    insertElement(this.winnersBlock, ["winnersBlock"], document.body);
    insertElement(this.headerLine, ["headerLine"], this.winnersBlock);
    insertElement(this.header, ["winnersHeader"], this.headerLine, "Winners");
    insertElement(this.winnersNum, ["balloonsNum"], this.headerLine);
    this.updateWinnersNum(this.winnersNum);
    insertElement(this.paginationLine, ["paginationLine"], this.winnersBlock);
    insertElement(this.pageText, ["pageText"], this.paginationLine, "Page");
    insertElement(
      this.pageNumContainer,
      ["pageNumContainer"],
      this.paginationLine,
      `# ${this.pageNum}`,
    );
    insertElement(
      this.winnersTableBlock,
      ["winnersTableBlock"],
      this.winnersBlock,
    );
    if (this.restartQuantity === 0) {
      this.drawTableHeadline(this.winnersTableBlock);
      this.fillTable(this.pageNum, this.winnersTableBlock);
    }

    insertElement(
      this.paginationButtonsBlock,
      ["paginationButtonsBlock"],
      this.winnersBlock,
    );
    if (this.pageNum === 1) {
      this.prevBtn.button.classList.add("inactive");
    }
    this.countPages();
    if (this.pagesQuantity < 2) {
      this.nextBtn.button.classList.add("inactive");
    }
  }

  public drawTableHeadline(container: HTMLDivElement): void {
    this.restartQuantity = 1;
    let i = 0;
    while (i < 5) {
      const columnNameBlock: HTMLDivElement = createElement(
        "div",
        ["columnNameBlock", "tableHeadline", "cell"],
        container,
      );
      const columnName: HTMLSpanElement = createElement(
        "span",
        ["columnName"],
        columnNameBlock,
        ColumnNames[i],
      );
      if (columnName.innerText === "Wins") {
        columnNameBlock.style.cursor = "pointer";
        columnNameBlock.addEventListener("click", () => {
          this.addListenerForSort("wins", this.winsSort);
        });
      }

      if (columnName.innerText === "Best time (sec)") {
        columnNameBlock.style.cursor = "pointer";
        columnNameBlock.addEventListener("click", () => {
          this.addListenerForSort("time", this.timeSort);
        });
      }
      i += 1;
    }
  }

  private addListenerForSort(
    column: "wins" | "time",
    flag: "ASC" | "DESC",
  ): void {
    let data: QueryWinnersParams;
    this.winnersTableBlock.innerText = "";
    if (flag === "ASC") {
      data = {
        page: this.pageNum,
        limit: 10,
        sort: column,
        order: "ASC",
      };
      if (column === "wins") {
        this.winsSort = "DESC";
      } else if (column === "time") {
        this.timeSort = "DESC";
      }
    } else {
      data = {
        page: this.pageNum,
        limit: 10,
        sort: column,
        order: "DESC",
      };
      if (column === "wins") {
        this.winsSort = "ASC";
      } else if (column === "time") {
        this.timeSort = "ASC";
      }
    }
    this.drawTableHeadline(this.winnersTableBlock);
    this.fillTable(this.pageNum, this.winnersTableBlock, data);
  }

  public async fillTable(
    page: number,
    container: HTMLDivElement,
    dataToSort?: QueryWinnersParams,
  ): Promise<void> {
    const itemsOnPage = 10;
    let data: QueryWinnersParams = {
      page,
      limit: 10,
    };
    if (dataToSort) {
      data = dataToSort;
    }
    const obj: WinnerRespond[] | undefined = await this.controller.getWinners(
      data,
    );
    if (!Array.isArray(obj)) return;
    this.drawTableLoop(page, itemsOnPage, obj, container);
  }

  private drawTableLoop(
    page: number,
    itemsOnPage: number,
    obj: WinnerRespond[],
    container: HTMLDivElement,
  ): void {
    let wins: number = 1;
    let i = 0 + (page - 1) * itemsOnPage;
    while (i < itemsOnPage * page && i < Object.values(obj).length) {
      const numContainer: HTMLDivElement = createElement(
        "div",
        ["numContainer", "cell"],
        container,
      );
      createElement("span", ["num"], numContainer, `${i + 1}`);
      this.drawBalloonWithNameInTable(obj, i, container);
      const winsNumContainer: HTMLDivElement = createElement(
        "div",
        ["winsNumContainer", "cell"],
        container,
      );
      if (obj[i].wins) {
        wins = obj[i].wins;
      }
      createElement("span", ["winsNum"], winsNumContainer, `${wins}`);
      const bestTimeContainer: HTMLDivElement = createElement(
        "div",
        ["bestTimeContainer", "cell"],
        container,
      );
      const { time } = obj[i];
      createElement("span", ["bestTime"], bestTimeContainer, `${time}`);
      i += 1;
    }
  }

  private drawBalloonWithNameInTable(
    obj: WinnerRespond[],
    i: number,
    container: HTMLDivElement,
  ): void {
    const balloonContainer: HTMLDivElement = createElement(
      "div",
      ["balloonContainer", "cell"],
      container,
    );
    const balloon = new Balloon();
    this.controller.getBalloonInfo(obj[i].id).then((result) => {
      const { color } = result;
      balloon.draw(balloonContainer, color);
    });
    balloon.balloon.classList.remove("animatedBalloon");
    const nameContainer: HTMLDivElement = createElement(
      "div",
      ["nameContainer", "cell"],
      container,
    );
    this.controller.getBalloonInfo(obj[i].id).then((result) => {
      const winnerNameStr: string = result.name;
      createElement("span", ["winnerName"], nameContainer, winnerNameStr);
    });
  }

  private async countPages(): Promise<void> {
    const obj = await this.controller.getWinners();
    const itemsOnPage = 10;
    if (obj instanceof Object) {
      this.pagesQuantity = Math.ceil(Object.keys(obj).length / itemsOnPage);
      if (this.pageNum !== this.pagesQuantity && this.pagesQuantity > 1) {
        this.nextBtn.button.classList.remove("inactive");
      } else if (this.pageNum === this.pagesQuantity) {
        this.nextBtn.button.classList.add("inactive");
      }
    }
  }

  private updateWinnersNum(elem: HTMLHeadingElement): void {
    this.controller.getWinners().then((obj): void => {
      const updatedElem = elem;
      if (obj instanceof Object) {
        updatedElem.innerText = `(${Object.keys(obj).length})`;
      }
      if (this.headerLine.lastChild) this.headerLine.lastChild.remove();
      this.winnersNum = updatedElem;
      this.headerLine.appendChild(this.winnersNum);
    });
  }
}

export default WinnersTable;
