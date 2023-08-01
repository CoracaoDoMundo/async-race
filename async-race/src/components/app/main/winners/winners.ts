import WinnersTable from './winners-table/winners-table';
import Button from '../button/button';

class Winners {
  public winnersTable: WinnersTable;

  constructor() {
    this.winnersTable = new WinnersTable();
    this.pushNextPaginationButton(this.winnersTable.nextBtn);
    this.pushPreviousPaginationButton(this.winnersTable.prevBtn);
  }

  draw(): void {
    this.winnersTable.draw();
  }

  removeContentWhileChangePage(): void {
    this.winnersTable.winnersBlock.remove();
  }

  refreshWinnersTable(): void {
    this.winnersTable.winnersTableBlock.innerHTML = '';
    this.winnersTable.drawTableHeadline(this.winnersTable.winnersTableBlock);
    this.winnersTable.fillTable(
      this.winnersTable.pageNum,
      this.winnersTable.winnersTableBlock
    );
  }

  pushNextPaginationButton(elem: Button): void {
    elem.button.addEventListener('click', (): void => {
      if (
        this.winnersTable.pagesQuantity > 1 &&
        this.winnersTable.pageNum < this.winnersTable.pagesQuantity
      ) {
        this.winnersTable.prevBtn.button.classList.remove('inactive');
        this.winnersTable.pageNum += 1;
        this.winnersTable.pageNumContainer.textContent = `# ${this.winnersTable.pageNum}`;
        this.refreshWinnersTable();
        if (this.winnersTable.pageNum === this.winnersTable.pagesQuantity) {
          this.winnersTable.nextBtn.button.classList.add('inactive');
        }
      }
    });
  }

  pushPreviousPaginationButton(elem: Button): void {
    elem.button.addEventListener('click', (): void => {
      if (
        this.winnersTable.pagesQuantity > 1 &&
        this.winnersTable.pageNum > 1
      ) {
        this.winnersTable.nextBtn.button.classList.remove('inactive');
        this.winnersTable.pageNum -= 1;
        this.winnersTable.pageNumContainer.textContent = `# ${this.winnersTable.pageNum}`;
        this.refreshWinnersTable();
        if (this.winnersTable.pageNum === 1) {
          this.winnersTable.prevBtn.button.classList.add('inactive');
        }
      }
    });
  }
}

export default Winners;
