import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest';
import { StaffInfo, StaffInfoData } from '../payloads/response.interface';

export class StaffService extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost:3001/staff';
  }

  willSendRequest(req: RequestOptions) {
    req.headers.set('Cookie', `${this.context.req.headers.cookie}`);
  }

  async getHello(): Promise<string> {
    const res = await this.get('/');
    return res;
  }

  async getInfo(): Promise<StaffInfoData | null> {
    const res = await this.get<StaffInfo>('/me');
    return res.success ? res.data : null;
  }
}
