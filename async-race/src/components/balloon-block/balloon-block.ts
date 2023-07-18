import './balloon-block.scss';
import { createElement } from '../../utilities/service-functions';
import Button from '../button/button';
import Balloon from '../balloon/balloon';

class BalloonBlock {
  private buttonsNameBlock: HTMLDivElement;
  private selectBtn: Button;
  private removeBtn: Button;
  private balloonName: HTMLSpanElement;
  private raceBlock: HTMLDivElement;
  private upButton: Button;
  private landButton: Button;

  constructor(container: HTMLDivElement, name: string) {
    this.buttonsNameBlock = createElement(
      'div',
      ['buttonsNameBlock'],
      container
    );
    this.selectBtn = new Button(this.buttonsNameBlock, 'SELECT');
    this.removeBtn = new Button(this.buttonsNameBlock, 'REMOVE');
    this.balloonName = createElement(
      'span',
      ['balloonName'],
      this.buttonsNameBlock,
      `${name}`
    );
    this.raceBlock = createElement('div', ['raceBlock'], container);
    this.upButton = new Button(this.raceBlock, 'Up');
    this.landButton = new Button(this.raceBlock, 'Land');
  }
}

export default BalloonBlock;
