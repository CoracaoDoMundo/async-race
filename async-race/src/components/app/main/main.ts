import Race from "./race/race";
import Winners from "./winners/winners";
import Button from "./button/button";

class Main {
  private race: Race;

  public winners: Winners;

  private hangarBtn: Button;

  private winnersBtn: Button;

  constructor(hangarBtn: Button, winnersBtn: Button) {
    this.race = new Race();
    this.race.draw();
    this.winners = new Winners();
    this.hangarBtn = hangarBtn;
    this.hangarBtn.button.addEventListener("click", (): void =>
      this.pushHangarBtn(),
    );
    this.winnersBtn = winnersBtn;
    this.winnersBtn.button.addEventListener("click", (): void =>
      this.pushWinnersBtn(),
    );
  }

  private pushWinnersBtn(): void {
    this.race.removeContentWhileChangePage();
    this.winners.draw();
  }

  private pushHangarBtn(): void {
    this.winners.removeContentWhileChangePage();
    this.race.controls.draw();
    this.race.hangar.draw();
  }
}

export default Main;
