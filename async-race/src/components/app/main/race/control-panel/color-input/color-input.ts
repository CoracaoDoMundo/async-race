import './color-input.scss';
import { createElement } from '../../../../../../utilities/service-functions';

class ColorInput {
  public colorInput: HTMLInputElement;

  constructor(container: HTMLDivElement, color: string, state?: boolean) {
    this.colorInput = createElement('input', ['colorInput'], container);
    this.colorInput.type = 'color';
    this.colorInput.value = color;
    if (state === false) {
      this.colorInput.setAttribute('disabled', '');
    }
  }
}

export default ColorInput;
