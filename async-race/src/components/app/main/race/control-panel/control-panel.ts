import './control-panel.scss';
import { createElement } from '../../../../../utilities/service-functions';
import TextInput from './input/input';
import ColorInput from './color-input/color-input';
import Button from '../../button/button';
import Controller from '../../../../../utilities/server-requests';
import { BalloonData } from '../../../../../utilities/types';

class Controls {
  private controlBlock: HTMLDivElement;
  private inputCreateLine: HTMLDivElement;
  private inputUpdateLine: HTMLDivElement;
  private buttonsLine: HTMLDivElement;
  public inputCreate: TextInput;
  private inputUpdate: TextInput;
  public inputColorCreate: ColorInput;
  private inputColorUpdate: ColorInput;
  public createBtn: Button;
  private updateBtn: Button;
  private raceBtn: Button;
  private resetBtn: Button;
  public generateBtn: Button;
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
    this.updateBtn = new Button(this.inputUpdateLine, 'UPDATE');
    this.raceBtn = new Button(this.buttonsLine, 'RACE');
    this.resetBtn = new Button(this.buttonsLine, 'RESET');
    this.generateBtn = new Button(this.buttonsLine, 'GENERATE BALLOONS');
  }
}

export default Controls;
