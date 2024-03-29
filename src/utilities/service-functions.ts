import { BalloonData, TimerFunc } from "./types";

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
    const textNode = document.createTextNode(text);
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
    element.appendChild(textNode);
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

const moveBalloonOnStart = (elem: SVGElement): void => {
  if (elem.getAttribute("air") === "true") {
    elem.removeAttribute("air");
    const container = elem.closest(".raceBlock");
    if (container) elem.classList.remove(`onMove${container.id}`);
    elem.classList.add("onStart");
    elem.classList.add("animatedBalloon");
  }
};

const createWinnerAnnounce = (
  container: HTMLElement,
  name: string,
  time: string,
): void => {
  const announceInfo: string = `The winner is ${name} balloon for ${time} seconds!`;
  const announceCover: HTMLDivElement = createElement(
    "div",
    ["announceCover"],
    container,
  );
  createElement("div", ["announceWindow"], announceCover, announceInfo);

  announceCover.addEventListener("click", (): void => announceCover.remove());
};

const startTimer = (): TimerFunc => {
  const startTime = Date.now();

  return (): number => {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    return elapsedTime;
  };
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
  // moveBalloon,
  moveBalloonOnStart,
  insertElement,
  createWinnerAnnounce,
  startTimer,
  sortValues,
};
