import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest';
import {
  StaffInfoResponse,
  StaffInfoData,
} from '../payloads/response.interface';
import * as dotenv from 'dotenv';

dotenv.config();
export class StaffService extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.STAFF_URL;
  }

  willSendRequest(req: RequestOptions) {
    req.headers.set('Cookie', `${this.context.req.headers.cookie}`);
  }

  async getHello(): Promise<string> {
    const res = await this.get('/');
    return res;
  }

  async getInfo(): Promise<StaffInfoData | null> {
    const res = await this.get<StaffInfoResponse>('/me');
    return res.success ? res.data : null;
  }
}
