import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest';
import {
  DriverInfoResponse,
  DriverInfoData,
  GetAvailableDriversResponse,
} from '../payloads/response.interface';
import * as dotenv from 'dotenv';
import { DriverRoles, Location } from '@quangdvnnnn/go-n-share';

dotenv.config();
export class DriverService extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.DRIVER_URL;
  }

  willSendRequest(req: RequestOptions) {
    if (this.context.req.headers.cookie) {
      req.headers.set('Cookie', `${this.context.req.headers.cookie}`);
    } else if (this.context.req.header('Authorization')) {
      req.headers.set(
        'Authorization',
        `${this.context.req.header('Authorization')}`
      );
    }
  }

  async getHello(): Promise<string> {
    const res = await this.get('/');
    return res;
  }

  async getInfo(): Promise<DriverInfoData | null> {
    const res = await this.get<DriverInfoResponse>('schedule/me');
    return res.success ? res.data : null;
  }

  async getAvailableDrivers(
    location: Location,
    role: DriverRoles,
    departureDate: string,
    shift: number,
    drivingDuration: number
  ) {
    try {
      const res = await this.post<GetAvailableDriversResponse>(
        `schedule/available`,
        {
          location,
          role,
          shift,
          departureDate,
          drivingDuration,
        }
      );
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
