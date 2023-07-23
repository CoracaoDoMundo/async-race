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

const createBalloonBlocks = (container: HTMLDivElement): HTMLDivElement[] => {
  let arr: HTMLDivElement[] = [];
  let i = 0;
  while (i < 7) {
    const block: HTMLDivElement = createElement(
      'div',
      ['balloonBlock'],
      container
    );
    arr.push(block);
    i += 1;
  }
  return arr;
};

const moveBalloon = (
  elem: SVGElement,
  container: HTMLDivElement,
  speed: number
) => {
  if (elem.parentElement) {
    let animationId: number | null;
    elem.classList.remove('animatedBalloon');
    let currentPlace = elem.parentElement.offsetLeft;
    const endPlace = container.clientWidth - 80;
    const time = (endPlace - currentPlace) / speed;
    console.log('time:', time);
    const framesQuantity = time * 60;
    const shift = (endPlace - currentPlace) / framesQuantity;
    elem.classList.remove('animatedBalloon');
    let move = setInterval(() => {
      currentPlace += shift;
      if (currentPlace > endPlace) {
        clearInterval(move);
      }
      elem.style.transform = `translateX(${currentPlace}px)`;
    }, 16);
    return move;
  }
};

const moveBalloonOnStart = () => {};

export { createElement, createBalloonBlocks, moveBalloon };
