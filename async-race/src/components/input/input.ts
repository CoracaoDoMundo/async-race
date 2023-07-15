import './input.scss';
import { createElement } from '../../utilities/service-functions';

class TextInput {
  private input: HTMLInputElement;

  constructor(container: HTMLDivElement) {
    this.input = createElement('input', ['input'], container);
    this.input.placeholder = 'Balloon name...';
  }
}

export default TextInput;
