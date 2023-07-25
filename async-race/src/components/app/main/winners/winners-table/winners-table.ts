import './winners-table.scss';
import {
  createElement,
  insertElement,
} from '../../../../../utilities/service-functions';
import Controller from '../../../../../utilities/server-requests';
import Button from '../../button/button';
import { columnNames } from '../../../../../utilities/types';
import Balloon from '../../race/hangar/balloon-block/balloon/balloon';

class WinnersTable {
  private controller: Controller;
  public winnersBlock: HTMLDivElement = document.createElement('div');
  private headerLine: HTMLDivElement = document.createElement('div');
  private header: HTMLHeadingElement = document.createElement('h3');
  public winnersNum: HTMLHeadingElement = document.createElement('h3');
  private paginationLine: HTMLDivElement = document.createElement('div');
  private pageText: HTMLHeadingElement = document.createElement('h5');
  public pageNumContainer: HTMLHeadingElement = document.createElement('h5');
  public pageNum: number = 1;
  public pagesQuantity: number = 1;
  private winnersTableBlock: HTMLDivElement = document.createElement('div');
  private paginationButtonsBlock: HTMLDivElement =
    document.createElement('div');
  public prevBtn: Button = new Button(this.paginationButtonsBlock, 'PREV');
  public nextBtn: Button = new Button(this.paginationButtonsBlock, 'NEXT');
  private restartQuantity: number = 0;

  constructor() {
    this.controller = Controller.getInstance();
  }

  draw() {
    insertElement(this.winnersBlock, ['winnersBlock'], document.body);
    insertElement(this.headerLine, ['headerLine'], this.winnersBlock);
    insertElement(this.header, ['winnersHeader'], this.headerLine, 'Winners');
    insertElement(this.winnersNum, ['balloonsNum'], this.headerLine);
    this.updateWinnersNum(this.winnersNum);
    insertElement(this.paginationLine, ['paginationLine'], this.winnersBlock);
    insertElement(this.pageText, ['pageText'], this.paginationLine, 'Page');
    insertElement(
      this.pageNumContainer,
      ['pageNumContainer'],
      this.paginationLine,
      `# ${this.pageNum}`
    );
    insertElement(
      this.winnersTableBlock,
      ['winnersTableBlock'],
      this.winnersBlock
    );
    if (this.restartQuantity === 0) {
      this.drawTableHeadline(this.winnersTableBlock);
      this.fillTable(this.pageNum, this.winnersTableBlock);
    }

    insertElement(
      this.paginationButtonsBlock,
      ['paginationButtonsBlock'],
      this.winnersBlock
    );
    if (this.pageNum === 1) {
      this.prevBtn.button.classList.add('inactive');
    }
    this.countPages();
    if (this.pagesQuantity < 2) {
      this.nextBtn.button.classList.add('inactive');
    }
  }

  drawTableHeadline(container: HTMLDivElement) {
    this.restartQuantity = 1;
    let i = 0;
    while (i < 5) {
      const columnNameBlock = createElement(
        'div',
        ['columnNameBlock', 'tableHeadline', 'cell'],
        container
      );
      const columnName = createElement(
        'span',
        ['columnName'],
        columnNameBlock,
        columnNames[i]
      );
      i += 1;
    }
  }

  async fillTable(page: number, container: HTMLDivElement) {
    const itemsOnPage = 10;
    const data = {
      page: page,
      limit: 10,
    };
    const obj = await this.controller.getWinners(data);
    if (Array.isArray(obj)) {
      const length = Object.values(obj).length;
      let color: string = '#fafafa';
      let name: string = '';
      let wins: number = 1;
      let time: number;
      let i = 0 + (page - 1) * itemsOnPage;
      while (i < itemsOnPage && i < length) {
        const numContainer: HTMLDivElement = createElement(
          'div',
          ['numContainer', 'cell'],
          container
        );
        const num: HTMLSpanElement = createElement(
          'span',
          ['num'],
          numContainer,
          `${(i + 1) * page}`
        );
        const balloonContainer: HTMLDivElement = createElement(
          'div',
          ['balloonContainer', 'cell'],
          container
        );
        const balloon = new Balloon();
        if (obj[i].color === undefined) {
          color = obj[i].color;
        }
        balloon.draw(balloonContainer, color);
        balloon.balloon.classList.remove('animatedBalloon');
        const nameContainer: HTMLDivElement = createElement(
          'div',
          ['nameContainer', 'cell'],
          container
        );
        if (obj[i].name) {
          name = obj[i].name;
        }
        const winnerName: HTMLSpanElement = createElement(
          'span',
          ['winnerName'],
          nameContainer,
          `${name}`
        );
        const winsNumContainer: HTMLDivElement = createElement(
          'div',
          ['winsNumContainer', 'cell'],
          container
        );
        if (obj[i].wins) {
          wins = obj[i].wins;
        }
        const winsNum: HTMLSpanElement = createElement(
          'span',
          ['winsNum'],
          winsNumContainer,
          `${wins}`
        );
        const bestTimeContainer: HTMLDivElement = createElement(
          'div',
          ['bestTimeContainer', 'cell'],
          container
        );
        time = obj[i].time;
        const bestTime: HTMLSpanElement = createElement(
          'span',
          ['bestTime'],
          bestTimeContainer,
          `${time}`
        );
        i += 1;
      }
    }
  }

  async countPages(): Promise<void> {
    const obj = await this.controller.getWinners();
    const itemsOnPage = 10;
    if (obj instanceof Object) {
      this.pagesQuantity = Math.ceil(Object.keys(obj).length / itemsOnPage);
      if (this.pageNum === this.pagesQuantity) {
        //   this.nextBtn.button.classList.add('inactive');
      }
    }
  }

  updateWinnersNum(elem: HTMLHeadingElement): void {
    this.controller.getWinners().then((obj) => {
      if (obj instanceof Object) {
        elem.innerText = `(${Object.keys(obj).length})`;
      }
    });
  }
}

export default WinnersTable;
