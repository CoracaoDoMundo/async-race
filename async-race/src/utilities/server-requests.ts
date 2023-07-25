import {
  BalloonData,
  QueryBurnerParams,
  StartRaceData,
  QueryWinnersParams,
  QueryParams,
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
    // console.log('typeof:', typeof data);
    let result = '?';
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        // console.log('key:', key);
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
  ): Promise<{ resp: Response; balloonId: number; velocity: number } | undefined> {
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
          console.log(
            `Balloon has been landed suddenly. It's burner was broken down.`
          );
          clearInterval(timer);
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
  ): Promise<{ resp: Response; balloonId: number; velocity: number } | undefined> {
    const result = this.race(data, timer, velocity);
    // console.log('result:', result);
    return result;
  }

  async getWinners(data?: QueryWinnersParams) {
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
}

export default Controller;
