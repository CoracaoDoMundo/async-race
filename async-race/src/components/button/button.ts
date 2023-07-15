import './button.scss';
import { createElement } from '../../utilities/service-functions';

class Button {
  public button: HTMLDivElement;
  private buttonInner: HTMLDivElement;
  private text: HTMLSpanElement;

  constructor(container: HTMLDivElement, name: string) {
    this.button = createElement('div', ['button'], container);
    this.buttonInner = createElement('div', ['buttonInner'], this.button);
    this.text = createElement('span', ['buttonText'], this.buttonInner, name);
  }
}

export default Button;
