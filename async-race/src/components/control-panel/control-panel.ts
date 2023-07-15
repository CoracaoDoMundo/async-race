import './control-panel.scss';
import { createElement } from '../../utilities/service-functions';
import TextInput from '../input/input';
import ColorInput from '../color-input/color-input';
import Button from '../button/button';

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

  constructor() {
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
    this.updateBtn = new Button(this.inputUpdateLine, 'UPDATE');
    this.raceBtn = new Button(this.buttonsLine, 'RACE');
    this.resetBtn = new Button(this.buttonsLine, 'RESET');
    this.generateBtn = new Button(this.buttonsLine, 'GENERATE BALLOONS');
  }
}

export default Controls;
