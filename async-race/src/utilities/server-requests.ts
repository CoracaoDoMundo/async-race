import {
  BalloonData,
  QueryBurnerParams,
  StartRaceData,
  QueryWinnersParams,
  QueryParams,
  winnerInfo,
  winnerUpdateInfo,
  winnerRespond
} from './types';

class Controller {
  private static instance: Controller;
  public url: string = 'http://localhost:3000';

  private constructor() {}

  public static getInstance(): Controller {
    if (!Controller.instance) {
      Controller.instance = new Controller();
    }
    return Controller.instance;
  }

  getGarageObject(): Promise<Object> {
    const num = async () => {
      const data = await fetch(`${this.url}/garage/`);
      const body = await data.json();
      return body;
    };
    const res = num();
    return res;
  }

  getBalloonInfo(index: number): Promise<Object> {
    const balloon = async () => {
      const data = await fetch(`${this.url}/garage/${index}`);
      const body = await data.json();
      return body;
    };
    const res = balloon();
    return res;
  }

  createNewBalloon(data: BalloonData): void {
    const balloon = async (): Promise<void> => {
      const resp = await fetch(`${this.url}/garage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      const res = await this.createNewBalloon(data);
    };
    balloon();
  }

  deleteBalloon(id: number): void {
    const balloon = async (id: number): Promise<void> => {
      const resp = await fetch(`${this.url}/garage/${id}`, {
        method: 'DELETE',
      });
    };
    const del = async (): Promise<void> => {
      const res = await balloon(id);
    };
    del();
  }

  updateBalloon(id: number, data: BalloonData): void {
    const balloon = async (): Promise<void> => {
      const resp = await fetch(`${this.url}/garage/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
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
      const res = await this.updateBalloon(id, data);
    };
    balloon();
  }

  generateQueryString(data: QueryParams): string {
    let result = '?';
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = String(data[key as keyof QueryParams]);
        if (result === '?') {
          result = result + `${key}=${value}`;
        } else {
          result = result + `&${key}=${value}`;
        }
      }
    }
    return result;
  }

  startStopBurner(data: QueryBurnerParams): Promise<StartRaceData | void> {
    const race = async (): Promise<StartRaceData | void> => {
      const params = this.generateQueryString(data);
      const resp = await fetch(`${this.url}/engine${params}`, {
        method: 'PATCH',
      });
      try {
        const body = await resp.json();
        return body;
      } catch (error) {
        switch (resp.status) {
          case 404:
            console.log('Balloon with such id was not found in the hangar');
            break;
          case 400:
            console.log('Wrong parameters for start of the moving');
            break;
          default:
            console.log('Something went wrong!');
        }
      }
    };
    const result = race();
    return result;
  }

  async race(
    data: QueryBurnerParams,
    timer: NodeJS.Timer,
    velocity: number
  ): Promise<
    { resp: Response; balloonId: number; velocity: number } | undefined
  > {
    const params = this.generateQueryString(data);
    const resp = await fetch(`${this.url}/engine${params}`, {
      method: 'PATCH',
    });
    const balloonId = data.id;
    // console.log('resp_drive:', resp);
    try {
      const body = await resp.json();
      // console.log('resp:', resp);
      return { resp, balloonId, velocity };
    } catch (error) {
      switch (resp.status) {
        case 500:
          clearInterval(timer);
          console.log(
            `Balloon has been landed suddenly. It's burner was broken down.`
          );
          throw new Error(
            'Balloon has been landed suddenly. Its burner was broken down.'
          );
          break;
        case 400:
          console.log('Wrong parameters for start of the moving');
          break;
        case 404:
          console.log(
            'Burner parameters for balloon with such id was not found in the hangar. Have you tried to set burner status to "started" before?'
          );
          break;
        case 429:
          console.log(
            `Flight already in progress. You can't run flight for the same balloon twice while it's not stopped.`
          );
          break;
        default:
          console.log('Something went wrong!');
      }
    }
  }

  switchBalloonEngineToDrive(
    data: QueryBurnerParams,
    timer: NodeJS.Timer,
    velocity: number
  ): Promise<
    { resp: Response; balloonId: number; velocity: number } | undefined
  > {
    return new Promise((resolve, reject) => {
      this.race(data, timer, velocity)
        .then((resp) => {
          resolve(resp);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async getWinners(data?: QueryWinnersParams): Promise<Array<winnerRespond> | undefined> {
    try {
      let params: string = '';
      if (data) {
        params = this.generateQueryString(data);
      }
      const winners = await fetch(`${this.url}/winners${params}`, {
        method: 'GET',
      });
      const body = await winners.json();
      return body;
    } catch {
      console.log('Wrong winners request!');
    }
  }

  async getWinner(id: number): Promise<winnerRespond | undefined> {
    try {
      const winner = await fetch(`${this.url}/winners/${id}`, {
        method: 'GET',
      });
      const body = await winner.json();
      return body;
    } catch {
      console.log('Wrong winners request!');
    }
  }

  async createWinner(data: winnerInfo): Promise<void> {
    const resp = await fetch(`${this.url}/winners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: data.id,
        wins: 1,
        name: data.name,
        color: data.color,
        time: data.time,
      }),
    });
  }

  async updateWinner(data: winnerUpdateInfo): Promise<void> {
    const resp = await fetch(`${this.url}/winners/${data.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wins: data.wins,
        time: data.time,
      }),
    });
  }

  async deleteWinner(id: number): Promise<void> {
    const resp = await fetch(`${this.url}/winners/${id}`, {
      method: 'DELETE',
    });
  }
}

export default Controller;
