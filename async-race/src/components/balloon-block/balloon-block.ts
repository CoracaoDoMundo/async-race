import './balloon-block.scss';
import { createElement } from '../../utilities/service-functions';
import Button from '../button/button';
import Balloon from '../balloon/balloon';
import Ribbon from '../ribbon/ribbon';

class BalloonBlock {
  private buttonsNameBlock: HTMLDivElement;
  private selectBtn: Button;
  private removeBtn: Button;
  private balloonName: HTMLSpanElement;
  private raceBlock: HTMLDivElement;
  private upButton: Button;
  private landButton: Button;
  private balloon: HTMLDivElement;
  private balloonSvg: Balloon;
  private ribbon: HTMLDivElement;
  private ribbonSvg: Ribbon;

  constructor(container: HTMLDivElement, name: string, color: string) {
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
    this.balloon = createElement('div', ['balloonContainer'], this.raceBlock)
    this.balloonSvg = new Balloon();
    this.balloonSvg.draw(this.balloon, color);
    this.ribbon = createElement('div', ['ribbonContainer'], this.raceBlock);
    this.ribbonSvg = new Ribbon();
  }
}

export default BalloonBlock;
