import './balloon.scss';
import { createElement } from '../../utilities/service-functions';
import { DAttribute, FillAttribute } from '../../utilities/types';

class Balloon {

  draw(container: HTMLDivElement, color: string): void {
    const balloon: SVGSVGElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    );
    balloon.setAttribute('viewBox', '37.98 9.97 63.31 78.2');
    balloon.setAttribute('xml:space', 'preserve');
    balloon.classList.add('balloon');
    const gBlock: SVGGraphicsElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'g'
    );
    gBlock.classList.add('layer');
    const secondGBlock: SVGGraphicsElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'g'
    );
    secondGBlock.setAttribute('id', 'svg_1');
    for (let i = 2; i <= 26; i += 1) {
      const path: SVGPathElement = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path'
      );
      path.setAttribute('d', DAttribute[i]);
      path.setAttribute('id', `svg_${i}`);
      if (i === 3) {
        path.setAttribute('fill', color);
      } else if (i === 4 || i === 5) {
        path.setAttribute('fill', FillAttribute[2]);
      } else if (i === 6) {
        path.setAttribute('fill', FillAttribute[3]);
      } else if (i >= 7 && i <= 10) {
        path.setAttribute('fill', FillAttribute[4]);
      }
      secondGBlock.append(path);
    }
    balloon.append(gBlock);
    gBlock.append(secondGBlock);
    container.append(balloon);
  }
}

export default Balloon;
