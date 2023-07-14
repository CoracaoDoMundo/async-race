import './color-input.scss';
import { createElement } from '../../utilities/service-functions';

class ColorInput {
    private colorInput: HTMLInputElement;
  
    constructor(container: HTMLDivElement, color: string) {
      this.colorInput = createElement('input', ['colorInput'], container);
      this.colorInput.type = 'color';
      this.colorInput.value = color;
    }
  }
  
  export default ColorInput;