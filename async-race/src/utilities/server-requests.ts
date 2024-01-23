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

  public url: string = "http://localhost:3000";

  private constructor() {}

  public static getInstance(): Controller {
    if (!Controller.instance) {
      Controller.instance = new Controller();
    }
    return Controller.instance;
  }

  getGarageObject(): Promise<BalloonData[]> {
    const num = async (): Promise<BalloonData[]> => {
      const data: Response = await fetch(`${this.url}/garage/`);
      const body: BalloonData[] = await data.json();
      return body;
    };
    const res: Promise<BalloonData[]> = num();
    return res;
  }

  getBalloonInfo(index: number): Promise<BalloonData> {
    const balloon = async (): Promise<BalloonData> => {
      const data: Response = await fetch(`${this.url}/garage/${index}`);
      const body: BalloonData = await data.json();
      return body;
    };
    const res: Promise<BalloonData> = balloon();
    return res;
  }

  createNewBalloon(data: BalloonData): void {
    const balloon = async (): Promise<void> => {
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
    };
    balloon();
  }

  postNewBalloon(data: BalloonData): void {
    const balloon = async (): Promise<void> => {
      await this.createNewBalloon(data);
    };
    balloon();
  }

  deleteBalloon(id: number): void {
    const balloon = async (id: number): Promise<void> => {
      await fetch(`${this.url}/garage/${id}`, {
        method: "DELETE",
      });
    };
    const del = async (): Promise<void> => {
      await balloon(id);
    };
    del();
  }

  updateBalloon(id: number, data: BalloonData): void {
    const balloon = async (): Promise<void> => {
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
    };
    balloon();
  }

  postUpdatedBalloon(id: number, data: BalloonData): void {
    const balloon = async (): Promise<void> => {
      await this.updateBalloon(id, data);
    };
    balloon();
  }

  generateQueryString(data: QueryParams): string {
    let result: string = "?";
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value: string = String(data[key as keyof QueryParams]);
        if (result === "?") {
          result += `${key}=${value}`;
        } else if (key === "sort" || key === "order") {
          result += `&_${key}=${value}`;
        } else {
          result += `&${key}=${value}`;
        }
      }
    }
    return result;
  }

  startStopBurner(data: QueryBurnerParams): Promise<StartRaceData | void> {
    const race = async (): Promise<StartRaceData | void> => {
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
    };
    return race();
  }

  async race(
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
      switch (resp.status) {
        case 500:
          clearInterval(timer);
          console.log(
            `Balloon has been landed suddenly. It's burner was broken down.`,
          );
          if (isRace === true) {
            throw new Error();
          }
          break;
        case 400:
          console.log("Wrong parameters for start of the moving");
          break;
        case 404:
          console.log(
            'Burner parameters for balloon with such id was not found in the hangar. Have you tried to set burner status to "started" before?',
          );
          break;
        case 429:
          console.log(
            `Flight already in progress. You can't run flight for the same balloon twice while it's not stopped.`,
          );
          break;
      }
    }
  }

  switchBalloonEngineToDrive(
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

  async getWinners(
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
    }
  }

  async getWinner(id: number): Promise<WinnerRespond | undefined> {
    try {
      const winner: Response = await fetch(`${this.url}/winners/${id}`, {
        method: "GET",
      });
      const body: WinnerRespond | undefined = await winner.json();
      return body;
    } catch {
      console.log("Wrong winners request!");
    }
  }

  async createWinner(
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

  async chooseUpdateOrCreateUser(id: number, data: WinnerInfo) {
    const winner: WinnerRespond | undefined = await this.getWinner(id);
    let wins: number;
    let time: number;
    if (winner instanceof Object) {
      if (Object.keys(winner).length === 0) {
        if (data) {
          this.createWinner(data);
        }
      } else {
        await this.deleteWinner(data.id);
        wins = winner.wins + 1;
        time = winner.time;
        this.createWinner(data, wins, time);
      }
    }
  }

  async deleteWinner(id: number): Promise<void> {
    await fetch(`${this.url}/winners/${id}`, {
      method: "DELETE",
    });
  }
}

export default Controller;
