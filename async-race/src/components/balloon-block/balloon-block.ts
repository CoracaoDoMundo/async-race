import './balloon-block.scss';
import { createElement } from '../../utilities/service-functions';
import Button from '../button/button';
import Balloon from '../balloon/balloon';
import Ribbon from '../ribbon/ribbon';
import Controller from '../../utilities/server-requests';

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
  private trackLine: HTMLDivElement;
  private controller: Controller;

  constructor(container: HTMLDivElement, name: string, color: string, id: number) {
    this.controller = Controller.getInstance();
    this.buttonsNameBlock = createElement(
      'div',
      ['buttonsNameBlock'],
      container
    );
    this.selectBtn = new Button(this.buttonsNameBlock, 'SELECT');
    this.removeBtn = new Button(this.buttonsNameBlock, 'REMOVE');
    this.removeBtn.button.setAttribute('id', String(id));
    this.pushRemoveBtn(this.removeBtn);
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
    this.ribbonSvg.draw(this.ribbon);
    this.trackLine = createElement('div', ['trackLine'], this.raceBlock);
  }

  pushRemoveBtn(elem: Button) {
    elem.button.addEventListener('click', () => {
      console.log('id:', elem.button.id);
      const id = Number(elem.button.id);
      this.controller.deleteBalloon(id);
    });
  }
}

export default BalloonBlock;
