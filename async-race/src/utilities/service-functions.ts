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

const moveBalloon = (elem: SVGElement, container: HTMLDivElement) => {
  if (elem.parentElement) {
    elem.classList.remove('animatedBalloon');
    let currentPlace = elem.parentElement.offsetLeft;
    console.log('currentPlace:', currentPlace);
    const endPlace = container.clientWidth - 80;
    console.log('document:', document.documentElement.clientWidth);
    console.log('container:', container.clientWidth);
    let move = () => {
      const interId = setInterval(() => {
        currentPlace += 10;
        if (currentPlace > endPlace) {
          clearInterval(interId);
          // elem.classList.add('animatedBalloon');
        }
        elem.style.transform = `translateX(${currentPlace}px)`;
      }, 16)
    }
    move();
  }
}

const pauseBalloonMove = () => {

}

const moveBalloonOnStart = () => {

}

export { createElement, createBalloonBlocks, moveBalloon };
