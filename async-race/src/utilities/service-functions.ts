const createElement = <T extends HTMLElement>(
  tagName: keyof HTMLElementTagNameMap,
  classNames: string[],
  parentNode: HTMLElement,
  text?: string,
  place?: string
): T => {
  const element = document.createElement(tagName) as T;
  element.classList.add(...classNames);
  if (text) {
    element.textContent = text;
  }
  if (place === 'before') {
    parentNode.prepend(element);
  } else {
    parentNode.append(element);
  }
  return element;
};

const createBalloonBlocks = (container:HTMLDivElement): HTMLDivElement[] => {
  let arr: HTMLDivElement[] = [];
  let i = 0;
  while (i < 7) {
    const block:HTMLDivElement = createElement('div', ['balloonBlock'], container);
    arr.push(block);
    i += 1;
  }
  return arr;
};

const moveBalloon = (elem: SVGElement) => {

}

export { createElement, createBalloonBlocks, moveBalloon };
