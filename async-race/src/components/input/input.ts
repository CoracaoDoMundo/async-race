import './input.scss';
import { createElement } from '../../utilities/service-functions';

class TextInput {
  private input: HTMLInputElement;

  constructor(container: HTMLDivElement) {
    this.input = createElement('input', ['input'], container);
    this.input.placeholder = 'Car name...';
  }
}

export default TextInput;
