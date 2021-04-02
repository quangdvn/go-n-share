import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest';
import { DriverInfo, DriverInfoData } from '../payloads/response.interface';
import * as dotenv from 'dotenv';

dotenv.config();
export class DriverService extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.DRIVER_URL;
  }

  willSendRequest(req: RequestOptions) {
    req.headers.set(
      'Authorization',
      `${this.context.req.header('Authorization')}`
    );
  }

  async getHello(): Promise<string> {
    const res = await this.get('/');
    return res;
  }

  async getInfo(): Promise<DriverInfoData | null> {
    const res = await this.get<DriverInfo>('schedule/me');
    return res.success ? res.data : null;
  }
}
