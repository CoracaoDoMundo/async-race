import './header.scss';
import { createElement } from '../../utilities/service-functions';

class Header {
  draw() {
    const header = createElement(
      'h1',
      ['mainHeader'],
      document.body,
      'Async Race'
    );
  }
}

export default Header;
