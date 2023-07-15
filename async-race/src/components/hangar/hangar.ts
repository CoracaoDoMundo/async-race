import './hangar.scss';
import { createElement } from '../../utilities/service-functions';
import Controller from '../../utilities/server-requests';

class Hangar {
  private controller: Controller;
  private hangarBlock: HTMLDivElement;
  private headerLine: HTMLDivElement;
  private hangarHeader: HTMLHeadingElement;
  private balloonNum: HTMLHeadingElement;
  private paginationLine: HTMLDivElement;
  private pageText: HTMLHeadingElement;
  private pageNum: HTMLHeadingElement;

  constructor() {
    this.controller = Controller.getInstance();
    this.hangarBlock = createElement('div', ['hangarBlock'], document.body);
    this.headerLine = createElement('div', ['headerLine'], this.hangarBlock);
    this.hangarHeader = createElement(
      'h3',
      ['hangarHeader'],
      this.headerLine,
      'Hangar'
    );
    this.balloonNum = createElement('h3', ['balloonsNum'], this.headerLine);
    this.controller.getGarageObject().then((obj) => {
      this.balloonNum.innerText = `(${Object.keys(obj).length})`;
    });
    this.paginationLine = createElement(
      'div',
      ['paginationLine'],
      this.hangarBlock
    );
    this.pageText = createElement(
      'h5',
      ['pageText'],
      this.paginationLine,
      'Page'
    );
    this.pageNum = createElement('h5', ['pageNum'], this.paginationLine, '#');
  }
}

export default Hangar;
