import { BalloonData } from "./types";

const createElement = <T extends HTMLElement>(
  tagName: keyof HTMLElementTagNameMap,
  classNames: string[],
  parentNode: HTMLElement,
  text?: string,
  place?: string,
): T => {
  const element = document.createElement(tagName) as T;
  element.classList.add(...classNames);
  if (text) {
    element.textContent = text;
  }
  if (place === "before") {
    parentNode.prepend(element);
  } else {
    parentNode.append(element);
  }
  return element;
};

const insertElement = (
  element: HTMLElement,
  classNames: string[],
  parentNode: HTMLElement,
  text?: string,
  place?: string,
): void => {
  element.classList.add(...classNames);
  if (text) {
    element.textContent = text;
  }
  if (place === "before") {
    parentNode.prepend(element);
  } else {
    parentNode.append(element);
  }
};

const createBalloonBlocks = (container: HTMLDivElement): HTMLDivElement[] => {
  const arr: HTMLDivElement[] = [];
  let i = 0;
  while (i < 7) {
    const block: HTMLDivElement = createElement(
      "div",
      ["balloonBlock"],
      container,
    );
    arr.push(block);
    i += 1;
  }
  return arr;
};

const moveBalloon = (
  elem: SVGElement,
  container: HTMLDivElement,
  speed: number,
): NodeJS.Timer | undefined => {
  if (elem.parentElement) {
    elem.classList.remove("animatedBalloon");
    elem.setAttribute("air", "true");
    let currentPlace: number = elem.parentElement.offsetLeft;
    const endPlace: number = container.clientWidth - 80;
    const time: number = (endPlace - currentPlace) / speed;
    const framesQuantity: number = time * 60;
    const shift: number = (endPlace - currentPlace) / framesQuantity;
    const intervalId: NodeJS.Timer = setInterval((): void => {
      currentPlace += shift;
      if (currentPlace > endPlace) {
        clearInterval(intervalId);
      }
      elem.style.transform = `translateX(${currentPlace}px)`;
    }, 16);
    return intervalId;
  }
};

const moveBalloonOnStart = (elem: SVGElement): void => {
  if (elem.getAttribute("air") === "true") {
    elem.removeAttribute("air");
    elem.style.transform = `translateX(0px)`;
    elem.classList.add("animatedBalloon");
  }
};

const createWinnerAnnounce = (
  container: HTMLElement,
  name: string,
  time: string,
): void => {
  if (name === "") {
    name = "no name";
  }
  const announceInfo: string = `The winner is ${name} balloon for ${time} seconds!`;
  const announceCover: HTMLDivElement = createElement(
    "div",
    ["announceCover"],
    container,
  );
  createElement("div", ["announceWindow"], announceCover, announceInfo);

  announceCover.addEventListener("click", (): void => announceCover.remove());
};

const sortValues = (obj: BalloonData[]): (number | undefined)[] => {
  return obj
    .map((el) => el.id)
    .sort((a, b) => {
      if (a === undefined && b === undefined) {
        return 0;
      }
      if (a === undefined) {
        return -1;
      }
      if (b === undefined) {
        return 1;
      }
      return a - b;
    });
};

export {
  createElement,
  createBalloonBlocks,
  moveBalloon,
  moveBalloonOnStart,
  insertElement,
  createWinnerAnnounce,
  sortValues,
};
