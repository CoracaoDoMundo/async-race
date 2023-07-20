import { createElement } from './service-functions';
import { BalloonData } from './types';

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

  createNewBalloon(data: BalloonData) {
    const balloon = async () => {
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

  postNewBalloon(data: BalloonData) {
    const balloon = async () => {
      const res = await this.createNewBalloon(data);
    };
    balloon();
  }

  deleteBalloon(id: number) {
    const balloon = async (id: number) => {
      const resp = await fetch(`${this.url}/garage/${id}`, {
        method: 'DELETE',
      });
    };
    const del = async () => {
      const res = await balloon(id);
    };
    del();
  }
}

export default Controller;
