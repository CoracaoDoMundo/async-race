import './winners-table.scss';
import { createElement } from '../../../../../utilities/service-functions';
import Controller from '../../../../../utilities/server-requests';
import Button from '../../button/button';
import { columnNames } from '../../../../../utilities/types';

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
        'div',
        ['columnName'],
        columnNameBlock,
        columnNames[i]
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
