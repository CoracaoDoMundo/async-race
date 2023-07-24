import Controller from '../../../../utilities/server-requests';
import WinnersTable from './winners-table/winners-table';

class Winners {
  private controller: Controller;
  private winnersTable: WinnersTable;

  constructor() {
    this.controller = Controller.getInstance();
    this.winnersTable = new WinnersTable();
  }
}

export default Winners;
