import "./balloon.scss";

import {
  DAttribute,
  FillAttribute,
} from "../../../../../../../utilities/types";

class Balloon {
  public balloon: SVGElement;

  constructor(id?: number) {
    this.balloon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    this.balloon.setAttribute("id", String(id));
  }

  public draw(container: HTMLDivElement, color: string): void {
    this.balloon.setAttribute("viewBox", "37.98 9.97 63.31 78.2");
    this.balloon.setAttribute("xml:space", "preserve");
    this.balloon.classList.add("balloon", "animatedBalloon");
    this.balloon.classList.add("balloon", "onStart");
    const gBlock: SVGGraphicsElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g",
    );
    gBlock.classList.add("layer");
    const secondGBlock: SVGGraphicsElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g",
    );
    secondGBlock.setAttribute("id", "svg_1");
    const svgIdStartNum = 2;
    const svgIdFinalNum = 22;
    for (let i = svgIdStartNum; i <= svgIdFinalNum; i += 1) {
      const path: SVGPathElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      path.setAttribute("d", DAttribute[i]);
      path.setAttribute("id", `svg_${i}`);
      if (i === 3) {
        path.setAttribute("fill", color);
      } else if (i === 4 || i === 5) {
        path.setAttribute("fill", FillAttribute[2]);
      } else if (i === 6) {
        path.setAttribute("fill", FillAttribute[3]);
      } else if (i >= 7 && i <= 10) {
        path.setAttribute("fill", FillAttribute[4]);
      }
      secondGBlock.append(path);
    }
    this.balloon.setAttribute("color", color);
    this.balloon.append(gBlock);
    gBlock.append(secondGBlock);
    container.append(this.balloon);
  }
}

export default Balloon;
