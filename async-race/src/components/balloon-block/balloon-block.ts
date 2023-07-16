import './balloon-block.scss';
import { createElement } from '../../utilities/service-functions';
import Button from '../button/button';

class BalloonBlock {
  private buttonsNameBlock: HTMLDivElement;
  private selectBtn: Button;
  private removeBtn: Button;
  private balloonName: HTMLSpanElement;

  constructor(container:HTMLDivElement, name:string) {
    this.buttonsNameBlock = createElement('div', ['buttonsNameBlock'], container);
    this.selectBtn = new Button(this.buttonsNameBlock, 'SELECT');
    this.removeBtn = new Button(this.buttonsNameBlock, 'REMOVE');
    this.balloonName = createElement('span', ['balloonName'], this.buttonsNameBlock, `${name}`);
  }
}

export default BalloonBlock;
