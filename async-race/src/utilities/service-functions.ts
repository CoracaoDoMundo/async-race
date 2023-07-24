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

const insertElement = <T extends HTMLElement>(
  element: HTMLElement,
  classNames: string[],
  parentNode: HTMLElement,
  text?: string,
  place?: string
): void => {
  element.classList.add(...classNames);
  if (text) {
    element.textContent = text;
  }
  if (place === 'before') {
    parentNode.prepend(element);
  } else {
    parentNode.append(element);
  }
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
    elem.setAttribute('air', 'true');
    let currentPlace = elem.parentElement.offsetLeft;
    const endPlace = container.clientWidth - 80;
    const time = (endPlace - currentPlace) / speed;
    const framesQuantity = time * 60;
    const shift = (endPlace - currentPlace) / framesQuantity;
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

const moveBalloonOnStart = (elem: SVGElement) => {
  if (elem.getAttribute('air') === 'true') {
    elem.removeAttribute('air');
    elem.style.transform = `translateX(0px)`;
    elem.classList.add('animatedBalloon');
  }
};

export { createElement, createBalloonBlocks, moveBalloon, moveBalloonOnStart, insertElement };
