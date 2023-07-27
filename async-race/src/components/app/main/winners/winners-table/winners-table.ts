import './winners-table.scss';
import {
  createElement,
  insertElement,
} from '../../../../../utilities/service-functions';
import Controller from '../../../../../utilities/server-requests';
import Button from '../../button/button';
import {
  columnNames,
  QueryWinnersParams,
  BalloonData,
} from '../../../../../utilities/types';
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
  public winnersTableBlock: HTMLDivElement = document.createElement('div');
  private paginationButtonsBlock: HTMLDivElement =
    document.createElement('div');
  public prevBtn: Button = new Button(this.paginationButtonsBlock, 'PREV');
  public nextBtn: Button = new Button(this.paginationButtonsBlock, 'NEXT');
  private restartQuantity: number = 0;
  private winsSort: 'ASC' | 'DESC' = 'ASC';
  private timeSort: 'ASC' | 'DESC' = 'ASC';

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
      const columnNameBlock: HTMLDivElement = createElement(
        'div',
        ['columnNameBlock', 'tableHeadline', 'cell'],
        container
      );
      const columnName: HTMLSpanElement = createElement(
        'span',
        ['columnName'],
        columnNameBlock,
        columnNames[i]
      );
      if (columnName.innerText === 'Wins') {
        columnNameBlock.style.cursor = 'pointer';
        columnNameBlock.addEventListener('click', () => {
          this.addListenerForSort('wins', this.winsSort);
        });
      }

      if (columnName.innerText === 'Best time (sec)') {
        columnNameBlock.style.cursor = 'pointer';
        columnNameBlock.addEventListener('click', () => {
          this.addListenerForSort('time', this.timeSort);
        });
      }
      i += 1;
    }
  }

  addListenerForSort(column: 'wins' | 'time', flag: 'ASC' | 'DESC') {
    let data: QueryWinnersParams;
    this.winnersTableBlock.innerText = '';
    if (flag === 'ASC') {
      data = {
        page: this.pageNum,
        limit: 10,
        sort: column,
        order: 'ASC',
      };
      if (column === 'wins') {
        this.winsSort = 'DESC';
      } else if (column === 'time') {
        this.timeSort = 'DESC';
      }
    } else {
      data = {
        page: this.pageNum,
        limit: 10,
        sort: column,
        order: 'DESC',
      };
      if (column === 'wins') {
        this.winsSort = 'ASC';
      } else if (column === 'time') {
        this.timeSort = 'ASC';
      }
    }
    this.drawTableHeadline(this.winnersTableBlock);
    this.fillTable(this.pageNum, this.winnersTableBlock, data);
  }

  async fillTable(
    page: number,
    container: HTMLDivElement,
    dataToSort?: QueryWinnersParams
  ) {
    const itemsOnPage = 10;
    let data: QueryWinnersParams = {
      page: page,
      limit: 10,
    };
    if (dataToSort) {
      data = dataToSort;
    }
    const obj = await this.controller.getWinners(data);
    if (Array.isArray(obj)) {
      const length = Object.values(obj).length;
      let wins: number = 1;
      let time: number;
      let i = 0 + (page - 1) * itemsOnPage;
      while (i < itemsOnPage * page && i < length) {
        const numContainer: HTMLDivElement = createElement(
          'div',
          ['numContainer', 'cell'],
          container
        );
        const num: HTMLSpanElement = createElement(
          'span',
          ['num'],
          numContainer,
          `${i + 1}`
        );
        const balloonContainer: HTMLDivElement = createElement(
          'div',
          ['balloonContainer', 'cell'],
          container
        );
        const balloon = new Balloon();
        this.controller.getBalloonInfo(obj[i].id).then((result) => {
          const color: string = result.color;
          balloon.draw(balloonContainer, color);
        });
        balloon.balloon.classList.remove('animatedBalloon');
        const nameContainer: HTMLDivElement = createElement(
          'div',
          ['nameContainer', 'cell'],
          container
        );
        this.controller.getBalloonInfo(obj[i].id).then((result) => {
          const winnerNameStr: string = result.name;
          console.log('name:', winnerNameStr);
          const winnerName: HTMLSpanElement = createElement(
            'span',
            ['winnerName'],
            nameContainer,
            winnerNameStr
          );
        });
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
      if (this.pageNum !== this.pagesQuantity && this.pagesQuantity > 1) {
        this.nextBtn.button.classList.remove('inactive');
      } else if (this.pageNum === this.pagesQuantity) {
        this.nextBtn.button.classList.add('inactive');
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
