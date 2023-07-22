import './hangar.scss';
import {
  createElement,
  createBalloonBlocks,
} from '../../../../../utilities/service-functions';
import Controller from '../../../../../utilities/server-requests';
import Button from '../../button/button';
import BalloonBlock from './balloon-block/balloon-block';

class Hangar {
  private controller: Controller;
  public hangarBlock: HTMLDivElement;
  private headerLine: HTMLDivElement;
  private hangarHeader: HTMLHeadingElement;
  public balloonNum: HTMLHeadingElement;
  private paginationLine: HTMLDivElement;
  private pageText: HTMLHeadingElement;
  private pageNum: HTMLHeadingElement;
  private balloonBlocksContainers: HTMLDivElement[];
  public balloonBlocks: BalloonBlock[];
  private paginationButtonsBlock: HTMLDivElement;
  public prevBtn: Button;
  private nextBtn: Button;
  private static instance: Hangar;

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
    this.updateBalloonsNum(this.balloonNum);
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
    this.balloonBlocksContainers = createBalloonBlocks(this.hangarBlock);
    this.paginationButtonsBlock = createElement(
      'div',
      ['paginationButtonsBlock'],
      this.hangarBlock
    );
    this.prevBtn = new Button(this.paginationButtonsBlock, 'PREV');
    this.nextBtn = new Button(this.paginationButtonsBlock, 'NEXT');
    this.balloonBlocks = [];
  }

  async fillBalloonBlocks() {
    console.log(7);
    const obj = await this.controller.getGarageObject();
    // console.log('obj_hangar:', obj);
    const length = Object.keys(obj).length;
    // console.log('length:', length);
    let i = 0;
    while (i < length && i < 7) {
      const name = Object.values(obj)[i].name;
      const color = Object.values(obj)[i].color;
      const id = Object.values(obj)[i].id;
      // console.log('data:', name, color, id);
      let block = new BalloonBlock(this.balloonBlocksContainers[i], name, color, id);
      this.balloonBlocks.push(block);
      // console.log('this.balloonBlocks:', this.balloonBlocks);
      i += 1;
    }
  }

  updateBalloonsNum(elem: HTMLHeadingElement) {
    this.controller.getGarageObject().then((obj) => {
      elem.innerText = `(${Object.keys(obj).length})`;
    });
  }

  cleanBalloonBlocks() {
    console.log(5)
    this.balloonBlocksContainers.forEach((el) => {
      el.innerHTML = '';
    });
  }
}

export default Hangar;
