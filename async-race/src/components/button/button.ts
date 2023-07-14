import './button.scss';
import { createElement } from '../../utilities/service-functions';

class Button {
  public button: HTMLDivElement;
  private text: HTMLSpanElement;

  constructor(container: HTMLDivElement, name: string) {
    this.button = createElement('div', ['button'], container);
    this.text = createElement('span', ['buttonText'], this.button, name)
  }
}

export default Button;
