import "./button.scss";
import { createElement } from "../../../../utilities/service-functions";
import { TButtonOptions } from "../../../../utilities/types";

class Button {
  public button: HTMLDivElement;

  private buttonInner: HTMLDivElement;

  constructor(container: HTMLDivElement, options: TButtonOptions) {
    const { name, inactive, id } = options;
    this.button = createElement("div", ["button"], container);
    if (inactive) this.button.classList.add("inactive");
    this.buttonInner = createElement("div", ["buttonInner"], this.button);
    createElement("span", ["buttonText"], this.buttonInner, name);
    this.button.setAttribute("id", String(id));
  }
}

export default Button;
