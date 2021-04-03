import { RESTDataSource } from 'apollo-datasource-rest';
import * as dotenv from 'dotenv';
import { LogInType } from '../constants';
import { LogInResponse, LogOutResponse } from '../payloads/response.interface';

dotenv.config();
export class AuthService extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.AUTH_URL;
  }

  async getHello(): Promise<string> {
    const res = await this.get('/');
    return res;
  }

  async logIn(username: string, password: string, type: LogInType) {
    if (type === LogInType.DRIVER) {
      try {
        const res = await this.post<LogInResponse>('driver/login', {
          username,
          password,
        });
        return res.success ? { token: res.data } : null;
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
    } else if (type === LogInType.STAFF) {
      try {
        const res = await this.post<LogInResponse>('staff/login', {
          username,
          password,
        });
        return res.success ? { token: res.data } : null;
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
    } else {
      return null;
    }
  }

  async logOut() {
    const res = await this.delete<LogOutResponse>('staff/logout', {
      headers: {
        Cookie: `${this.context.req.headers.cookie}`,
      },
    });
    return res.success;
  }
}
