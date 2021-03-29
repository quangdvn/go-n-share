import { Driver } from '../driver/driver.entity';

export interface CreateScheduleResponse {
  success: boolean;
  data: Driver;
}

export interface GetInfoResponse {
  success: boolean;
  data: Driver;
}
