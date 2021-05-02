import { Location as LocationEnum } from '@quangdvnnnn/go-n-share';
import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest';
import * as dotenv from 'dotenv';
import { SearchTripResponse } from '../payloads/response.interface';

dotenv.config();
export class TripService extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.TRIP_URL;
  }

  willSendRequest(req: RequestOptions) {
    req.headers.set('Cookie', `${this.context.req.headers.cookie}`);
  }

  async getHello(): Promise<string> {
    const res = await this.get('/');
    console.log(res);
    return res;
  }

  async searchTrip(
    departure: LocationEnum,
    arrive: LocationEnum,
    departureDate: string
  ) {
    try {
      const res = await this.post<SearchTripResponse>(`trip/search`, {
        departure,
        arrive,
        departureDate,
      });
      return res.success ? { data: res.data } : null;
    } catch (err) {
      let returnArr = [];
      if (typeof err.extensions.response.body.message === 'string') {
        returnArr.push(err.extensions.response.body.message);
        return {
          error: returnArr,
        };
      }
      return { error: err.extensions.response.body.message };
    }
  }
}
