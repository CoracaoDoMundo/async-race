import "./balloon-block.scss";
import { createElement } from "../../../../../../utilities/service-functions";
import Button from "../../../button/button";
import Balloon from "./balloon/balloon";
import Ribbon from "./ribbon/ribbon";

class BalloonBlock {
  private buttonsNameBlock: HTMLDivElement;

  public selectBtn: Button;

  public removeBtn: Button;

  public balloonName: HTMLSpanElement;

  public raceBlock: HTMLDivElement;

  public upButton: Button;

  public landButton: Button;

  private balloon: HTMLDivElement;

  public balloonSvg: Balloon;

  private ribbon: HTMLDivElement;

  private ribbonSvg: Ribbon = new Ribbon();

  private inactive: boolean = false;

  constructor(
    container: HTMLDivElement,
    name: string,
    color: string,
    id: number | undefined,
  ) {
    this.buttonsNameBlock = createElement(
      "div",
      ["buttonsNameBlock"],
      container,
    );
    this.selectBtn = this.createButton(this.buttonsNameBlock, "SELECT", id);
    this.removeBtn = this.createButton(this.buttonsNameBlock, "REMOVE", id);
    this.balloonName = createElement(
      "span",
      ["balloonName"],
      this.buttonsNameBlock,
      `${name}`,
    );
    this.balloonName.setAttribute("id", String(id));
    this.raceBlock = createElement("div", ["raceBlock"], container);
    this.upButton = this.createButton(this.raceBlock, "Up", id);
    this.landButton = this.createButton(this.raceBlock, "Land", id, true);
    this.balloon = createElement("div", ["balloonContainer"], this.raceBlock);
    this.balloonSvg = new Balloon(id);
    this.balloonSvg.draw(this.balloon, color);
    this.ribbon = createElement("div", ["ribbonContainer"], this.raceBlock);
    this.ribbonSvg.draw(this.ribbon);
    createElement("div", ["trackLine"], this.raceBlock);
  }

  private createButton(
    container: HTMLDivElement,
    name: string,
    id: number | undefined,
    inactive: boolean = this.inactive,
  ): Button {
    return new Button(container, {
      name,
      inactive,
      id,
    });
  }
}

export default BalloonBlock;
