import {
  BalloonData,
  QueryBurnerParams,
  StartRaceData,
  QueryWinnersParams,
  QueryParams,
  WinnerInfo,
  WinnerRespond,
} from "./types";

class Controller {
  private static instance: Controller;

  private queryString: string = "?";

  private errorText: string = "Error occurred";

  public url: string = "http://localhost:3000";

  public static getInstance(): Controller {
    if (!Controller.instance) {
      Controller.instance = new Controller();
    }
    return Controller.instance;
  }

  public async getGarageObject(): Promise<BalloonData[]> {
    const data: Response = await fetch(`${this.url}/garage/`);
    const body: BalloonData[] = await data.json();
    return body;
  }

  public async getBalloonInfo(index: number): Promise<BalloonData> {
    const data: Response = await fetch(`${this.url}/garage/${index}`);
    const body: BalloonData = await data.json();
    return body;
  }

  private async createNewBalloon(data: BalloonData): Promise<void> {
    await fetch(`${this.url}/garage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        color: data.color,
        id: data.id,
      }),
    });
  }

  public async postNewBalloon(data: BalloonData): Promise<void> {
    await this.createNewBalloon(data);
  }

  public async deleteBalloon(id: number): Promise<void> {
    await fetch(`${this.url}/garage/${id}`, {
      method: "DELETE",
    });
  }

  private async updateBalloon(id: number, data: BalloonData): Promise<void> {
    await fetch(`${this.url}/garage/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        color: data.color,
      }),
    });
  }

  public async postUpdatedBalloon(
    id: number,
    data: BalloonData,
  ): Promise<void> {
    await this.updateBalloon(id, data);
  }

  private generateQueryString(data: QueryParams): string {
    this.queryString = "?";
    const dataArr = Object.entries(data);
    for (let i = 0; i <= dataArr.length - 1; i += 1) {
      const value: string = String(dataArr[i][1]);
      if (this.queryString === "?") {
        this.queryString += `${dataArr[i][0]}=${value}`;
      } else if (dataArr[i][0] === "sort" || dataArr[i][0] === "order") {
        this.queryString += `&_${dataArr[i][0]}=${value}`;
      } else {
        this.queryString += `&${dataArr[i][0]}=${value}`;
      }
    }
    return this.queryString;
  }

  public async startStopBurner(
    data: QueryBurnerParams,
  ): Promise<StartRaceData | void> {
    const params: string = this.generateQueryString(data);
    const resp: Response = await fetch(`${this.url}/engine${params}`, {
      method: "PATCH",
    });
    try {
      const body: StartRaceData = await resp.json();
      return body;
    } catch (error) {
      switch (resp.status) {
        case 404:
          console.log("Balloon with such id was not found in the hangar");
          break;
        case 400:
          console.log("Wrong parameters for start of the moving");
          break;
        default:
          console.log("Something went wrong!");
      }
    }
    return undefined;
  }

  private async race(
    data: QueryBurnerParams,
    timer: NodeJS.Timer,
    velocity: number,
    isRace: boolean,
  ): Promise<
    { resp: Response; balloonId: number; velocity: number } | undefined
  > {
    const params: string = this.generateQueryString(data);
    const resp: Response = await fetch(`${this.url}/engine${params}`, {
      method: "PATCH",
    });
    const balloonId: number = data.id;
    try {
      await resp.json();
      return { resp, balloonId, velocity };
    } catch (error) {
      this.formErrorText(resp.status, timer, isRace);
      return undefined;
    }
  }

  private formErrorText(
    status: number,
    timer: NodeJS.Timer,
    isRace: boolean,
  ): void {
    switch (status) {
      case 500:
        clearInterval(timer);
        this.errorText = `Balloon has been landed suddenly. It's burner was broken down.`;
        console.log(this.errorText);
        if (isRace) throw new Error();
        break;
      case 400:
        this.errorText = "Wrong parameters for start of the moving";
        console.log(this.errorText);
        break;
      case 404:
        this.errorText =
          'Burner parameters for balloon with such id was not found in the hangar. Have you tried to set burner status to "started" before?';
        console.log(this.errorText);
        if (isRace) throw new Error();
        break;
      case 429:
        this.errorText = `Flight already in progress. You can't run flight for the same balloon twice while it's not stopped.`;
        console.log(this.errorText);
        break;
      default:
        console.log(this.errorText);
    }
  }

  public async switchBalloonEngineToDrive(
    data: QueryBurnerParams,
    timer: NodeJS.Timer,
    velocity: number,
    isRace: boolean,
  ): Promise<
    { resp: Response; balloonId: number; velocity: number } | undefined
  > {
    return new Promise((resolve, reject): void => {
      this.race(data, timer, velocity, isRace)
        .then((resp) => {
          resolve(resp);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async getWinners(
    data?: QueryWinnersParams,
  ): Promise<Array<WinnerRespond> | undefined> {
    try {
      let params: string = "";
      if (data) {
        params = this.generateQueryString(data);
      }
      const winners: Response = await fetch(`${this.url}/winners${params}`, {
        method: "GET",
      });
      const body: WinnerRespond[] | undefined = await winners.json();
      return body;
    } catch {
      console.log("Wrong winners request!");
      return undefined;
    }
  }

  private async getWinner(id: number): Promise<WinnerRespond | undefined> {
    try {
      const winner: Response = await fetch(`${this.url}/winners/${id}`, {
        method: "GET",
      });
      const body: WinnerRespond | undefined = await winner.json();
      return body;
    } catch {
      console.log("Wrong winners request!");
      return undefined;
    }
  }

  private async createWinner(
    data: WinnerInfo,
    wins?: number,
    bestTime?: number,
  ): Promise<void> {
    let currentWins: number;
    let currentBestTime: number = data.time;
    if (wins) {
      currentWins = wins;
    } else {
      currentWins = 1;
    }
    if (bestTime && bestTime < data.time) {
      currentBestTime = bestTime;
    }
    await fetch(`${this.url}/winners`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: data.id,
        wins: currentWins,
        time: currentBestTime,
      }),
    });
  }

  public async chooseUpdateOrCreateWinner(
    id: number,
    data: WinnerInfo,
  ): Promise<void> {
    const winner: WinnerRespond | undefined = await this.getWinner(id);
    let wins: number;
    let time: number;
    if (!(winner instanceof Object)) return;
    if (Object.keys(winner).length === 0) {
      if (!data) return;
      this.createWinner(data);
    } else {
      await this.deleteWinner(data.id);
      wins = winner.wins + 1;
      time = winner.time;
      this.createWinner(data, wins, time);
    }
  }

  public async deleteWinner(id: number): Promise<void> {
    await fetch(`${this.url}/winners/${id}`, {
      method: "DELETE",
    });
  }
}

export default Controller;
