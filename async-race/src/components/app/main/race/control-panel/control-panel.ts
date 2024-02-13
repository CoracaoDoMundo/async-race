import "./control-panel.scss";
import { insertElement } from "../../../../../utilities/service-functions";
import TextInput from "./input/input";
import ColorInput from "./color-input/color-input";
import Button from "../../button/button";

class Controls {
  public controlBlock: HTMLDivElement = document.createElement("div");

  private inputCreateLine: HTMLDivElement = document.createElement("div");

  private inputUpdateLine: HTMLDivElement = document.createElement("div");

  private buttonsLine: HTMLDivElement = document.createElement("div");

  public inputCreate: TextInput = new TextInput(this.inputCreateLine);

  public inputUpdate: TextInput = new TextInput(this.inputUpdateLine, false);

  public inputColorCreate: ColorInput = new ColorInput(
    this.inputCreateLine,
    "#5900ff",
  );

  public inputColorUpdate: ColorInput = new ColorInput(
    this.inputUpdateLine,
    "#ff00a2",
    false,
  );

  public createBtn: Button = new Button(this.inputCreateLine, {
    name: "CREATE",
  });

  public updateBtn: Button = new Button(this.inputUpdateLine, {
    name: "UPDATE",
    inactive: true,
  });

  public raceBtn: Button = new Button(this.buttonsLine, {
    name: "RACE",
  });

  public resetBtn: Button = new Button(this.buttonsLine, {
    name: "RESET",
    inactive: true,
  });

  public generateBtn: Button = new Button(this.buttonsLine, {
    name: "GENERATE BALLOONS",
  });

  public draw(): void {
    insertElement(this.controlBlock, ["controlBlock"], document.body);
    insertElement(this.inputCreateLine, ["inputsLine"], this.controlBlock);
    insertElement(this.inputUpdateLine, ["inputsLine"], this.controlBlock);
    insertElement(this.buttonsLine, ["buttonsBlock"], this.controlBlock);
  }
}

export default Controls;
