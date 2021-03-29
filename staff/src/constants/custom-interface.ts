import { Staff } from '../staff/staff.entity';

export interface GetInfoResponse {
  success: boolean;
  data: Staff;
}
