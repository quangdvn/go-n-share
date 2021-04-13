import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest';
import {
  StaffInfoResponse,
  StaffInfoData,
  GetRoutesResponse,
  GetRoutesData,
  GetAvailableCoachesResponse,
  GetAvailableCoachesData,
} from '../payloads/response.interface';
import * as dotenv from 'dotenv';
import { TripShift } from '@quangdvnnnn/go-n-share';

dotenv.config();

export class VehicleService extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.VEHICLE_URL;
  }

  willSendRequest(req: RequestOptions) {
    req.headers.set('Cookie', `${this.context.req.headers.cookie}`);
  }

  async getHello(): Promise<string> {
    const res = await this.get('/');
    return res;
  }

  async getRoutes(): Promise<GetRoutesData[] | null> {
    const res = await this.get<GetRoutesResponse>('coach/routes');
    return res.success ? res.data : null;
  }

  async getAvailableCoaches(
    departureDate: string,
    shift: TripShift,
    routeId: number
  ): Promise<GetAvailableCoachesData[] | null> {
    const res = await this.post<GetAvailableCoachesResponse>(
      `coach/available`,
      {
        departureDate,
        shift,
        routeId,
      }
    );
    return res.success ? res.data : null;
  }
}
