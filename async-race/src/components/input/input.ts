import './input.scss';
import { createElement } from '../../utilities/service-functions';

class TextInput {
  private input: HTMLInputElement;

  constructor(container: HTMLDivElement, state?: boolean) {
    this.input = createElement('input', ['input'], container);
    this.input.placeholder = 'Balloon name...';
    if (state === false) {
      this.input.setAttribute('disabled', 'disabled');
    }
  }
}

export default TextInput;
