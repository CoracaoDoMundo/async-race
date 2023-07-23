import './button.scss';
import { createElement } from '../../../../utilities/service-functions';

class Button {
  public button: HTMLDivElement;
  private buttonInner: HTMLDivElement;
  private text: HTMLSpanElement;

  constructor(container: HTMLDivElement, name: string, id?: number) {
    this.button = createElement('div', ['button'], container);
    if (name === 'UPDATE' || name === 'RESET' || name === 'Land') {
      this.button.classList.add('inactive');
    }
    this.buttonInner = createElement('div', ['buttonInner'], this.button);
    this.text = createElement('span', ['buttonText'], this.buttonInner, name);
    this.button.setAttribute('id', String(id));
  }
}

export default Button;
