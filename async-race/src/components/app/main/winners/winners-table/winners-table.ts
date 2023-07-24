import './winners-table.scss';
import { createElement } from '../../../../../utilities/service-functions';
import Controller from '../../../../../utilities/server-requests';
import Button from '../../button/button';
import { columnNames } from '../../../../../utilities/types';
import Balloon from '../../race/hangar/balloon-block/balloon/balloon';

class WinnersTable {
  private controller: Controller;
  public winnersBlock: HTMLDivElement;
  private headerLine: HTMLDivElement;
  private header: HTMLHeadingElement;
  public winnersNum: HTMLHeadingElement;
  private paginationLine: HTMLDivElement;
  private pageText: HTMLHeadingElement;
  public pageNumContainer: HTMLHeadingElement;
  public pageNum: number = 1;
  public pagesQuantity: number = 1;
  private winnersTableBlock: HTMLDivElement;
  private paginationButtonsBlock: HTMLDivElement;
  public prevBtn: Button;
  public nextBtn: Button;

  constructor() {
    this.controller = Controller.getInstance();
    this.winnersBlock = createElement('div', ['winnersBlock'], document.body);
    this.headerLine = createElement('div', ['headerLine'], this.winnersBlock);
    this.header = createElement(
      'h3',
      ['winnersHeader'],
      this.headerLine,
      'Winners'
    );
    this.winnersNum = createElement('h3', ['balloonsNum'], this.headerLine);
    this.updateWinnersNum(this.winnersNum);
    this.paginationLine = createElement(
      'div',
      ['paginationLine'],
      this.winnersBlock
    );
    this.pageText = createElement(
      'h5',
      ['pageText'],
      this.paginationLine,
      'Page'
    );
    this.pageNumContainer = createElement(
      'h5',
      ['pageNumContainer'],
      this.paginationLine,
      `# ${this.pageNum}`
    );
    this.winnersTableBlock = createElement(
      'div',
      ['winnersTableBlock'],
      this.winnersBlock
    );
    this.drawTableHeadline(this.winnersTableBlock);
    this.fillTable(this.pageNum, this.winnersTableBlock);

    this.paginationButtonsBlock = createElement(
      'div',
      ['paginationButtonsBlock'],
      this.winnersBlock
    );
    this.prevBtn = new Button(this.paginationButtonsBlock, 'PREV');
    if (this.pageNum === 1) {
      this.prevBtn.button.classList.add('inactive');
    }
    this.nextBtn = new Button(this.paginationButtonsBlock, 'NEXT');
    this.countPages();
    if (this.pagesQuantity < 2) {
      this.nextBtn.button.classList.add('inactive');
    }
  }

  drawTableHeadline(container: HTMLDivElement) {
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
      if (obj[i].color) {
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

  async countPages(): Promise<void> {
    const obj = await this.controller.getWinners();
    const itemsOnPage = 10;
    this.pagesQuantity = Math.ceil(Object.keys(obj).length / itemsOnPage);
    if (this.pageNum === this.pagesQuantity) {
      //   this.nextBtn.button.classList.add('inactive');
    }
  }

  updateWinnersNum(elem: HTMLHeadingElement): void {
    this.controller.getWinners().then((obj) => {
      elem.innerText = `(${Object.keys(obj).length})`;
    });
  }
}

export default WinnersTable;
