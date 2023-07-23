import './balloon-block.scss';
import { createElement } from '../../../../../../utilities/service-functions';
import Button from '../../../button/button';
import Balloon from './balloon/balloon';
import Ribbon from './ribbon/ribbon';
import Controller from '../../../../../../utilities/server-requests';

class BalloonBlock {
  private buttonsNameBlock: HTMLDivElement;
  public selectBtn: Button;
  public removeBtn: Button;
  public balloonName: HTMLSpanElement;
  private raceBlock: HTMLDivElement;
  public upButton: Button;
  public landButton: Button;
  private balloon: HTMLDivElement;
  public balloonSvg: Balloon;
  private ribbon: HTMLDivElement;
  private ribbonSvg: Ribbon;
  private trackLine: HTMLDivElement;
  private controller: Controller;

  constructor(
    container: HTMLDivElement,
    name: string,
    color: string,
    id: number
  ) {
    this.controller = Controller.getInstance();
    this.buttonsNameBlock = createElement(
      'div',
      ['buttonsNameBlock'],
      container
    );
    this.selectBtn = new Button(this.buttonsNameBlock, 'SELECT', id);
    this.removeBtn = new Button(this.buttonsNameBlock, 'REMOVE', id);
    this.balloonName = createElement(
      'span',
      ['balloonName'],
      this.buttonsNameBlock,
      `${name}`
    );
    this.balloonName.setAttribute('id', String(id));
    this.raceBlock = createElement('div', ['raceBlock'], container);
    this.upButton = new Button(this.raceBlock, 'Up', id);
    this.landButton = new Button(this.raceBlock, 'Land', id);
    this.balloon = createElement('div', ['balloonContainer'], this.raceBlock);
    this.balloonSvg = new Balloon(id);
    this.balloonSvg.draw(this.balloon, color);
    this.ribbon = createElement('div', ['ribbonContainer'], this.raceBlock);
    this.ribbonSvg = new Ribbon();
    this.ribbonSvg.draw(this.ribbon);
    this.trackLine = createElement('div', ['trackLine'], this.raceBlock);
  }
}

export default BalloonBlock;
