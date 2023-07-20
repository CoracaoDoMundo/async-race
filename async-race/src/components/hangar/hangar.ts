import './hangar.scss';
import {
  createElement,
  createBalloonBlocks,
} from '../../utilities/service-functions';
import Controller from '../../utilities/server-requests';
import Button from '../button/button';
import BalloonBlock from '../balloon-block/balloon-block';

class Hangar {
  private controller: Controller;
  private hangarBlock: HTMLDivElement;
  private headerLine: HTMLDivElement;
  private hangarHeader: HTMLHeadingElement;
  private balloonNum: HTMLHeadingElement;
  private paginationLine: HTMLDivElement;
  private pageText: HTMLHeadingElement;
  private pageNum: HTMLHeadingElement;
  private balloonBlocks: HTMLDivElement[];
  private paginationButtonsBlock: HTMLDivElement;
  private prevBtn: Button;
  private nextBtn: Button;

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
    this.pageNum = createElement('h5', ['pageNum'], this.paginationLine, '# 1');
    this.balloonBlocks = createBalloonBlocks(this.hangarBlock);
    this.paginationButtonsBlock = createElement(
      'div',
      ['paginationButtonsBlock'],
      this.hangarBlock
    );
    this.prevBtn = new Button(this.paginationButtonsBlock, 'PREV');
    this.nextBtn = new Button(this.paginationButtonsBlock, 'NEXT');
    this.fillBalloonBlocks();
  }

  fillBalloonBlocks() {
    this.controller.getGarageObject().then((obj) => {
      const length = Object.keys(obj).length;
      let i = 0;
      while (i < length) {
        const name = Object.values(obj)[i].name;
        const color = Object.values(obj)[i].color;
        const id = Object.values(obj)[i].id;
        const block = new BalloonBlock(this.balloonBlocks[i], name, color, id);
        i += 1;
      }
    });
  }
}

export default Hangar;
