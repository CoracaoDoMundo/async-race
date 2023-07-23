import { createElement } from './service-functions';
import { BalloonData, QueryParams, StartRaceData } from './types';

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
    return `?id=${data.id}&status=${data.status}`;
  }

  startStopRace(data: QueryParams): Promise<StartRaceData | void> {
    const race = async (): Promise<StartRaceData | void> => {
      const params = this.generateQueryString(data);
      const resp = await fetch(`${this.url}/engine${params}`, {
        method: 'PATCH',
      });
      // console.log('resp:', resp);
      try {
        const body = await resp.json();
        console.log('body:', body);
        return body;
      } catch (error) {
        if (resp.status === 404) {
          console.log('Car with such id was not found in the garage');
        } else if (resp.status === 400) {
          console.log('Wrong parameters for start of the moving');
        } else {
          console.log('Something went wrong!');
        }
      }
    };
    const result = race();
    return result;
  }
}

export default Controller;
