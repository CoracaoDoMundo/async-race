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

export { createElement };
