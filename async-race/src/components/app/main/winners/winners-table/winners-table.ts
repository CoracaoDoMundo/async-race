import './winners-table.scss';
import { createElement } from '../../../../../utilities/service-functions';
import Controller from '../../../../../utilities/server-requests';

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
    this.countPages();
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
