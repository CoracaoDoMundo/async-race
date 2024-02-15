import "./header.scss";
import { createElement } from "../../../utilities/service-functions";
import Button from "../main/button/button";

class Header {
  private header: HTMLDivElement;

  private buttonBlock: HTMLDivElement;

  public hangarBtn: Button;

  public winnersBtn: Button;

  constructor() {
    this.header = createElement("div", ["header"], document.body);
    createElement("h1", ["mainHeader"], this.header, "Async Air Race");
    this.buttonBlock = createElement("div", ["buttonBlock"], this.header);
    this.hangarBtn = new Button(this.buttonBlock, { name: "TO HANGAR" });
    this.winnersBtn = new Button(this.buttonBlock, { name: "TO WINNERS" });
  }
}

export default Header;
