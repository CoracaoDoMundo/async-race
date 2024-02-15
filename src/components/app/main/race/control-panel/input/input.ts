import "./input.scss";
import { createElement } from "../../../../../../utilities/service-functions";

class TextInput {
  public input: HTMLInputElement;

  constructor(container: HTMLDivElement, isDisabled?: boolean) {
    this.input = createElement("input", ["input"], container);
    this.input.placeholder = "Balloon name...";
    if (isDisabled) this.input.setAttribute("disabled", "");
  }
}

export default TextInput;
