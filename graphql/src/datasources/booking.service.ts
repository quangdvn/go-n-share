import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest';
import * as dotenv from 'dotenv';
import { GetAllBookingResponse } from '../payloads/response.interface';

dotenv.config();
export class BookingService extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.BOOKING_URL;
  }

  // willSendRequest(req: RequestOptions) {
  //   req.headers.set('Cookie', `${this.context.req.headers.cookie}`);
  // }

  async getHello(): Promise<string> {
    const res = await this.get('/');
    return res;
  }

  async getAllBooking() {
    const res = await this.get<GetAllBookingResponse>('booking');
    return res.success ? res.data : null;
  }
}
