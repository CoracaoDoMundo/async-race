import './control-panel.scss';
import { createElement } from '../../utilities/service-functions';
import TextInput from '../input/input';
import ColorInput from '../color-input/color-input';
import Button from '../button/button';
import Controller from '../../utilities/server-requests';
import { BalloonData } from '../../utilities/types';

class Controls {
  private controlBlock: HTMLDivElement;
  private inputCreateLine: HTMLDivElement;
  private inputUpdateLine: HTMLDivElement;
  private buttonsLine: HTMLDivElement;
  private inputCreate: TextInput;
  private inputUpdate: TextInput;
  private inputColorCreate: ColorInput;
  private inputColorUpdate: ColorInput;
  private createBtn: Button;
  private updateBtn: Button;
  private raceBtn: Button;
  private resetBtn: Button;
  private generateBtn: Button;
  private controller: Controller;

  constructor() {
    this.controller = Controller.getInstance();
    this.controlBlock = createElement('div', ['controlBlock'], document.body);
    this.inputCreateLine = createElement(
      'div',
      ['inputsLine'],
      this.controlBlock
    );
    this.inputUpdateLine = createElement(
      'div',
      ['inputsLine'],
      this.controlBlock
    );
    this.buttonsLine = createElement(
      'div',
      ['buttonsBlock'],
      this.controlBlock
    );
    this.inputCreate = new TextInput(this.inputCreateLine);
    this.inputUpdate = new TextInput(this.inputUpdateLine, false);
    this.inputColorCreate = new ColorInput(this.inputCreateLine, '#5900ff');
    this.inputColorUpdate = new ColorInput(this.inputUpdateLine, '#ff00a2');
    this.createBtn = new Button(this.inputCreateLine, 'CREATE');
    this.pushCreateButton(this.createBtn);
    this.updateBtn = new Button(this.inputUpdateLine, 'UPDATE');
    this.raceBtn = new Button(this.buttonsLine, 'RACE');
    this.resetBtn = new Button(this.buttonsLine, 'RESET');
    this.generateBtn = new Button(this.buttonsLine, 'GENERATE BALLOONS');
  }

  pushCreateButton(elem: Button) {
    elem.button.addEventListener('click', () => {
      let name: string;
      let color: string;
      let id: number;
      let data: BalloonData;
      name = this.inputCreate.input.value;
      color = this.inputColorCreate.colorInput.value;
      this.controller.getGarageObject().then((obj) => {
        id = Object.keys(obj).length + 1;
        data = { name, color, id };
        console.log('data:', data);
        this.controller.postNewBalloon(data);
      });
    });
  }
}

export default Controls;
